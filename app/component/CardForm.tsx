"use client"

import React, {useState} from 'react';

type CardFormProps = {
    setCardDetails: (details: any) => void;
};

const CardForm: React.FC<CardFormProps> = ({setCardDetails}) => {
    const [form, setForm] = useState({
        number: '',
        holder: '',
        expiryMonth: '',
        expiryYear: '',
        ccv: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        const updatedForm = {...form, [name]: value};
        setForm(updatedForm);

        setCardDetails({
            number: name === 'number' ? value : form.number,
            holder: name === 'holder' ? value : form.holder,
            expiry: `${name === 'expiryMonth' ? value : form.expiryMonth}/${name === 'expiryYear' ? value : form.expiryYear}`,
            ccv: name === 'ccv' ? value : form.ccv,
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Card Number</label>
                <input
                    type="text"
                    name="number"
                    className="w-full p-3 border rounded"
                    onChange={handleChange}
                    value={form.number}
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Card Holder</label>
                <input
                    type="text"
                    name="holder"
                    className="w-full p-3 border rounded"
                    onChange={handleChange}
                    value={form.holder}
                    placeholder="NGUYEN VAN A"
                    required
                />
            </div>
            <div className="flex mb-4">
                <div className="mr-2 flex-1">
                    <label className="block text-sm font-bold mb-2">Month</label>
                    <select
                        name="expiryMonth"
                        className="w-full p-3 border rounded"
                        onChange={handleChange}
                        value={form.expiryMonth}
                        required
                    >
                        <option value="" disabled>Month</option>
                        {[...Array(12).keys()].map(i => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-bold mb-2">Year</label>
                    <select
                        name="expiryYear"
                        className="w-full p-3 border rounded"
                        onChange={handleChange}
                        value={form.expiryYear}
                        required
                    >
                        <option value="" disabled>Year</option>
                        {[...Array(10).keys()].map(i => (
                            <option key={i + 2024} value={i + 2024}>{i + 2024}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">CVV</label>
                <input
                    type="password"
                    name="ccv"
                    className="w-full p-3 border rounded"
                    maxLength={3}
                    onChange={handleChange}
                    value={form.ccv}
                    placeholder="123"
                    required
                />
            </div>
        </div>
    );
};

export default CardForm;