"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { customCitySchema } from "@/lib/validations/city";

export type CreateCityResult = { error: string } | { success: true; cityId: string };

export async function createCustomCityAction(
  _prevState: CreateCityResult | null,
  formData: FormData
): Promise<CreateCityResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = customCitySchema.safeParse({
    name: formData.get("name"),
    countryCode: formData.get("countryCode"),
    lat: formData.get("lat"),
    lng: formData.get("lng"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const country = await prisma.country.findUnique({
    where: { code: parsed.data.countryCode },
  });
  if (!country) return { error: "Unknown country" };

  const city = await prisma.city.create({
    data: {
      name: parsed.data.name,
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      countryCode: parsed.data.countryCode,
      source: "CUSTOM",
      createdByUserId: session.user.id,
    },
  });

  return { success: true, cityId: city.id };
}
