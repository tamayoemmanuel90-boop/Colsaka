import type { Metadata } from "next";
import { StoreHome } from "@/components/store/StoreHome";

export const metadata: Metadata = {
  title: "Tienda · Colección Nutragen 500 ml — Cosalka",
  description:
    "La colección Nutragen completa: Paso 1 Treatment, Paso 2 Moisturizer y el Paquete Doble Acción. Tecnología nutragenética, 500 ml, hecho en México.",
};

export default function TiendaPage() {
  return <StoreHome />;
}
