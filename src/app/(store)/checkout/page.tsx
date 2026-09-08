import type { Metadata } from "next";
import { StoreCheckout } from "@/components/store/StoreCheckout";

export const metadata: Metadata = {
  title: "Checkout seguro — Cosalka · Nutragen",
  description:
    "Datos de envío, método de entrega y pago cifrado. Envío gratis desde $1,500 MXN.",
};

export default function CheckoutPage() {
  return <StoreCheckout />;
}
