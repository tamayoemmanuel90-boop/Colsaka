import type { Metadata } from "next";
import { StoreConfirm } from "@/components/store/StoreConfirm";

export const metadata: Metadata = {
  title: "Pedido confirmado — Cosalka · Nutragen",
  description: "Tu protocolo Nutragen queda reservado con precinto estéril.",
};

export default function ConfirmacionPage() {
  return <StoreConfirm />;
}
