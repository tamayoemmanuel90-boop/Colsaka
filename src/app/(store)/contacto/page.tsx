import type { Metadata } from "next";
import { StoreContact } from "@/components/store/StoreContact";

export const metadata: Metadata = {
  title: "Contacto — Cosalka · Nutragen",
  description:
    "Escríbenos: pedidos, asesoría de piel, distribución y prensa. Respuesta el mismo día.",
};

export default function ContactoPage() {
  return <StoreContact />;
}
