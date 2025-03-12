"use client"

import React from "react";
import Image from "next/image";
import {FaShoppingCart} from "react-icons/fa";
import "./Product.css";

interface ProductProps {
    product: {
        id: number;
        name: string;
        price: string;
        image: string;
        available: boolean;
    };
    onAddToCart?: (product: any) => void;
}

const Product: React.FC<ProductProps> = ({product, onAddToCart}) => {
    const handleAddToCart = () => {
        if (onAddToCart && product.available) {
            onAddToCart(product);
        }
    };

    return (
        <div className="border rounded-md p-4 text-center relative">
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="object-contain max-h-full max-w-full"
                />
            </div>
            <p className="mt-2 font-semibold">{product.name}</p>
            <p className="text-green-700 font-bold">{product.price}</p>
            {!product.available ? (
                <button className="mt-2 bg-gray-400 text-white px-4 py-2 rounded-md" disabled>
                    TẠM HẾT HÀNG
                </button>
            ) : (
                <button className="product-buy-button" onClick={handleAddToCart}>
                    <FaShoppingCart/> CHỌN MUA
                </button>
            )}
        </div>
    );
};

export default Product;