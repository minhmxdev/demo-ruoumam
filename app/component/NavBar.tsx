"use client"

import React, {useState} from 'react';
import './NavBar.css';
import {IoMenu} from 'react-icons/io5';
import {FaShoppingCart, FaTrash} from "react-icons/fa";
import {useCart} from "../contexts/CartContext";
import Link from 'next/link';

interface NavbarProps {
    cartItemCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({cartItemCount = 0}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const {items, removeFromCart} = useCart();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        if (cartOpen) setCartOpen(false);
    };

    const toggleCart = () => {
        setCartOpen(!cartOpen);
        if (menuOpen) setMenuOpen(false);
    };

    const getTotalPrice = () => {
      // Check if items exist and have length
      if (!items || items.length === 0) {
        return "0₫";
      }

      // Calculate total with more robust parsing
      const total = items.reduce((sum, item) => {
        let itemPrice = 0;

        if (typeof item.price === 'string') {
          // Remove all non-digit characters
          const priceString = item.price.replace(/[^\d]/g, '');
          itemPrice = priceString ? parseInt(priceString, 10) : 0;
        } else if (typeof item.price === 'number' && !isNaN(item.price)) {
          itemPrice = item.price;
        }

        // Ensure quantity is a valid number
        const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity)
          ? item.quantity
          : 1;

        return sum + (itemPrice * quantity);
      }, 0);

      // Safe formatting with fallback
      try {
        return total.toLocaleString('vi-VN') + "₫";
      } catch (error) {
        console.error('Error formatting price:', error);
        return total + "₫";
      }
    };

    return (
        <nav className="navbar">
            <div className="navbar-center">
                <div className="navbar-hamburger" onClick={toggleMenu}>
                    <IoMenu size={24} color="white"/>
                </div>
                <div className="navbar-logo">
                    <img src="/img.png" alt="Logo"/>
                </div>

                <div className="navbar-search">
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{ width: "1100px" }}  // Adjust this value as needed
                    />
                </div>

                <div className="relative">
                    <div className="cart-icon-container" onClick={toggleCart}>
                        <FaShoppingCart size={24} color="white"/>
                        {cartItemCount > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                        )}
                    </div>

                    {cartOpen && (
                        <div className="cart-popup">
                            <h3 className="cart-title">Giỏ hàng của bạn</h3>

                            {items.length === 0 ? (
                                <p className="empty-cart-message">Giỏ hàng trống</p>
                            ) : (
                                <>
                                    <div className="cart-items">
                                        {items.map((item) => (
                                            <div key={item.id} className="cart-item">
                                                <img src={item.image} alt={item.name} className="cart-item-image"/>
                                                <div className="cart-item-info">
                                                    <p className="cart-item-name">{item.name}</p>
                                                    <p className="cart-item-price">{item.price} x {item.quantity}</p>
                                                </div>
                                                <button
                                                    className="remove-item-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFromCart(item.id);
                                                    }}
                                                >
                                                    <FaTrash size={16}/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="cart-footer">
                                        <div className="cart-total">
                                            <span>Tổng cộng:</span>
                                            <span>{getTotalPrice()}₫</span>
                                        </div>
                                        <Link href="/checkout" className="checkout-btn"
                                              onClick={() => setCartOpen(false)}>
                                            THANH TOÁN
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/*{menuOpen && (
                <ul className="navbar-mobile-menu">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            )}*/}
        </nav>
    );
};

export default Navbar;