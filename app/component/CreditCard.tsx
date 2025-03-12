"use client"

import React from 'react';

type CreditCardProps = {
    number: string;
    holder: string;
    expiry: string;
    ccv: string;
};

const CreditCard: React.FC<CreditCardProps> = ({ number, holder, expiry, ccv }) => {
    return (
        <div className="relative w-96 h-56 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between">
                <div className="w-12 h-8 bg-yellow-400 rounded-sm"></div>
                <div className="text-lg font-bold">VISA</div>
            </div>
            <div className="mt-6 text-2xl tracking-widest">{number || '**** **** **** ****'}</div>
            <div className="mt-4 flex justify-between">
                <div>
                    <span className="text-xs">Card Holder</span>
                    <div className="text-lg">{holder || 'Your Name'}</div>
                </div>
                <div>
                    <span className="text-xs">Expires</span>
                    <div className="text-lg">{expiry || 'MM/YY'}</div>
                </div>
            </div>
        </div>
    );
};

export default CreditCard;