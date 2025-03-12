"use client"

import React, {useState} from "react";
import { CartProvider, useCart } from "./contexts/CartContext";
import "./component/Product.css";
import HomeContent from "./component/HomeContent";

export default function Home() {
    return (
        <CartProvider>
            <HomeContent />
        </CartProvider>
    );
}
