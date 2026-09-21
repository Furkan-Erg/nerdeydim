import {
  Bike,
  Bus,
  Car,
  Footprints,
  Plane,
  Ship,
  TrainFront,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { TransportationType } from "@prisma/client";

export const transportationMeta: Record<
  TransportationType,
  { label: string; icon: LucideIcon }
> = {
  PLANE: { label: "Plane", icon: Plane },
  TRAIN: { label: "Train", icon: TrainFront },
  CAR: { label: "Car", icon: Car },
  BUS: { label: "Bus", icon: Bus },
  BOAT: { label: "Boat", icon: Ship },
  BICYCLE: { label: "Bicycle", icon: Bike },
  WALKING: { label: "Walking", icon: Footprints },
  OTHER: { label: "Other", icon: HelpCircle },
};
