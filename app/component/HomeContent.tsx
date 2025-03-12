"use client"

import React, {useState} from "react";
import Navbar from "./NavBar";
import Product from "./Product";
import {useCart} from "../contexts/CartContext";
import Notification from "./Notification";
import "./Product.css";

const products = [
    {
        id: 1,
        name: "Mâm Xuân Ất Tỵ 2025",
        price: "308,000₫",
        image: "/product1.webp",
        available: true,
    },
    {
        id: 2,
        name: "Gin - Coco Daisy",
        price: "748,000₫",
        image: "/product2.webp",
        available: false,
    },
    {
        id: 3,
        name: "Eau De Vie D’Jujube",
        price: "638,000₫",
        image: "/product3.webp",
        available: true,
    },
    {
        id: 4,
        name: "Rượu Mùa Cốm",
        price: "308,000₫",
        image: "/product4.webp",
        available: true,
    },
    {
        id: 5,
        name: "Rượu Xí muội",
        price: "308,000₫",
        image: "/product5.webp",
        available: true,
    }
];

export default function HomeContent() {
    const {addToCart, items} = useCart();
    const [notification, setNotification] = useState({
        show: false,
        message: ""
    });

    const handleAddToCart = (product: any) => {
        addToCart(product);
        setNotification({
            show: true,
            message: "Thêm vào giỏ hàng thành công!"
        });
    };

    const closeNotification = () => {
        setNotification({
            ...notification,
            show: false
        });
    };

    return (
        <div className="bg-white">
            <Navbar cartItemCount={items.length}/>
            <Notification
                show={notification.show}
                message={notification.message}
                onClose={closeNotification}
            />
            <section className="p-8">
                {/* Your product sections here */}
                <div style={{padding: "0 300px"}}>
                    <h2 className="product-section-title">
                        Mầm Liqueur 530ML
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <Product key={product.id} product={product} onAddToCart={handleAddToCart}/>
                        ))}
                    </div>
                </div>

                <div style={{padding: "100px 300px"}}>
                    <h2 className="product-section-title">
                        Mầm Liqueur 530ML
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <Product key={product.id} product={product} onAddToCart={handleAddToCart}/>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}