import { ENVIOS } from "./content";

/** Store shipping + cart economics (MXN). */
export const FREE_SHIPPING_THRESHOLD = 1500;
export const STANDARD_SHIPPING = 120;
export const EXPRESS_SHIPPING = 250;

export interface ShippingOption {
  id: "estandar" | "express";
  label: string;
  detail: string;
  price: (subtotal: number) => number;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "estandar",
    label: "Estándar · 24/72 h",
    detail: `Gratis desde ${formatMXN(FREE_SHIPPING_THRESHOLD)} · con seguimiento GPS`,
    price: (subtotal) =>
      subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING,
  },
  {
    id: "express",
    label: "Express · 24 h",
    detail: "Entrega al día siguiente en zonas metropolitanas",
    price: () => EXPRESS_SHIPPING,
  },
];

export function formatMXN(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Region promise shown at checkout, mirrors the ENVIOS block. */
export const SHIPPING_REGIONS = ENVIOS.regiones;
