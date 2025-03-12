"use client"

import { CartProvider } from "../contexts/CartContext";
import CheckoutContent from "../component/CheckoutContent";

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}