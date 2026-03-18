import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";
import {
  CoursesType,
  CreditType,
  Scale,
  Semester,
} from "./generated/client/enums";
import {
  Course,
  CourseDetail,
  CourseDetails,
  CourseOccasion,
  MasterName,
  Program,
  ProgramYear,
  RequirementUnion,
} from "./json_types";

/**
 * Maps string semesters from JSON to Prisma Enums
 */
function parseSemester(s: string): Semester {
  if (s === "HT") return Semester.HT;
  if (s === "VT") return Semester.VT;
  throw new Error(`Invalid semester: ${s}`);
}

/**
 * Maps your TypeScript RequirementUnion types to Database Enums
 */
function mapReqTypeToCreditType(t: string): CreditType | null {
  const mapping: Record<string, CreditType> = {
    CREDITS_ADVANCED_MASTER: CreditType.CREDITS_ADVANCED_MASTER,
    CREDITS_ADVANCED_PROFILE: CreditType.CREDITS_ADVANCED_PROFILE,
    CREDITS_PROFILE_TOTAL: CreditType.CREDITS_PROFILE_TOTAL,
    CREDITS_MASTER_TOTAL: CreditType.CREDITS_MASTER_TOTAL,
    CREDITS_TOTAL: CreditType.CREDITS_TOTAL,
    Total: CreditType.CREDITS_MASTER_TOTAL,
  };
  return mapping[t] || null;
}

async function main() {
  console.log("Starting data wipe...");
  await deleteAllData();
  console.log("Starting seed process...");
  await seedData();
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());

async function deleteAllData() {
  await prisma.courseOccasionBlock.deleteMany();
  await prisma.courseOccasionPeriod.deleteMany();
  await prisma.courseOccasionRecommendedMaster.deleteMany();
  await prisma.courseOccasion.deleteMany();
  await prisma.examination.deleteMany();
  await prisma.courseMaster.deleteMany();
  await prisma.course.deleteMany();
  await prisma.programCourse.deleteMany();
  await prisma.program.deleteMany();
  await prisma.courseRequirementCourse.deleteMany();
  await prisma.coursesRequirement.deleteMany();
  await prisma.creditRequirement.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.master.deleteMany();
}

async function seedData() {
  const programsFilePath = path.resolve("./data/programs.json");
  if (!fs.existsSync(programsFilePath)) return;

  const programs = JSON.parse(
    fs.readFileSync(programsFilePath, "utf8"),
  ) as Program[];

  for (const p of programs) {
    await seedProgramData(p);
    for (const year of p.years) {
      await seedCourseProgramData(year, p);
      await seedCoursesData(p.id, year.id);
      await seedMasterRequirementsData(p.id, year.id);
      await seedMastersData(p.id, year.id);
    }
  }
}

async function seedProgramData(p: Program) {
  await prisma.program.upsert({
    where: { program: p.id },
    update: { name: p.name, shortname: p.shortname },
    create: { program: p.id, name: p.name, shortname: p.shortname },
  });
}

async function seedCourseProgramData(year: ProgramYear, program: Program) {
  await prisma.programCourse.upsert({
    where: { id: year.id },
    update: { program: program.id },
    create: {
      id: year.id,
      startYear: year.year,
      program: program.id,
    },
  });
}

