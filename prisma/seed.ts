import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";
import {
  CoursesType,
  CreditType,
  Scale,
  Semester,
} from "./generated/client/enums";
import { entries } from "lodash";
import { Course, CourseDetail, CourseDetails, MasterRequirement, MasterRequirements, Program, ProgramYear } from "./json_types";

function parseSemester(s: string): Semester {
  if (s === "HT") return Semester.HT;
  if (s === "VT") return Semester.VT;
  throw new Error(`Invalid semester: ${s}`);
}

function mapReqTypeToCreditType(t: string): CreditType | null {
  // input uses: "A-level" | "G-level" | "Total"
  if (t === "A-level") return CreditType.A_LEVEL;
  if (t === "G-level") return CreditType.G_LEVEL;
  if (t === "Total") return CreditType.TOTAL;
  return null;
}

async function main() {
  await delateAllData();
  await seedData();
  //await seedMastersData();
  //await seedMasterRequirementsData();
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());

async function delateAllData() {
  await prisma.courseOccasionBlock.deleteMany();
  await prisma.courseOccasionPeriod.deleteMany();
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
  const programs = JSON.parse(
    fs.readFileSync(programsFilePath, "utf8"),
  ) as Program[];
  for (const p of programs) {
    seedProgramData(p);
    for (const year of p.years) {
      await seedCourseProgramData(year, p);
      await seedCoursesData(p.id, year.id);
      await seedMasterRequirementsData(p.id, year.id);
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

async function seedCourseProgramData(
  year: ProgramYear,
  program: Program,
) {
  await prisma.programCourse.upsert({
    where: {
      id: year.id,
    },
    update: {
      program: program.id,
    },
    create: {
      id: year.id,
      startYear: year.year,
      program: program.id,
    },
  });
}

async function seedCoursesData(program: string, id: number) {
  const courseFilePath = path.resolve(`./data/${program}_${id}_courses.json`);
  const courses = JSON.parse(fs.readFileSync(courseFilePath, "utf8")) as Course[];
  console.log(`Seeding ${courses.length} courses for program ${program} - ${id} ...`);

  const courseDetailsFilePath = path.resolve(
    `./data/${program}_${id}_detailed_courses.json`,
  );
  const courseDetails = JSON.parse(
    fs.readFileSync(courseDetailsFilePath, "utf8"),
  ) as CourseDetails;

  for (const c of courses) {
    const detailedInfo = courseDetails[c.code];
    await seedCourse(c, id, detailedInfo);
    await seedExamination(detailedInfo, c, id);

    for (const m of c.mastersPrograms ?? []) {
      await seedMaster(m);
      await seedMasterCourse(m, c, id);
    }
    for (const occasion of c.occasions) {
      // Create CourseOccasion
      await seedOccasion(occasion, c, id);
    }
  }
  console.log(`${program} - ${id} courses seeding complete`);
}

async function seedOccasion(occasion: { year: number; semester: string; ht_or_vt: string; periods: { period: number; blocks: number[]; }[]; recommended_masters: string[]; }, c: Course, id: number) {
  const masters = Array.isArray(occasion.recommended_masters)
    ? occasion.recommended_masters.map((m) => m?.trim()).filter(Boolean)
    : [];

  const dbOccasion = await prisma.courseOccasion.create({
    data: {
      year: Number(occasion.year),
      semester: parseSemester(occasion.ht_or_vt),
      courseCode: c.code,
      programCourseID: id,
      ...(masters.length
        ? {
          recommendedMaster: {
            connect: masters.map((master) => ({ master })),
          },
        }
        : {}),
    },
  });
  // Create periods
  for (const period of occasion.periods) {
    const dbPeriod = await prisma.courseOccasionPeriod.create({
      data: {
        courseOccasionId: dbOccasion.id,
        period: Number(period.period),
      },
    });
    // Create blocks
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

async function seedMasterCourse(m: string, c: Course, id: number) {
  await prisma.courseMaster.upsert({
    where: { courseMasterId: { master: m, courseCode: c.code } },
    update: {},
    create: { master: m, courseCode: c.code, programCourseID: id },
  });
}

async function seedMaster(m: string) {
  await prisma.master.upsert({
    where: { master: m },
    update: {},
    create: { master: m },
  });
}

async function seedExamination(detailedInfo: CourseDetail, c: Course, id: number) {
  if (Array.isArray(detailedInfo?.examinations) &&
    detailedInfo.examinations.length) {
    await prisma.examination.createMany({
      data: detailedInfo.examinations.map(
        (exam: {
          credits: number;
          module: string;
          name: string;
          scale?: string;
        }) => ({
          courseCode: c.code,
          programCourseID: id,
          credits: Number(exam.credits),
          module: exam.module,
          name: exam.name,
          scale: exam.scale === "U_THREE_FOUR_FIVE"
            ? Scale.U_THREE_FOUR_FIVE
            : Scale.G_OR_U,
        })
      ),
    });
  }
}

async function seedCourse(c: Course, id: number, detailedInfo: CourseDetail) {
  await prisma.course.upsert({
    where: { code_programCourseID: { code: c.code, programCourseID: id } },
    update: {
      name: c.name,
      credits: Number(c.credits),
      level: c.level ?? "",
      link: c.link ?? "",
      examiner: detailedInfo?.examiner ?? "",
      prerequisitesText: detailedInfo?.prerequisites ?? "",
      scheduledHours: detailedInfo?.education_components[0] ?? 0,
      selfStudyHours: detailedInfo?.education_components[1] ?? 0,
      ecv: c.ecv ?? "",
    },
    create: {
      code: c.code,
      name: c.name,
      credits: Number(c.credits),
      level: c.level ?? "",
      link: c.link ?? "",
      examiner: detailedInfo?.examiner ?? "",
      prerequisitesText: detailedInfo?.prerequisites ?? "",
      scheduledHours: detailedInfo?.education_components[0] ?? 0,
      selfStudyHours: detailedInfo?.education_components[1] ?? 0,
      ecv: c.ecv ?? "",
      programCourseID: id,
    },
  });
}

async function seedMasterRequirementsData(program: string, id: number) {
  const masterRequirementsPath = path.resolve(
    `./data/${program}_${id}_master_requirements.json`,
  );
  const masterRequirements = JSON.parse(
    fs.readFileSync(masterRequirementsPath, "utf8"),
  ) as MasterRequirements;

  for (const [master, requirements] of Object.entries(masterRequirements)) {
    await seedMaster(master);

    const requirementRow = await prisma.requirement.create({
      data: { masterProgram: master },
    });

    for (const req of requirements) {
      if (req.type === "Courses") {
        if (!req.courses.length) continue;
        const courseRequirement = await prisma.coursesRequirement.create({
          data: {
            type: CoursesType.COURSES_OR,
            requirementId: requirementRow.id,
          },
        });
        const linkedCourses = await prisma.course.findMany({
          where: { code: { in: req.courses } },
          select: { code: true, programCourseID: true },
        });
        const missingCourses = req.courses.filter(
          (code) => !linkedCourses.some((course) => course.code === code),
        );
        if (missingCourses.length) {
          console.warn(
            `Missing courses for requirement ${master}: ${missingCourses.join(", ")}`,
          );
        }
        if (linkedCourses.length) {
          await prisma.courseRequirementCourse.createMany({
            data: linkedCourses.map((course) => ({
              coursesRequirementId: courseRequirement.id,
              courseCode: course.code,
              programCourseID: course.programCourseID,
            })),
          });
        }
        continue;
      }

      const creditType = mapReqTypeToCreditType(req.type);
      if (!creditType) {
        throw new Error(`Unsupported requirement type: ${req.type}`);
      }

      await prisma.creditRequirement.create({
        data: {
          requirementId: requirementRow.id,
          type: creditType,
          credits: req.credits,
        },
      });
    }

    console.log(`Seeded requirements for master ${master}`);
  }
}
interface MasterInfo {
  id: string;
  name: string;
  icon: string;
  style: string;
}

async function seedMastersData() {
  const mastersFilePath = path.resolve("./data/6CMJU_master_names.json");
  const mastersInfo = JSON.parse(
    fs.readFileSync(mastersFilePath, "utf8"),
  ) as MasterInfo[];
  for (const info of mastersInfo) {
    await prisma.master.upsert({
      where: { master: info.id },
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
      },
    });
  }
}
