"use client"

import React, {useEffect, useRef, useState} from 'react';
import {useCart} from '../contexts/CartContext';
import {useRouter} from 'next/navigation';
import QRCode from 'react-qr-code';
import './CheckoutContent.css';

export default function CheckoutContent() {
    const {items} = useCart();
    const router = useRouter();
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'qr'

    const [qrValue, setQrValue] = useState("");
    const [isLoadingQR, setIsLoadingQR] = useState(false);

    const fetchQRCode = async () => {
        try {
            setIsLoadingQR(true);

            // Calculate total amount without currency symbol and separators
            const amount = items?.reduce((sum, item) => {
                let itemPrice = 0;
                if (typeof item.price === 'string') {
                    const priceString = item.price.replace(/[^\d]/g, '');
                    itemPrice = parseInt(priceString, 10);
                } else if (typeof item.price === 'number') {
                    itemPrice = item.price;
                }
                return sum + (itemPrice * item.quantity);
            }, 0) || 0;

            const formData = new URLSearchParams();
            formData.append('amount', amount.toString());
            formData.append('description', `Thanh toán đơn hàng`);
            formData.append('buyerName', cardHolder || 'Khách hàng');
            formData.append('buyerEmail', 'customer@example.com');

            console.log('Form data:', formData);

            const response = await fetch('http://103.163.215.111:7007/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to generate QR code');
            }

            const data = await response.json();
            console.log('QR code data:', data);
            setQrValue(data.payment_info?.data?.qrCode || "");

            const checkoutUrl = data.checkout_url || data.payment_info?.data?.checkoutUrl;
            if (checkoutUrl) {
                // Could save this to state if you want to use it later
                console.log("Checkout URL available:", checkoutUrl);
            }
        } catch (error) {
            console.error('Error fetching QR code:', error);
            // Fallback to static QR code
            setQrValue("00020101021238570010A000000727012700069704220113VQRQABQFM66700208QRIBFTTA5303704540420005802VN62140810string31236304FD1E");
        } finally {
            setIsLoadingQR(false);
        }
    };

    useEffect(() => {
        if (paymentMethod === 'card') {
            setTimeout(() => {
                if (cvvInputRef.current) {
                    cvvInputRef.current.focus();
                    setTimeout(() => {
                        cvvInputRef.current?.blur();
                    }, 1000);
                }
            }, 500);
        } else if (paymentMethod === 'qr') {
            fetchQRCode();
        }
    }, [paymentMethod]);

    // Card detail states
    const [cardNumber, setCardNumber] = useState(['', '', '', '']);
    const [cardHolder, setCardHolder] = useState('');
    const [expireMonth, setExpireMonth] = useState('');
    const [expireYear, setExpireYear] = useState('');
    const [cvv, setCvv] = useState('');

    // Input refs for focus management
    const cardInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];
    const cvvInputRef = useRef<HTMLInputElement>(null);

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

    // Simulate the demo auto-focus behavior for card payment
    useEffect(() => {
        if (paymentMethod === 'card') {
            setTimeout(() => {
                if (cvvInputRef.current) {
                    cvvInputRef.current.focus();
                    setTimeout(() => {
                        cvvInputRef.current?.blur();
                    }, 1000);
                }
            }, 500);
        }
    }, [paymentMethod]);

    // Handle card number input change
    const handleCardNumberChange = (index: number, value: string) => {
        const newCardNumber = [...cardNumber];
        newCardNumber[index] = value;
        setCardNumber(newCardNumber);

        // Auto-focus next input when this one is filled
        if (value.length === 4 && index < 3) {
            cardInputRefs[index + 1].current?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Process payment here based on selected method
        alert('Thanh toán thành công!');
        router.push('/');
    };

    return (
        <>
            {/* Payment method selector - moved outside the checkout box */}
            <div className="payment-method-selector-top">
                <div className="payment-options">
                    <button
                        className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                    >
                        <i className="fa fa-credit-card"></i> Thanh toán bằng thẻ
                    </button>
                    <button
                        className={`payment-option ${paymentMethod === 'qr' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('qr')}
                    >
                        <i className="fa fa-qrcode"></i> Thanh toán QR
                    </button>
                </div>
            </div>

            <div className="checkout">
                {paymentMethod === 'card' ? (
                    <>
                        <div className="credit-card-box">
                            <div className={`flip ${isCardFlipped ? 'hover' : ''}`}>
                                <div className="front">
                                    <div className="chip"></div>
                                    <div className="logo">
                                        <svg version="1.1" id="visa" xmlns="http://www.w3.org/2000/svg"
                                             x="0px" y="0px" width="47.834px" height="47.834px"
                                             viewBox="0 0 47.834 47.834" enableBackground="new 0 0 47.834 47.834">
                                            <g>
                                                <g>
                                                    <path d="M44.688,16.814h-3.004c-0.933,0-1.627,0.254-2.037,
                                        1.184l-5.773,13.074h4.083c0,0,0.666-1.758,0.817-2.143
                                        c0.447,0,4.414,0.006,4.979,0.006c0.116,0.498,0.474,2.137,
                                        0.474,2.137h3.607L44.688,16.814z M39.893,26.01c0.32-0.819,
                                        1.549-3.987,1.549-3.987c-0.021,0.039,0.317-0.825,
                                        0.518-1.362l0.262,1.23c0,0,0.745,3.406,0.901,4.119H39.893z
                                        M34.146,26.404c-0.028,2.963-2.684,4.875-6.771,4.875
                                        c-1.743-0.018-3.422-0.361-4.332-0.76l0.547-3.193l0.501,0.228
                                        c1.277,0.532,2.104,0.747,3.661,0.747c1.117,0,2.313-0.438,
                                        2.325-1.393c0.007-0.625-0.501-1.07-2.016-1.77
                                        c-1.476-0.683-3.43-1.827-3.405-3.876c0.021-2.773,2.729-4.708,
                                        6.571-4.708c1.506,0,2.713,0.31,3.483,0.599l-0.526,3.092
                                        l-0.351-0.165c-0.716-0.288-1.638-0.566-2.91-0.546
                                        c-1.522,0-2.228,0.634-2.228,1.227c-0.008,0.668,0.824,1.108,
                                        2.184,1.77C33.126,23.546,34.163,24.783,34.146,26.404z
                                        M0,16.962l0.05-0.286h6.028c0.813,0.031,1.468,0.29,1.694,
                                        1.159l1.311,6.304C7.795,20.842,4.691,18.099,0,16.962z
                                        M17.581,16.812l-6.123,14.239l-4.114,0.007L3.862,19.161
                                        c2.503,1.602,4.635,4.144,5.386,5.914l0.406,1.469l3.808-9.729
                                        L17.581,16.812L17.581,16.812z M19.153,16.8h3.89L20.61,
                                        31.066h-3.888L19.153,16.8z"/>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="number">{cardNumber.join(' ')}</div>
                                    <div className="card-holder">
                                        <label>Card holder</label>
                                        <div>{cardHolder}</div>
                                    </div>
                                    <div className="card-expiration-date">
                                        <label>Expires</label>
                                        <div>
                                            {expireMonth && expireYear ? `${expireMonth}/${expireYear.substr(2, 2)}` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="back">
                                    <div className="strip"></div>
                                    <div className="logo">
                                        <svg version="1.1" id="visa" xmlns="http://www.w3.org/2000/svg"
                                             x="0px" y="0px" width="47.834px" height="47.834px"
                                             viewBox="0 0 47.834 47.834" enableBackground="new 0 0 47.834 47.834">
                                            <g>
                                                <g>
                                                    <path d="M44.688,16.814h-3.004c-0.933,0-1.627,0.254-2.037,
                                        1.184l-5.773,13.074h4.083c0,0,0.666-1.758,0.817-2.143
                                        c0.447,0,4.414,0.006,4.979,0.006c0.116,0.498,0.474,2.137,
                                        0.474,2.137h3.607L44.688,16.814z M39.893,26.01c0.32-0.819,
                                        1.549-3.987,1.549-3.987c-0.021,0.039,0.317-0.825,
                                        0.518-1.362l0.262,1.23c0,0,0.745,3.406,0.901,4.119H39.893z
                                        M34.146,26.404c-0.028,2.963-2.684,4.875-6.771,4.875
                                        c-1.743-0.018-3.422-0.361-4.332-0.76l0.547-3.193l0.501,0.228
                                        c1.277,0.532,2.104,0.747,3.661,0.747c1.117,0,2.313-0.438,
                                        2.325-1.393c0.007-0.625-0.501-1.07-2.016-1.77
                                        c-1.476-0.683-3.43-1.827-3.405-3.876c0.021-2.773,2.729-4.708,
                                        6.571-4.708c1.506,0,2.713,0.31,3.483,0.599l-0.526,3.092
                                        l-0.351-0.165c-0.716-0.288-1.638-0.566-2.91-0.546
                                        c-1.522,0-2.228,0.634-2.228,1.227c-0.008,0.668,0.824,1.108,
                                        2.184,1.77C33.126,23.546,34.163,24.783,34.146,26.404z
                                        M0,16.962l0.05-0.286h6.028c0.813,0.031,1.468,0.29,1.694,
                                        1.159l1.311,6.304C7.795,20.842,4.691,18.099,0,16.962z
                                        M17.581,16.812l-6.123,14.239l-4.114,0.007L3.862,19.161
                                        c2.503,1.602,4.635,4.144,5.386,5.914l0.406,1.469l3.808-9.729
                                        L17.581,16.812L17.581,16.812z M19.153,16.8h3.89L20.61,
                                        31.066h-3.888L19.153,16.8z"/>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="ccv">
                                        <label>CCV</label>
                                        <div>{cvv}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-icons">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa"/>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                 alt="MasterCard"/>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/300px-JCB_logo.svg.png"
                                alt="JCB"/>
                        </div>

                        <form className="form" autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <fieldset>
                                <label htmlFor="card-number">Card Number</label>
                                {cardNumber.map((val, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        ref={cardInputRefs[idx]}
                                        id={idx === 0 ? "card-number" : `card-number-${idx}`}
                                        className="input-cart-number"
                                        maxLength={4}
                                        value={val}
                                        onChange={(e) => handleCardNumberChange(idx, e.target.value)}
                                    />
                                ))}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="card-holder">Card holder</label>
                                <input
                                    type="text"
                                    id="card-holder"
                                    value={cardHolder}
                                    onChange={(e) => setCardHolder(e.target.value)}
                                />
                            </fieldset>
                            <fieldset className="card-expire">
                                <label htmlFor="expire-month">Expire date</label>
                                <div className="select">
                                    <select
                                        id="expire-month"
                                        value={expireMonth}
                                        onChange={(e) => setExpireMonth(e.target.value)}
                                    >
                                        <option value=""></option>
                                        <option value="01">01</option>
                                        <option value="02">02</option>
                                        <option value="03">03</option>
                                        <option value="04">04</option>
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                        <option value="08">08</option>
                                        <option value="09">09</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                </div>
                                <div className="select">
                                    <select
                                        id="expire-year"
                                        value={expireYear}
                                        onChange={(e) => setExpireYear(e.target.value)}
                                    >
                                        <option value=""></option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                    </select>
                                </div>
                            </fieldset>
                            <fieldset className="fieldset-ccv">
                                <label htmlFor="card-ccv">CVV</label>
                                <input
                                    type="password"
                                    id="card-ccv"
                                    ref={cvvInputRef}
                                    maxLength={3}
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    onFocus={() => setIsCardFlipped(true)}
                                    onBlur={() => setIsCardFlipped(false)}
                                />
                            </fieldset>
                            <button className="btn"><i className="fa fa-lock"></i> Thanh toán</button>
                        </form>
                    </>
                ) : (
                    <div className="qr-payment-container">
                        <div className="qr-code">
                            <div className="qr-wrapper">
                                {isLoadingQR ? (
                                    <div className="qr-loading">Loading QR code...</div>
                                ) : qrValue ? (
                                    <QRCode
                                        value={qrValue}
                                        size={250}
                                        bgColor="#FFFFFF"
                                        fgColor="#000000"
                                        level="H"
                                    />
                                ) : (
                                    <div>Failed to load QR code</div>
                                )}
                            </div>
                            <p>Hoặc dùng app ngân hàng để quét mã QR</p>
                        </div>
                        <div className="payment-instructions">
                            <h3>Hướng dẫn thanh toán QR</h3>
                            <ol>
                                <li>Mở ứng dụng ngân hàng hoặc ví điện tử của bạn</li>
                                <li>Chọn chức năng quét mã QR</li>
                                <li>Quét mã QR ở trên</li>
                                <li>Xác nhận thanh toán số tiền: <strong>{getTotalPrice()}</strong></li>
                            </ol>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <button className="btn"><i className="fa fa-check"></i> Xác nhận đã thanh toán</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}