async function seedCoursesData(program: string, id: number) {
  const courseFilePath = path.resolve(`./data/${program}_${id}_courses.json`);
  const courseDetailsFilePath = path.resolve(
    `./data/${program}_${id}_detailed_courses.json`,
  );

  if (!fs.existsSync(courseFilePath) || !fs.existsSync(courseDetailsFilePath))
    return;

  const courses = JSON.parse(
    fs.readFileSync(courseFilePath, "utf8"),
  ) as Course[];
  const courseDetails = JSON.parse(
    fs.readFileSync(courseDetailsFilePath, "utf8"),
  ) as CourseDetails;

  console.log(
    `Seeding ${courses.length} courses for ${program} (Year ID: ${id})...`,
  );

  for (const c of courses) {
    const detailedInfo = courseDetails[c.code];
    await seedCourse(c, id, detailedInfo);
    await seedExamination(detailedInfo, c, id);

    const masterPrograms = Array.isArray(c.mastersPrograms)
      ? [
          ...new Set(
            c.mastersPrograms
              .map((m) => m?.trim())
              .filter((m): m is string => Boolean(m)),
          ),
        ]
      : [];

    if (masterPrograms.length) {
      await prisma.master.createMany({
        data: masterPrograms.map((master) => ({
          master,
          masterProgram: program,
        })),
        skipDuplicates: true,
      });

      await prisma.courseMaster.createMany({
        data: masterPrograms.map((master) => ({
          master,
          masterProgram: program,
          courseCode: c.code,
          programCourseID: id,
        })),
        skipDuplicates: true,
      });
    }

    for (const occasion of c.occasions) {
      await seedOccasion(occasion, c, id, program);
    }
  }
}

async function seedOccasion(
  occasion: CourseOccasion,
  c: Course,
  id: number,
  program: string,
) {
  const masters = Array.isArray(occasion.recommended_masters)
    ? occasion.recommended_masters.map((m: string) => m?.trim()).filter(Boolean)
    : [];

  const dbOccasion = await prisma.courseOccasion.create({
    data: {
      year: Number(occasion.year),
      semester: parseSemester(occasion.ht_or_vt),
      courseCode: c.code,
      programCourseID: id,
    },
  });

  if (masters.length) {
    await prisma.courseOccasionRecommendedMaster.createMany({
      data: masters.map((master: string) => ({
        courseOccasionId: dbOccasion.id,
        master,
        masterProgram: program,
      })),
    });
  }

  for (const period of occasion.periods) {
    const dbPeriod = await prisma.courseOccasionPeriod.create({
      data: {
        courseOccasionId: dbOccasion.id,
        period: Number(period.period),
      },
    });

    for (const block of period.blocks) {
      await prisma.courseOccasionBlock.create({
        data: {
          coursePeriodId: dbPeriod.id,
          block: Number(block),
        },
      });
    }
  }
}

async function seedMaster(m: string, program: string) {
  await prisma.master.upsert({
    where: { master_masterProgram: { master: m, masterProgram: program } },
    update: {},
    create: { master: m, masterProgram: program },
  });
}

async function seedExamination(
  detailedInfo: CourseDetail,
  c: Course,
  id: number,
) {
  if (
    Array.isArray(detailedInfo?.examinations) &&
    detailedInfo.examinations.length
  ) {
    await prisma.examination.createMany({
      data: detailedInfo.examinations.map((exam) => ({
        courseCode: c.code,
        programCourseID: id,
        credits: Number(exam.credits),
        module: exam.module,
        name: exam.name,
        scale:
          exam.scale === "U_THREE_FOUR_FIVE"
            ? Scale.U_THREE_FOUR_FIVE
            : Scale.G_OR_U,
      })),
    });
  }
}

async function seedCourse(c: Course, id: number, detailedInfo: CourseDetail) {
  const department = detailedInfo?.department ?? "";
  const mainField = Array.isArray(detailedInfo?.main_field)
    ? detailedInfo.main_field
    : [];

  await prisma.course.upsert({
    where: { code_programCourseID: { code: c.code, programCourseID: id } },
    update: {
      name: c.name,
      credits: Number(c.credits),
      level: c.level ?? "",
      link: c.link ?? "",
      examiner: detailedInfo?.examiner ?? "",
      prerequisitesText: detailedInfo?.prerequisites ?? "",
      scheduledHours: detailedInfo?.education_components?.[0] ?? 0,
      selfStudyHours: detailedInfo?.education_components?.[1] ?? 0,
      ecv: c.ecv ?? "",
      department: department,
      mainField: mainField,
    },
    create: {
      code: c.code,
      name: c.name,
      credits: Number(c.credits),
      level: c.level ?? "",
      link: c.link ?? "",
      examiner: detailedInfo?.examiner ?? "",
      prerequisitesText: detailedInfo?.prerequisites ?? "",
      scheduledHours: detailedInfo?.education_components?.[0] ?? 0,
      selfStudyHours: detailedInfo?.education_components?.[1] ?? 0,
      ecv: c.ecv ?? "",
      department: department,
      mainField: mainField,
      programCourseID: id,
    },
  });
}

