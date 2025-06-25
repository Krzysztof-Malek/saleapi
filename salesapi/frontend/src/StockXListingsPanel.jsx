
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { LayoutGrid, List, Boxes } from "lucide-react";

export default function StockXListingsPanel() {
    const [listings, setListings] = useState([]);
    const [filters, setFilters] = useState({
        pageSize: 25,
        pageNumber: 1,
        productIds: "",
        variantIds: "",
        listingStatuses: "ACTIVE",
        inventoryTypes: ""
    });
    const [hasNextPage, setHasNextPage] = useState(true);
    const [viewMode, setViewMode] = useState("tile");
    const [error, setError] = useState("");
    const [goToPageInput, setGoToPageInput] = useState("");
    const [selectedListing, setSelectedListing] = useState(null);

    const fetchListings = () => {
        axios.get("/api/stockx/listings", { params: filters })
            .then(res => {
                setListings(res.data.listings || []);
                setHasNextPage(res.data.hasNextPage);
            })
            .catch(err => {
                setError("Nie udało się pobrać listingów: " + err.message);
                console.error(err);
            });
    };

    useEffect(() => {
        fetchListings();
    }, [filters.pageNumber]);

    const handleChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFilterSubmit = () => {
        setFilters(prev => ({ ...prev, pageNumber: 1 }));
        fetchListings();
    };

    const formatDate = (dateString) => dayjs(dateString).format("DD-MM-YYYY HH:mm");

    const handleGoToPage = () => {
        const number = parseInt(goToPageInput);
        if (!isNaN(number) && number > 0) {
            setFilters(prev => ({ ...prev, pageNumber: number }));
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case "ACTIVE": return "text-green-600";
            case "INACTIVE": return "text-yellow-600";
            case "CANCELED":
            case "DELETED": return "text-red-600";
            case "COMPLETED": return "text-blue-600";
            case "MATCHED": return "text-purple-600";
            default: return "text-gray-500";
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Boxes className="w-6 h-6" /> Listingi sprzedaży</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <input type="text" name="productIds" placeholder="Product ID(s)" value={filters.productIds} onChange={handleChange} className="border p-2 rounded" />
                    <input type="text" name="variantIds" placeholder="Variant ID(s)" value={filters.variantIds} onChange={handleChange} className="border p-2 rounded" />
                    <select name="listingStatuses" value={filters.listingStatuses} onChange={handleChange} className="border p-2 rounded">
                        <option value="">-- Status --</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="DELETED">DELETED</option>
                        <option value="CANCELED">CANCELED</option>
                        <option value="MATCHED">MATCHED</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                    <select name="inventoryTypes" value={filters.inventoryTypes} onChange={handleChange} className="border p-2 rounded">
                        <option value="">-- Typ --</option>
                        <option value="STANDARD">STANDARD</option>
                        <option value="FLEX">FLEX</option>
                    </select>
                    <select name="pageSize" value={filters.pageSize} onChange={handleChange} className="border p-2 rounded">
                        {[10, 25, 50, 100].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleFilterSubmit} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Filtruj</button>
            </div>

            {listings.length === 0 ? (
                <p>Brak aktywnych listingów.</p>
            ) : (
                <>
                    <div className={viewMode === "tile" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
                        {listings.map((listing, idx) => (
                            <div key={idx} className="p-4 border rounded-lg">
                                <div><strong>Listing ID:</strong> {listing.listingId}</div>
                                <div><strong>Produkt:</strong> {listing.product?.productName}</div>
                                <div><strong>Wariant:</strong> {listing.variant?.variantName}</div>
                                <div><strong>Status:</strong> <span className={statusColor(listing.status)}>{listing.status}</span></div>
                                <div><strong>Data:</strong> {formatDate(listing.createdAt)}</div>
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={() => setSelectedListing(listing)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Edytuj
                                    </button>
                                    <button
                                        onClick={() => {
                                            const confirmed = confirm(`Czy na pewno chcesz usunąć listing ${listing.listingId}?`);
                                            if (confirmed) {
                                                // Tu w przyszłości dodamy DELETE
                                            }
                                        }}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-4 gap-2">
                        <button disabled={filters.pageNumber <= 1} onClick={() => setFilters(prev => ({ ...prev, pageNumber: prev.pageNumber - 1 }))} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Poprzednia</button>
                        <span>Strona {filters.pageNumber}</span>
                        <button disabled={!hasNextPage} onClick={() => setFilters(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }))} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Następna</button>
                        <input type="number" min="1" value={goToPageInput} onChange={(e) => setGoToPageInput(e.target.value)} className="border p-2 rounded w-20" placeholder="Idź do..." />
                        <button onClick={handleGoToPage} className="bg-blue-600 text-white px-3 py-1 rounded">Przejdź</button>
                    </div>
                </>
            )}

            {selectedListing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full space-y-4 overflow-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold">Szczegóły listingu {selectedListing.listingId}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Produkt:</strong> {selectedListing.product?.productName}</div>
                            <div><strong>Wariant:</strong> {selectedListing.variant?.variantName}</div>
                            <div><strong>Status:</strong> <span className={statusColor(selectedListing.status)}>{selectedListing.status}</span></div>
                            <div><strong>Typ:</strong> {selectedListing.inventoryType}</div>
                            <div><strong>Data:</strong> {formatDate(selectedListing.createdAt)}</div>
                            <div><strong>Aktualizacja:</strong> {formatDate(selectedListing.updatedAt)}</div>
                        </div>
                        <button onClick={() => setSelectedListing(null)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Zamknij</button>
                    </div>
                </div>
            )}
        </div>
    );
}
