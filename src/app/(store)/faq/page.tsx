import type { Metadata } from "next";
import { StoreFaq } from "@/components/store/StoreFaq";

export const metadata: Metadata = {
  title: "Preguntas frecuentes — Cosalka · Nutragen",
  description:
    "Respuestas sobre la fórmula, el formato de 500 ml, envíos, pagos y la garantía de 30 días.",
};

export default function FaqPage() {
  return <StoreFaq />;
}