async function seedMasterRequirementsData(program: string, id: number) {
  const masterRequirementsPath = path.resolve(
    `./data/${program}_${id}_master_requirements.json`,
  );

  if (!fs.existsSync(masterRequirementsPath)) {
    console.warn(`File not found: ${masterRequirementsPath}`);
    return;
  }

  const fileData = JSON.parse(
    fs.readFileSync(masterRequirementsPath, "utf8"),
  ) as Record<string, RequirementUnion[]>;

  const commonBase = fileData["COMMON_BASE"] || [];

  for (const [masterKey, specificReqs] of Object.entries(fileData)) {
    if (masterKey === "$schema" || masterKey === "COMMON_BASE") continue;

    const requirements = [
      ...commonBase,
      ...(specificReqs as RequirementUnion[]),
    ];

    console.log(`Seeding requirements for ${masterKey} - Year ID: ${id}`);

    await seedMaster(masterKey, program);

    const requirementRow = await prisma.requirement.create({
      data: {
        masterProgram: masterKey,
        program,
        programCourseID: id,
      },
    });

    for (const req of requirements) {
      if (req.type === "COURSE_SELECTION") {
        if (!req.courses || !req.courses.length) continue;

        // Create the requirement group
        const courseRequirement = await prisma.coursesRequirement.create({
          data: {
            type: CoursesType.COURSE_SELECTION,
            minCount: req.minCount ?? 1,
            requirementId: requirementRow.id,
          },
        });

        // Find the courses that belong to THIS year
        const linkedCourses = await prisma.course.findMany({
          where: {
            code: { in: req.courses as unknown as string[] },
            programCourseID: id, // Ensuring we link the correct year's course row
          },
        });

        if (linkedCourses.length === 0) {
          console.warn(
            `⚠️ No courses found for requirement in ${masterKey} (Year: ${id}). Expected: ${req.courses.join(", ")}`,
          );
        }

        if (linkedCourses.length) {
          await prisma.courseRequirementCourse.createMany({
            data: linkedCourses.map((course) => ({
              coursesRequirementId: courseRequirement.id,
              courseCode: course.code,
              programCourseID: id,
            })),
          });
        }
        continue;
      }

      // Handle Credit Requirements
      const creditType = mapReqTypeToCreditType(req.type);
      if (creditType) {
        await prisma.creditRequirement.create({
          data: {
            requirementId: requirementRow.id,
            type: creditType,
            credits: Number(req.credits),
          },
        });
      }

      // Handle Main Field Requirements
      if (req.type === "CREDITS_MAIN_FIELD_TOTAL") {
        await prisma.mainFieldRequirement.create({
          data: {
            type: "CREDITS_MAIN_FIELD_TOTAL",
            requirementId: requirementRow.id,
            credits: Number(req.credits),
            fields: req.fields as string[],
          },
        });
      }
    }
  }

  console.log(`Successfully seeded requirements for ${program} (ID: ${id})`);
}

async function seedMastersData(program: string, id: number) {
  const mastersFilePath = path.resolve(
    `./data/${program}_${id}_master_names.json`,
  );
  if (!fs.existsSync(mastersFilePath)) return;

  const mastersInfo = JSON.parse(
    fs.readFileSync(mastersFilePath, "utf8"),
  ) as MasterName[];
  for (const info of mastersInfo) {
    await prisma.master.upsert({
      where: {
        master_masterProgram: { master: info.id, masterProgram: program },
      },
      update: {
        name: info.name,
        icon: info.icon,
        style: info.style,
      },
      create: {
        master: info.id,
        name: info.name,
        icon: info.icon,
        style: info.style,
        masterProgram: program,
      },
    });
  }
}
