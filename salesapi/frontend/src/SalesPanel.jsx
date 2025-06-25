import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

export default function SalesPanel() {
    const [sales, setSales] = useState([]);
    const [form, setForm] = useState({ productName: "", quantity: 1, price: 0, saleDate: "" });

    const fetchSales = async () => {
        const res = await axios.get("/api/sales");
        setSales(res.data);
    };

    const submitSale = async () => {
        await axios.post("/api/sales", form);
        setForm({ productName: "", quantity: 1, price: 0, saleDate: "" });
        fetchSales();
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold">Dodaj sprzedaż</h2>
            <div className="flex gap-2">
                <Input placeholder="Produkt" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
                <Input type="number" placeholder="Ilość" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })} />
                <Input type="number" placeholder="Cena" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} />
                <Input type="date" value={form.saleDate} onChange={(e) => setForm({ ...form, saleDate: e.target.value })} />
                <Button onClick={submitSale}>Dodaj</Button>
            </div>

            <h2 className="text-xl font-bold mt-4">Historia sprzedaży</h2>
            <ul className="space-y-2">
                {sales.map((s) => (
                    <li key={s.id} className="border rounded p-2">
                        {s.saleDate} — {s.productName}, {s.quantity} szt. × {s.price} zł
                    </li>
                ))}
            </ul>
        </div>
    );
}
