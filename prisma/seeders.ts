import { PrismaClient, Department } from "@prisma/client";
import { hashPassword } from "./../src/utilities";

const prisma = new PrismaClient();

const makeArcronyms = (words: string) => {
  return words
    .toLowerCase()
    .replaceAll("of", "")
    .replaceAll("and", "")
    .split(" ")
    .map((i) => i.charAt(0))
    .join("")
    .toLowerCase();
};

async function seed() {
  const userRoles = ["superadmin", "originator-per-document", "document-controller", "quality-management-representative"];
  const departments = [
    "School of Engineering and Architecture",
    "School of Business & Accountancy",
    "School of Education",
    "School of Arts and Sciences",
    "School of College",
  ];

  await prisma.department.createMany({
    data: departments.map((department) => ({
      name: department,
    })),
  });

  await prisma.userRole.createMany({
    data: userRoles.map((role) => ({
      name: role,
      abilities: JSON.stringify(["*"]),
    })),
  });

  await prisma.user.createMany({
    data: departments.map((department: any) => ({
      name: `${department.replaceAll(" ", "").toLowerCase()} Account`,
      email: `${department}@domain.com`,
      username: `${makeArcronyms(department)}-williams-2024`,
      password: hashPassword(`${makeArcronyms(department)}account$$2024`),
      isVerified: true,
      departmentId: 1,
    })),
  });
}

seed().finally(() => prisma.$disconnect());
