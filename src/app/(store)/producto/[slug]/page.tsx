import type { Metadata } from "next";
import { StoreProduct } from "@/components/store/StoreProduct";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ")} · Nutragen 500 ml — Cosalka`,
    description:
      "Ficha clínica del producto Nutragen: beneficios, ingredientes, modo de uso, envíos y garantía de 30 días. Formato 500 ml.",
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  return <StoreProduct slug={slug} />;
}
