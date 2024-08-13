import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const readSpeedData: Prisma.ReadSpeedCreateInput[] = [{ speed: "33 1/3" }, { speed: "45" }, { speed: "78" }];

const stateData: Prisma.StateCreateInput[] = [
  { name: "Mint (M)" },
  { name: "Near Mint (NM or M-)" },
  { name: "Very Good Plus (VG+)" },
  { name: "Very Good (VG)" },
  { name: "Good Plus (G+)" },
  { name: "Good (G)" },
  { name: "Fair (F)" },
  { name: "Poor (P)" },
];

const pocketStateData: Prisma.PocketStateCreateInput[] = [
  { name: "Mint (M)" },
  { name: "Near Mint (NM or M-)" },
  { name: "Very Good Plus (VG+)" },
  { name: "Very Good (VG)" },
  { name: "Good Plus (G+)" },
  { name: "Good (G)" },
  { name: "Fair (F)" },
  { name: "Poor (P)" },
];

const vinylData: Prisma.VinylCreateInput = {
  catNumber: "LX 8235",
  label: {
    create: {
      name: "Columbia",
    },
  },
  readSpeed: {
    create: {
      speed: "78",
    },
  },
};

async function main() {
  console.log(`Start seeding...`);

  for (const value of readSpeedData) {
    const readSpeed = await prisma.readSpeed.create({
      data: value,
    });
    console.log(`Created read speed with id: ${readSpeed.speed}`);
  }

  for (const value of stateData) {
    const state = await prisma.state.create({
      data: value,
    });
    console.log(`Created vinyl state with id: ${state.name}`);
  }

  for (const value of pocketStateData) {
    const pocketState = await prisma.pocketState.create({
      data: value,
    });
    console.log(`Created pocket state with id: ${pocketState.name}`);
  }

  await prisma.vinyl.create({ data: vinylData });

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
