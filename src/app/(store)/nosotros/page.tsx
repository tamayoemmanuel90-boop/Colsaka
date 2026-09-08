import type { Metadata } from "next";
import { StoreAbout } from "@/components/store/StoreAbout";

export const metadata: Metadata = {
  title: "Nosotros · Cosalka International — Nutragen",
  description:
    "Padre e hijo, doce años de investigación botánica. Una marca de Cosalka, hecha en México.",
};

export default function NosotrosPage() {
  return <StoreAbout />;
}
