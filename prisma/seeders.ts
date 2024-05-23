import { PrismaClient, Department } from "@prisma/client";
import { hashPassword } from "./../src/utilities";

const prisma = new PrismaClient();

async function populateDatabase() {
  // const departments: Partial<Department>[] = [
  //   {
  //     name: "Holy Angel University",
  //     title: "HAU",
  //     seriesPrefix: "000",
  //   },
  //   {
  //     name: "Office of the President",
  //     title: "OOP",
  //     seriesPrefix: "1000",
  //   },
  //   {
  //     name: "Office of Institutional Effectiveness",
  //     title: "OIE",
  //     seriesPrefix: "2000",
  //   },
  //   {
  //     name: "Center for Kapampangan Studies",
  //     title: "CKS",
  //     seriesPrefix: "3000",
  //   },
  //   {
  //     name: "Insitute for Christian Formation & Social Integration",
  //     title: "CFS",
  //     seriesPrefix: "4000",
  //   },
  //   {
  //     name: "Office of Internal Affairs",
  //     title: "OIA",
  //     seriesPrefix: "5000",
  //   },
  //   {
  //     name: "Human Resource Management Office",
  //     title: "HRO",
  //     seriesPrefix: "6000",
  //   },
  //   {
  //     name: "Finance & Resources Management Services",
  //     title: "FIN",
  //     seriesPrefix: "7000",
  //   },
  //   {
  //     name: "Records Systems and Services",
  //     title: "RSS",
  //     seriesPrefix: "8000",
  //   },
  //   {
  //     name: "Academic Affairs Cluster",
  //     title: "AAC",
  //     seriesPrefix: "9000",
  //   },
  //   {
  //     name: "Student Services & Affairs",
  //     title: "SSA",
  //     seriesPrefix: "1100",
  //   },
  //   {
  //     name: "Marketing (External Affairs & Corporate Communications)",
  //     title: "MCS",
  //     seriesPrefix: "2100",
  //   },
  //   {
  //     name: "Information Technology Systems & Services",
  //     title: "ITS",
  //     seriesPrefix: "3100",
  //   },
  //   {
  //     name: "Campus Services & Development Office",
  //     title: "CSD",
  //     seriesPrefix: "4100",
  //   },
  // ];
  // await prisma.department.createMany({
  //   // @ts-ignore
  //   data: departments.map((d) => d),
  // });
  // const userRoles = ["originator-per-document", "document-controller", "quality-management-representative"];
  // await prisma.userRole.createMany({
  //   // @ts-ignore
  //   data: userRoles.map((role) => ({ name: role, abilities: JSON.stringify(["*"]) })),
  // });
}

async function clearDatabase() {
  // Fetch all table names
  // @ts-ignore
  // const tableNames = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`;
  // Drop all tables
  // @ts-ignore
  // for (const { tablename } of tableNames) {
  //   await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${tablename}" CASCADE;`);
  // }
}

async function seed() {
  populateDatabase();
  // clearDatabase();
}

seed().finally(() => prisma.$disconnect());
