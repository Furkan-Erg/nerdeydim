import { z } from "zod";

export const transportationTypes = [
  "PLANE",
  "TRAIN",
  "CAR",
  "BUS",
  "BOAT",
  "BICYCLE",
  "WALKING",
  "OTHER",
] as const;

export const tripSchema = z
  .object({
    cityId: z.string().min(1, "Choose a city"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    notes: z.string().max(5000).optional().or(z.literal("")),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    transportationType: z.enum(transportationTypes),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

export type TripInput = z.infer<typeof tripSchema>;
