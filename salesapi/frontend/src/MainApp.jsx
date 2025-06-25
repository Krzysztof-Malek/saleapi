import React, { useState, useEffect } from "react";
import InventoryPanel from "./InventoryPanel";
import StockXListingsPanel from "./StockXListingsPanel";
import StockXHistoryPanel from "./StockXHistoryPanel";
import MonthlySalesPage from "./MonthlySalesPage";
import { Button } from "./components/ui/button";
import axios from "axios";

export default function MainApp() {
    const [tab, setTab] = useState("inventory");
    const [authUrl, setAuthUrl] = useState(null);

    useEffect(() => {
        axios.get("/api/stockx/oauth/url")
            .then((res) => setAuthUrl(res.data))
            .catch(() => setAuthUrl(null));
    }, []);

    const handleAuth = () => {
        if (authUrl) {
            window.location.href = authUrl;
        } else {
            alert("Nie udało się pobrać URL-a logowania.");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    <Button onClick={() => setTab("inventory")} variant={tab === "inventory" ? "default" : "outline"}>Magazyn</Button>
                    <Button onClick={() => setTab("sales")} variant={tab === "sales" ? "default" : "outline"}>Sprzedaż</Button>
                    <Button onClick={() => setTab("history")} variant={tab === "history" ? "default" : "outline"}>Historia sprzedaży</Button>
                    <Button onClick={() => setTab("analytics")} variant={tab === "analytics" ? "default" : "outline"}>Analiza sprzedaży</Button>
                </div>
                <div>
                    <Button onClick={handleAuth}>Autoryzuj StockX</Button>
                </div>
            </div>

            {tab === "inventory" && <InventoryPanel />}
            {tab === "sales" && <StockXListingsPanel />}
            {tab === "history" && <StockXHistoryPanel />}
            {tab === "analytics" && <MonthlySalesPage />}
        </div>
    );
}
