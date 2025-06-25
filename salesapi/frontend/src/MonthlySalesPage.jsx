// src/pages/MonthlySalesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function MonthlySalesPage() {
    const [data, setData] = useState([]);
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 7); // "YYYY-MM"
    });
    const [mode, setMode] = useState("single");

    const fetchMonthlyData = () => {
        axios.get("/api/analytics/monthly-sales", { params: { month } })
            .then(res => setData(res.data))
            .catch(() => setData([]));
    };

    useEffect(() => {
        if (mode === "single") fetchMonthlyData();
        else fetchComparisonData();
    }, [month, mode]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {mode === "single" ? "Sprzedaż za wybrany miesiąc" : "Porównanie miesiąc do miesiąca"}
                </h1>

                <div className="flex justify-between mb-4">
                    <div>
                        <label className="font-medium mr-2">Wybierz miesiąc:</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="border px-2 py-1 rounded"
                            disabled={mode !== "single"}
                        />
                    </div>
                    <div>
                        <button onClick={() => setMode("single")} className={`mr-2 px-4 py-2 rounded ${mode === "single" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                            Miesiąc
                        </button>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={mode === "single" ? data : comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value} zł`} />
                        <Legend />
                        <Bar dataKey="totalOrders" fill="#4f46e5" name="Zamówienia" />
                        <Bar dataKey="revenue" fill="#10b981" name="Przychód (PLN)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
