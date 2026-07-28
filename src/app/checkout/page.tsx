import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Your Setup",
};

const CheckoutSummary = dynamic(
  () => import("@/components/checkout/checkout-summary")
);

export default function CheckoutPage() {
  return <CheckoutSummary />;
}
