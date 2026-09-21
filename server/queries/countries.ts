import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getAllCountries = cache(async () => {
  return prisma.country.findMany({
    select: { code: true, name: true },
    orderBy: { name: "asc" },
  });
});
