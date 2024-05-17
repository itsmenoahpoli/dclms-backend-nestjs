import { PrismaClient, Department } from "@prisma/client";
import { hashPassword } from "./../src/utilities";

const prisma = new PrismaClient();

const makeAcronyms = (words: string) => {
  return words
    .toLowerCase()
    .replaceAll("of", "")
    .replaceAll("and", "")
    .split(" ")
    .map((i) => i.charAt(0))
    .join("")
    .toLowerCase();
};

async function populateDatabase() {
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
  const originatorPerDocument = await prisma.userRole.findUnique({
    where: {
      name: userRoles[1],
    },
  });
  await prisma.user.createMany({
    data: departments.map((department: any) => ({
      name: `${department.replaceAll(" ", "").toLowerCase()} Account`,
      email: `${department}@domain.com`,
      username: `${makeAcronyms(department)}-user-2024`,
      password: hashPassword(`defaultpassword`),
      isVerified: true,
      departmentId: department.id,
      userRoleId: originatorPerDocument.id,
    })),
  });
  const documentControllerRole = await prisma.userRole.findUnique({
    where: {
      name: userRoles[2],
    },
  });
  const qualityManagementRepresetativeRole = await prisma.userRole.findUnique({
    where: {
      name: userRoles[3],
    },
  });
  await prisma.user.createMany({
    data: [
      {
        name: `DocumentController Account`,
        email: `document-controller@domain.com`,
        username: `documentcontroller-user-2024`,
        password: hashPassword(`defaultpassword`),
        isVerified: true,
        departmentId: null,
        userRoleId: documentControllerRole.id,
      },
      {
        name: `QualityManagementRepresentative Account`,
        email: `quality-management-representative@domain.com`,
        username: `qualitymanagementrepresentative-user-2024`,
        password: hashPassword(`defaultpassword`),
        isVerified: true,
        departmentId: null,
        userRoleId: qualityManagementRepresetativeRole.id,
      },
    ],
  });
  const superadminRole = await prisma.userRole.findUnique({
    where: {
      name: userRoles[0],
    },
  });
  await prisma.user.create({
    data: {
      name: `Superadmin Account`,
      email: `superadmin@domain.com`,
      username: `superadmin-user-2024`,
      password: hashPassword(`defaultpassword`),
      isVerified: true,
      departmentId: null,
      userRoleId: superadminRole.id,
    },
  });
  await prisma.user.update({
    where: {
      id: 8,
    },
    data: {
      password: hashPassword("defaultaccount"),
    },
  });
}

async function clearDatabase() {
  // ["superadmin", "originator-per-document", "document-controller", "quality-management-representative"].forEach(async (role) => {
  //   await prisma.userRole.delete({ where: { name: role } });
  // });
  // const users = await prisma.user.findMany({
  //   where: {
  //     userRoleId: {
  //       not: 1,
  //     },
  //   },
  // });
  // users.forEach(async (user) => await prisma.user.delete({ where: { id: user.id } }));
  // const departments = await prisma.department.findMany();
  // departments.forEach(async (department) => await prisma.department.delete({ where: { id: department.id } }));
}

async function seed() {
  // populateDatabase();
  // clearDatabase();
}

seed().finally(() => prisma.$disconnect());
