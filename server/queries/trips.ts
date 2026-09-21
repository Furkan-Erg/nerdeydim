import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getTripsForUser = cache(async (userId: string) => {
  return prisma.trip.findMany({
    where: { userId },
    include: { city: { include: { country: true } } },
    orderBy: { startDate: "desc" },
  });
});

export type TripWithCity = Awaited<ReturnType<typeof getTripsForUser>>[number];

export async function getTripById(tripId: string, userId: string) {
  return prisma.trip.findFirst({
    where: { id: tripId, userId },
    include: { city: { include: { country: true } } },
  });
}
