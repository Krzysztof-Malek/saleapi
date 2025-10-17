import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  LayoutGrid,
  List,
  Truck,
  PackageCheck,
  Undo2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Alert } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

const STATUS_OPTIONS = [
  { value: "", label: "Wszystkie statusy" },
  { value: "COMPLETED", label: "Zrealizowane" },
  { value: "CANCELED", label: "Anulowane" },
  { value: "RETURNED", label: "Zwrócone" },
];

export default function StockXHistoryPanel() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    orderStatus: "",
    pageSize: 25,
    sortBy: "",
    sortDir: "desc",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [goToPageInput, setGoToPageInput] = useState("");
  const [viewMode, setViewMode] = useState("tile");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/stockx/history", {
          params: { ...appliedFilters, pageNumber },
        });
        const raw = res.data;
        if (!Array.isArray(raw.orders)) {
          throw new Error("Niepoprawna struktura danych z API");
        }
        setOrders(raw.orders);
        setHasNextPage(raw.hasNextPage === true);
      } catch (err) {
        setError("Nie udało się pobrać historii: " + err.message);
        setOrders([]);
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appliedFilters, pageNumber]);

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = () => {
    setAppliedFilters(filters);
    setPageNumber(1);
  };

  const handleGoToPage = () => {
    const number = parseInt(goToPageInput, 10);
    if (!isNaN(number) && number > 0) {
      setPageNumber(number);
    }
  };

  const formatDate = (value) => (value ? dayjs(value).format("DD-MM-YYYY HH:mm") : "—");

  const statusBadge = (status) => {
    if (!status) return <Badge className="bg-zinc-800 text-zinc-200">nieznany</Badge>;
    if (status.includes("CANCELED") || status === "RETURNED") return <Badge className="bg-rose-500/20 text-rose-200 border border-rose-500/40">{status}</Badge>;
    if (status.includes("AUTHENTICATION") || status === "COMPLETED") return <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">{status}</Badge>;
    if (status === "PAYOUTPENDING") return <Badge className="bg-amber-500/20 text-amber-200 border border-amber-500/40">{status}</Badge>;
    return <Badge className="bg-sky-500/20 text-sky-200 border border-sky-500/40">{status}</Badge>;
  };

  const statusIcon = (status) => {
    if (!status) return <AlertTriangle className="size-4 text-zinc-500" />;
    if (status.includes("CANCELED") || status === "RETURNED") return <Undo2 className="size-4 text-rose-400" />;
    if (status.includes("AUTHENTICATION") || status === "COMPLETED") return <PackageCheck className="size-4 text-emerald-400" />;
    return <Truck className="size-4 text-sky-400" />;
  };

  const totals = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + Number(order.amount ?? 0), 0);
    return { totalValue: total };
  }, [orders]);

  return (
    <div className="space-y-8">
      {error && <Alert variant="destructive">{error}</Alert>}

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Filtrowanie zamówień</CardTitle>
            <CardDescription>Zawęź wyniki według okresu, statusów i wolumenu, aby szybciej analizować sprzedaż.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "tile" ? "default" : "outline"}
              onClick={() => setViewMode("tile")}
              className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 data-[state=active]:bg-emerald-600"
            >
              <LayoutGrid className="mr-2 size-4" />
              Kafelki
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 data-[state=active]:bg-emerald-600"
            >
              <List className="mr-2 size-4" />
              Lista
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <Input type="date" value={filters.fromDate} onChange={(e) => handleChange("fromDate", e.target.value)} />
            <Input type="date" value={filters.toDate} onChange={(e) => handleChange("toDate", e.target.value)} />
            <Select value={filters.orderStatus} onValueChange={(value) => handleChange("orderStatus", value)}>
              <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <SelectValue placeholder="Status zamówienia" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(filters.pageSize)} onValueChange={(value) => handleChange("pageSize", Number(value))}>
              <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <SelectValue placeholder="Rozmiar strony" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.sortDir} onValueChange={(value) => handleChange("sortDir", value)}>
              <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <SelectValue placeholder="Sortowanie" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <SelectItem value="desc">Najnowsze</SelectItem>
                <SelectItem value="asc">Najstarsze</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={handleFilterSubmit} className="bg-emerald-600 hover:bg-emerald-500">
              Zastosuj filtry
            </Button>
            <div className="text-sm text-zinc-400">
              Wartość zamówień na stronie:{" "}
              <span className="font-semibold text-zinc-100">{totals.totalValue.toFixed(2)} {orders[0]?.currencyCode || "USD"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card className="border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-400">
          Ładowanie historii
        </Card>
      ) : orders.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-400">
          Brak danych do wyświetlenia. Zmień zakres lub odśwież dane.
        </Card>
      ) : viewMode === "tile" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.orderNumber} className="border-zinc-800 bg-zinc-900/60">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-zinc-200">Zamówienie {order.orderNumber}</CardTitle>
                  {statusIcon(order.status)}
                </div>
                <CardDescription className="text-xs text-zinc-500">{formatDate(order.createdAt)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-300">
                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500">Produkt</div>
                  <div className="font-medium text-zinc-100">{order.product?.productName || "—"}</div>
                  <div className="text-xs text-zinc-500">{order.variant?.variantName}</div>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(order.status)}
                  <Badge className="bg-zinc-800 text-zinc-300">{order.inventoryType || "STANDARD"}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-zinc-500">Kwota</div>
                    <div className="font-semibold text-zinc-100">
                      {order.amount} {order.currencyCode}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500">Wypłata</div>
                    <div className="font-semibold text-zinc-100">
                      {order.payout?.totalPayout ?? "—"} {order.payout?.currencyCode ?? ""}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800" onClick={() => setSelectedOrder(order)}>
                  Szczegóły
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="overflow-hidden rounded-xl border border-zinc-800 p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zamówienie</TableHead>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kwota</TableHead>
                  <TableHead>Utworzono</TableHead>
                  <TableHead className="text-right w-32">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderNumber}>
                    <TableCell className="font-medium text-zinc-100">{order.orderNumber}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <div className="text-sm font-medium text-zinc-200">{order.product?.productName || "—"}</div>
                      <div className="text-xs text-zinc-500">{order.variant?.variantName}</div>
                    </TableCell>
                    <TableCell>{statusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-zinc-300">
                      {order.amount} {order.currencyCode}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-400">{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="flex justify-end">
                      <Button variant="outline" className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800" onClick={() => setSelectedOrder(order)}>
                        Szczegóły
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 disabled:opacity-40" disabled={pageNumber <= 1} onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}>
            Poprzednia
          </Button>
          <span className="text-sm text-zinc-400">
            Strona <span className="font-semibold text-zinc-100">{pageNumber}</span>
          </span>
          <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 disabled:opacity-40" disabled={!hasNextPage} onClick={() => setPageNumber((prev) => prev + 1)}>
            Następna
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            value={goToPageInput}
            onChange={(e) => setGoToPageInput(e.target.value)}
            placeholder="Idź do strony..."
            className="w-32 border-zinc-800 bg-zinc-900 text-zinc-100"
          />
          <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800" onClick={handleGoToPage}>
            Przejdź
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Zamówienie {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>Szczegóły transakcji, wypłat oraz przesyłek.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoRow label="Produkt" value={selectedOrder?.product?.productName} />
            <InfoRow label="Wariant" value={selectedOrder?.variant?.variantName} />
            <InfoRow label="Status" value={statusBadge(selectedOrder?.status)} />
            <InfoRow label="Typ magazynu" value={selectedOrder?.inventoryType} />
            <InfoRow label="Kwota" value={`${selectedOrder?.amount ?? "—"} ${selectedOrder?.currencyCode ?? ""}`} />
            <InfoRow label="Wypłata" value={`${selectedOrder?.payout?.totalPayout ?? "—"} ${selectedOrder?.payout?.currencyCode ?? ""}`} />
            <InfoRow label="Utworzono" value={formatDate(selectedOrder?.createdAt)} />
            <InfoRow label="Aktualizacja" value={formatDate(selectedOrder?.updatedAt)} />
            <InfoRow label="Autoryzacja" value={selectedOrder?.authenticationDetails?.status} />
            <InfoRow label="Numer przesyłki" value={selectedOrder?.initiatedShipments?.inbound?.displayId} />
          </div>

          {selectedOrder?.payout?.adjustments?.length ? (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-semibold text-zinc-100">Opłaty i korekty</div>
              <ul className="space-y-1 text-sm text-zinc-300">
                {selectedOrder.payout.adjustments.map((adj, index) => (
                  <li key={index} className="flex justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                    <span>{adj.adjustmentType}</span>
                    <span>
                      {adj.amount} ({Math.round((adj.percentage || 0) * 100)}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800" onClick={() => setSelectedOrder(null)}>
              Zamknij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="space-y-1 text-sm">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="font-medium text-zinc-100">{value || "—"}</div>
    </div>
  );
}
