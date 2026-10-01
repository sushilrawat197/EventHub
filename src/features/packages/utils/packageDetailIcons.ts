import { Banknote, Bus, BusFront, Car, CreditCard, Landmark, Plane, Ship, Smartphone, TrainFront, Wallet, type LucideIcon } from "lucide-react";
import type { PackageDetail } from "../types/packageDetail";
import { formatMoney, friendlyLabel } from "./packageDetailFormat";

export type BadgeTone = "blue" | "green" | "red" | "amber" | "slate";

const PAYMENT_ICONS: Record<string, LucideIcon> = {
  CASH: Banknote,
  BANK_TRANSFER: Landmark,
  MPESA: Smartphone,
  ECOCASH: Smartphone,
  CARD: CreditCard,
};

const TRANSPORT_ICONS: Record<string, LucideIcon> = {
  BUS: Bus,
  COACH: Bus,
  CAR: Car,
  TAXI: Car,
  PRIVATE_VEHICLE: Car,
  VAN: BusFront,
  MINIBUS: BusFront,
  SHUTTLE: BusFront,
  FLIGHT: Plane,
  AIR: Plane,
  TRAIN: TrainFront,
  BOAT: Ship,
  FERRY: Ship,
};

export function paymentIcon(method: string): LucideIcon {
  return PAYMENT_ICONS[method.toUpperCase()] ?? Wallet;
}

export function transportIcon(modeCode: string): LucideIcon {
  return TRANSPORT_ICONS[modeCode.replace(/\s+/g, "_")] ?? Bus;
}

export function statusTone(statusCode: string): BadgeTone {
  if (statusCode === "OPEN" || statusCode === "AVAILABLE") return "green";
  if (statusCode === "FULL" || statusCode === "SOLD_OUT" || statusCode === "CLOSED" || statusCode === "CANCELLED") return "red";
  if (statusCode === "LIMITED" || statusCode === "WAITLIST") return "amber";
  return "slate";
}

/** "M2,000" and "person" for "From M2,000 / person". */
export function fromPriceParts(pkg: PackageDetail) {
  const pricing = pkg.pricing;
  const price = formatMoney(pricing?.fromPrice, pricing?.currency);
  const basis = friendlyLabel(pricing?.pricingBasis)?.replace(/^Per /, "").toLowerCase();
  return { price, basis };
}
