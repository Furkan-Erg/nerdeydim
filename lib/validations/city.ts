import { z } from "zod";

export const customCitySchema = z.object({
  name: z.string().trim().min(1, "City name is required").max(200),
  countryCode: z.string().length(2, "Choose a country"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export type CustomCityInput = z.infer<typeof customCitySchema>;
