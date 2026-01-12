import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";
import { CoursesType, CreditType, Semester } from "./generated/client/enums";
import { entries } from "lodash";
import type { MasterRequirement } from "@/app/(main)/(mastersRequirementsBar)/types";

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
  await seedCoursesData();
  await seedMastersData();
  await seedMasterRequirementsData();
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());

async function seedCoursesData() {
  const courseFilePath = path.resolve("./data/6CMJU_courses.json");
  const courses = JSON.parse(fs.readFileSync(courseFilePath, "utf8"));

  const courseDetailsFilePath = path.resolve("./data/6CMJU_detailed_courses.json");
  const courseDetails = JSON.parse(fs.readFileSync(courseDetailsFilePath, "utf8"));

  // DEV ONLY: clear existing data (children first)
  await prisma.courseOccasionPeriod.deleteMany();
  await prisma.courseOccasionBlock.deleteMany();
  await prisma.courseOccasion.deleteMany();
  await prisma.courseMaster.deleteMany();
  await prisma.course.deleteMany();
  await prisma.program.deleteMany();

  for (const c of courses) {
    const detailedInfo = courseDetails[c.code];
    await prisma.course.upsert({
      where: { code: c.code },
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
      },
    });

    for (const p of c.program ?? []) {
      await prisma.program.upsert({
        where: { program: p },
        update: {},
        create: { program: p },
      });

      await prisma.course.update({
        where: { code: c.code },
        data: {
          Program: { connect: { program: p } },
        },
      });
    }

    for (const m of c.mastersPrograms ?? []) {
      await prisma.master.upsert({
        where: { master: m },
        update: {},
        create: { master: m },
      });

      await prisma.courseMaster.upsert({
        where: { courseMasterId: { master: m, courseCode: c.code } },
        update: {},
        create: { master: m, courseCode: c.code },
      });
    }

    for (const slot of c.slots ?? []) {
      const occ = await prisma.courseOccasion.create({
        data: {
          year: Number(slot.year),
          semester: parseSemester(slot.semester),
          courseCode: c.code,
        },
      });

      if (Array.isArray(slot.periods) && slot.periods.length) {
        await prisma.courseOccasionPeriod.createMany({
          data: slot.periods.map((p: string) => ({
            courseOccasionId: occ.id,
            period: Number(p),
          })),
        });
      }

      if (Array.isArray(slot.blocks) && slot.blocks.length) {
        await prisma.courseOccasionBlock.createMany({
          data: slot.blocks.map((b: string) => ({
            courseOccasionId: occ.id,
            block: Number(b),
          })),
        });
      }
    }
  }

  console.log(`Seeded ${courses.length} courses`);
}

async function seedMasterRequirementsData() {
  const masterRequirementsPath = path.resolve(
    "./data/6CMJU_master_requirements.json"
  );
  const masterRequirements = JSON.parse(
    fs.readFileSync(masterRequirementsPath, "utf8")
  ) as Record<string, MasterRequirement[]>;

  // DEV ONLY: clear existing data (children first)
  await prisma.coursesRequirement.deleteMany();
  await prisma.creditRequirement.deleteMany();
  await prisma.requirement.deleteMany();

  for (const [master, requirements] of entries(masterRequirements)) {
    await prisma.master.upsert({
      where: { master },
      update: {},
      create: { master },
    });

    const requirementRow = await prisma.requirement.create({
      data: { masterProgram: master },
    });

    for (const req of requirements) {
      if (req.type === "Courses") {
        if (!req.courses.length) continue;
        await prisma.coursesRequirement.create({
          data: {
            type: CoursesType.COURSES_OR,
            requirementId: requirementRow.id,
            courses: { connect: req.courses.map((code) => ({ code })) },
          },
        });
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
    fs.readFileSync(mastersFilePath, "utf8")
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
