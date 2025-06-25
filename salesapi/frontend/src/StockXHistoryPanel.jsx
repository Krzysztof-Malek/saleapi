
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { LayoutGrid, List, Info } from "lucide-react";

export default function StockXHistoryPanel() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        orderStatus: "",
        pageSize: 25,
        sortBy: "",
        sortDir: "asc"
    });
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [goToPageInput, setGoToPageInput] = useState("");
    const [viewMode, setViewMode] = useState("tile");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchData = () => {
        axios.get("/api/stockx/history", {
            params: {
                ...filters,
                pageNumber
            }
        }).then(res => {
            const raw = res.data;
            if (!Array.isArray(raw.orders)) throw new Error("Niepoprawna struktura danych z API");
            setOrders(raw.orders);
            setHasNextPage(raw.hasNextPage === true);
        }).catch(err => {
            setError("Nie udało się pobrać danych: " + err.message);
            console.error(err);
        });
    };

    useEffect(() => {
        fetchData();
    }, [pageNumber]);

    const handleChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFilterSubmit = () => {
        setPageNumber(1);
        fetchData();
    };

    const handleGoToPage = () => {
        const number = parseInt(goToPageInput);
        if (!isNaN(number) && number > 0) {
            setPageNumber(number);
        }
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format("DD-MM-YYYY HH:mm");
    };

    const getStatusColor = (status) => {
        if (!status) return "text-gray-500";
        if (status.includes("AUTHENTICATION") || status === "COMPLETED") return "text-green-600";
        if (status.includes("CANCELED") || status === "RETURNED") return "text-red-600";
        if (status === "PAYOUTPENDING") return "text-yellow-600";
        return "text-blue-600";
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Info className="w-6 h-6" /> Historia sprzedaży ze StockX</h1>
            {error && <p className="text-red-600">{error}</p>}

            <div className="flex justify-between items-center">
                <div className="space-x-2">
                    <button onClick={() => setViewMode("tile")} className={`inline-flex items-center gap-1 ${viewMode === "tile" ? "font-bold text-blue-600" : ""}`}>
                        <LayoutGrid className="w-4 h-4" /> Kafelki
                    </button>
                    <button onClick={() => setViewMode("list")} className={`inline-flex items-center gap-1 ${viewMode === "list" ? "font-bold text-blue-600" : ""}`}>
                        <List className="w-4 h-4" /> Lista
                    </button>
                </div>
            </div>

            <div className="border p-4 rounded space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="date" name="fromDate" value={filters.fromDate} onChange={handleChange} className="border p-2 rounded" />
                    <input type="date" name="toDate" value={filters.toDate} onChange={handleChange} className="border p-2 rounded" />
                    <select name="orderStatus" value={filters.orderStatus} onChange={handleChange} className="border p-2 rounded">
                        <option value="">-- Status --</option>
                        <option value="COMPLETED">Zakończone</option>
                        <option value="CANCELED">Anulowane</option>
                        <option value="RETURNED">Zwrócone</option>
                    </select>
                    <select name="pageSize" value={filters.pageSize} onChange={handleChange} className="border p-2 rounded">
                        {[10, 25, 50, 100].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleFilterSubmit} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                    Filtruj
                </button>
            </div>

            {orders.length === 0 ? (
                <p>Brak danych do wyświetlenia.</p>
            ) : (
                <>
                    <div className={viewMode === "tile" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
                        {orders.map((order, idx) => (
                            <div key={idx} className="p-4 border rounded-lg">
                                <div><strong>Produkt:</strong> {order.product?.productName}</div>
                                <div><strong>Data:</strong> {formatDate(order.createdAt)}</div>
                                <div><strong>Cena:</strong> {order.amount} {order.currencyCode}</div>
                                <div className={getStatusColor(order.status)}><strong>Status:</strong> {order.status}</div>
                                <button onClick={
                                    () => setSelectedOrder(order)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                                    Szczegóły
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-4 gap-2">
                        <button disabled={pageNumber <= 1} onClick={() => setPageNumber(prev => prev - 1)} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Poprzednia</button>
                        <span>Strona {pageNumber}</span>
                        <button disabled={!hasNextPage} onClick={() => setPageNumber(prev => prev + 1)} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Następna</button>
                        <input type="number" min="1" value={goToPageInput} onChange={(e) => setGoToPageInput(e.target.value)} className="border p-2 rounded w-20" placeholder="Idź do..." />
                        <button onClick={handleGoToPage} className="bg-blue-600 text-white px-3 py-1 rounded">Przejdź</button>
                    </div>
                </>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full space-y-4 overflow-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold">Zamówienie {selectedOrder.orderNumber}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Produkt:</strong> {selectedOrder.product?.productName}</div>
                            <div><strong>Wariant:</strong> {selectedOrder.variant?.variantName} ({selectedOrder.variant?.variantValue})</div>
                            <div><strong>Kwota:</strong> {selectedOrder.amount} {selectedOrder.currencyCode}</div>
                            <div><strong>Typ magazynu:</strong> {selectedOrder.inventoryType}</div>
                            <div><strong>Data utworzenia:</strong> {formatDate(selectedOrder.createdAt)}</div>
                            <div><strong>Data aktualizacji:</strong> {formatDate(selectedOrder.updatedAt)}</div>
                            <div><strong>Status:</strong> <span className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</span></div>
                            <div><strong>Autoryzacja:</strong> {selectedOrder.authenticationDetails?.status}</div>
                            <div><strong>Numer przesyłki:</strong> {selectedOrder.initiatedShipments?.inbound?.displayId}</div>
                            <div><strong>Kwota wypłaty:</strong> {selectedOrder.payout?.totalPayout} {selectedOrder.payout?.currencyCode}</div>
                        </div>

                        <div>
                            <h3 className="font-bold mt-4">Opłaty</h3>
                            <ul className="list-disc ml-6">
                                {selectedOrder.payout?.adjustments?.map((adj, i) => (
                                    <li key={i}>{adj.adjustmentType}: {adj.amount} ({adj.percentage * 100}%)</li>
                                ))}
                            </ul>
                        </div>

                        <button onClick={() => setSelectedOrder(null)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
                            Zamknij
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
