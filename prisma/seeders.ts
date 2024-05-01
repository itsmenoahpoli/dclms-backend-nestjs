import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./../src/utilities";

const prisma = new PrismaClient();

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
    data: userRoles.map((user) => ({
      name: `${user} Account`,
      email: `${user}@domain.com`,
      password: hashPassword(`${user}account$$2024`),
      isVerified: true,
      departmentId: 1,
    })),
  });
}

seed().finally(() => prisma.$disconnect());
