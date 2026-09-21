import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import countriesData from "./seed-data/countries.json";
import citiesData from "./seed-data/cities.json";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existingCountries = await prisma.country.count();
  if (existingCountries > 0) {
    console.log(
      `Reference data already seeded (${existingCountries} countries) — skipping.`
    );
    return;
  }

  console.log(`Seeding ${countriesData.length} countries...`);
  await prisma.country.createMany({
    data: countriesData,
    skipDuplicates: true,
  });

  console.log(`Seeding ${citiesData.length} curated cities...`);
  const BATCH_SIZE = 2000;
  for (let i = 0; i < citiesData.length; i += BATCH_SIZE) {
    const batch = citiesData.slice(i, i + BATCH_SIZE).map((c) => ({
      name: c.name,
      lat: c.lat,
      lng: c.lng,
      population: c.population,
      countryCode: c.countryCode,
    }));
    await prisma.city.createMany({ data: batch });
    process.stdout.write(
      `  ${Math.min(i + BATCH_SIZE, citiesData.length)}/${citiesData.length}\r`
    );
  }
  console.log(`\nSeeded curated cities.`);

  console.log("Seeding one 'Unspecified' city per country...");
  await prisma.city.createMany({
    data: countriesData.map((c) => ({
      name: `${c.name} (unspecified city)`,
      lat: c.centroidLat,
      lng: c.centroidLng,
      countryCode: c.code,
      isUnspecified: true,
    })),
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
