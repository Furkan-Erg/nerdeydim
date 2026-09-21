"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tripSchema } from "@/lib/validations/trip";

export type ActionResult = { error: string } | { success: true };

function parseTripForm(formData: FormData) {
  return tripSchema.safeParse({
    cityId: formData.get("cityId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    notes: formData.get("notes"),
    rating: formData.get("rating") || undefined,
    transportationType: formData.get("transportationType"),
  });
}

function revalidateTripPages() {
  revalidatePath("/map");
  revalidatePath("/dashboard");
  revalidatePath("/timeline");
  revalidatePath("/statistics");
}

export async function createTripAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = parseTripForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { cityId, startDate, endDate, notes, rating, transportationType } = parsed.data;

  await prisma.trip.create({
    data: {
      userId: session.user.id,
      cityId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      notes: notes || null,
      rating: rating ?? null,
      transportationType,
    },
  });

  revalidateTripPages();
  redirect("/timeline");
}

export async function updateTripAction(
  tripId: string,
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user.id },
  });
  if (!existing) return { error: "Trip not found" };

  const parsed = parseTripForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { cityId, startDate, endDate, notes, rating, transportationType } = parsed.data;

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      cityId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      notes: notes || null,
      rating: rating ?? null,
      transportationType,
    },
  });

  revalidateTripPages();
  redirect("/timeline");
}

export async function deleteTripAction(tripId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user.id },
  });
  if (!existing) return { error: "Trip not found" };

  await prisma.trip.delete({ where: { id: tripId } });

  revalidateTripPages();
  return { success: true };
}
