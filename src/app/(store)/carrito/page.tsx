import type { Metadata } from "next";
import { StoreCart } from "@/components/store/StoreCart";

export const metadata: Metadata = {
  title: "Cesta — Cosalka · Nutragen",
  description: "Tu protocolo Nutragen listo para el checkout seguro.",
};

export default function CarritoPage() {
  return <StoreCart />;
}
