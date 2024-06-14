import { PrismaClient, Department } from "@prisma/client";
import { hashPassword } from "./../src/utilities";

const prisma = new PrismaClient();

async function populateDatabase() {
  const departments: Partial<Department>[] = [
    {
      name: "Holy Angel University",
      title: "HAU",
      seriesPrefix: "000",
    },
    {
      name: "Office of the President",
      title: "OOP",
      seriesPrefix: "1000",
    },
    {
      name: "Office of Institutional Effectiveness",
      title: "OIE",
      seriesPrefix: "2000",
    },
    {
      name: "Center for Kapampangan Studies",
      title: "CKS",
      seriesPrefix: "3000",
    },
    {
      name: "Insitute for Christian Formation & Social Integration",
      title: "CFS",
      seriesPrefix: "4000",
    },
    {
      name: "Office of Internal Affairs",
      title: "OIA",
      seriesPrefix: "5000",
    },
    {
      name: "Human Resource Management Office",
      title: "HRO",
      seriesPrefix: "6000",
    },
    {
      name: "Finance & Resources Management Services",
      title: "FIN",
      seriesPrefix: "7000",
    },
    {
      name: "Records Systems and Services",
      title: "RSS",
      seriesPrefix: "8000",
    },
    {
      name: "Academic Affairs Cluster",
      title: "AAC",
      seriesPrefix: "9000",
    },
    {
      name: "Student Services & Affairs",
      title: "SSA",
      seriesPrefix: "1100",
    },
    {
      name: "Marketing (External Affairs & Corporate Communications)",
      title: "MCS",
      seriesPrefix: "2100",
    },
    {
      name: "Information Technology Systems & Services",
      title: "ITS",
      seriesPrefix: "3100",
    },
    {
      name: "Campus Services & Development Office",
      title: "CSD",
      seriesPrefix: "4100",
    },
  ];
  await prisma.department.createMany({
    // @ts-ignore
    data: departments.map((d) => d),
  });
  const userRoles = ["superadmin", "originator-per-document", "document-controller", "quality-management-representative"];
  await prisma.userRole.createMany({
    // @ts-ignore
    data: userRoles.map((role) => ({ name: role, abilities: JSON.stringify(["*"]) })),
  });

  const systemUserRoles = await prisma.userRole.findMany();

  Promise.all(
    systemUserRoles.map(async (role) => {
      await prisma.user.create({
        // @ts-ignore
        data: {
          email: `${role.name}@domain.com`,
          username: role.name,
          name: `${role.name} account`,
          password: hashPassword("defaultpassword"),
          userRoleId: +role.id,
        },
      });
    })
  );
}

async function clearDatabase() {
  // Clear documents table
  await prisma.documentNotice.deleteMany({});
  await prisma.document.deleteMany({});
}

async function seed() {
  populateDatabase();
  // clearDatabase();
}

seed().finally(() => prisma.$disconnect());
