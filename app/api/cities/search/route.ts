import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const countryCode = searchParams.get("countryCode")?.trim() || undefined;

  if (q.length < 2) {
    return NextResponse.json({ cities: [] });
  }

  const cities = await prisma.city.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
      isUnspecified: false,
      ...(countryCode ? { countryCode } : {}),
      OR: [{ source: "CURATED" }, { createdByUserId: session.user.id }],
    },
    include: { country: { select: { name: true, code: true } } },
    orderBy: [{ population: "desc" }],
    take: 20,
  });

  return NextResponse.json({
    cities: cities.map((c) => ({
      id: c.id,
      name: c.name,
      countryCode: c.countryCode,
      countryName: c.country.name,
      lat: c.lat,
      lng: c.lng,
      source: c.source,
    })),
  });
}
