import { notFound } from "next/navigation";
import { TripForm } from "@/components/trips/TripForm";
import { auth } from "@/lib/auth";
import { getAllCountries } from "@/server/queries/countries";
import { getTripById } from "@/server/queries/trips";
import { updateTripAction } from "@/server/actions/trips";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const session = await auth();
  const [countries, trip] = await Promise.all([
    getAllCountries(),
    getTripById(tripId, session!.user.id),
  ]);

  if (!trip) notFound();

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4 pb-24 md:p-8 md:pb-8">
      <div>
        <h1 className="text-2xl font-semibold">Edit trip</h1>
        <p className="text-muted-foreground">Update the details of this trip.</p>
      </div>
      <TripForm
        action={updateTripAction.bind(null, trip.id)}
        submitLabel="Save changes"
        countries={countries}
        initialValues={{
          city: {
            id: trip.city.id,
            name: trip.city.name,
            countryCode: trip.city.countryCode,
            countryName: trip.city.country.name,
          },
          startDate: trip.startDate.toISOString().slice(0, 10),
          endDate: trip.endDate.toISOString().slice(0, 10),
          notes: trip.notes ?? "",
          rating: trip.rating ?? 0,
          transportationType: trip.transportationType,
        }}
      />
    </div>
  );
}
