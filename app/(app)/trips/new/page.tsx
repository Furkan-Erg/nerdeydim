import { TripForm } from "@/components/trips/TripForm";
import { prisma } from "@/lib/prisma";
import { getAllCountries } from "@/server/queries/countries";
import { createTripAction } from "@/server/actions/trips";

export default async function NewTripPage({
  searchParams,
}: {
  searchParams: Promise<{ cityId?: string }>;
}) {
  const { cityId } = await searchParams;
  const [countries, preselectedCity] = await Promise.all([
    getAllCountries(),
    cityId
      ? prisma.city.findUnique({
          where: { id: cityId },
          include: { country: { select: { name: true, code: true } } },
        })
      : null,
  ]);

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 pb-24 md:p-8 md:pb-8">
      <div>
        <h1 className="text-2xl font-semibold">Add a trip</h1>
        <p className="text-muted-foreground">Log where you went and how it was.</p>
      </div>
      <TripForm
        action={createTripAction}
        submitLabel="Add trip"
        countries={countries}
        initialValues={{
          city: preselectedCity
            ? {
                id: preselectedCity.id,
                name: preselectedCity.name,
                countryCode: preselectedCity.countryCode,
                countryName: preselectedCity.country.name,
              }
            : null,
          startDate: "",
          endDate: "",
          notes: "",
          rating: 0,
          transportationType: "PLANE",
        }}
      />
    </div>
  );
}
