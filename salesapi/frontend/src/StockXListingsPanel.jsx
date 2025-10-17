import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  LayoutGrid,
  List,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCcw,
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

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "DELETED", "CANCELED", "MATCHED", "COMPLETED"];
const INVENTORY_TYPES = ["STANDARD", "FLEX"];

export default function StockXListingsPanel() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    pageSize: 25,
    pageNumber: 1,
    productIds: "",
    variantIds: "",
    listingStatuses: "ACTIVE",
    inventoryTypes: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [viewMode, setViewMode] = useState("tile");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("/api/stockx/listings", {
          params: { ...appliedFilters, pageNumber },
        });
        setListings(response.data.listings || []);
        setHasNextPage(response.data.hasNextPage === true);
      } catch (err) {
        setError("Nie udało się pobrać listingów: " + err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [appliedFilters, pageNumber]);

  const handleInputChange = (name, value) => {
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

  const statusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">ACTIVE</Badge>;
      case "INACTIVE":
        return <Badge className="bg-amber-500/20 text-amber-200 border border-amber-500/40">INACTIVE</Badge>;
      case "COMPLETED":
        return <Badge className="bg-sky-500/20 text-sky-200 border border-sky-500/40">COMPLETED</Badge>;
      case "MATCHED":
        return <Badge className="bg-purple-500/20 text-purple-200 border border-purple-500/40">MATCHED</Badge>;
      case "CANCELED":
      case "DELETED":
        return <Badge className="bg-rose-500/20 text-rose-200 border border-rose-500/40">{status}</Badge>;
      default:
        return <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700">{status || "—"}</Badge>;
    }
  };

  const statusIcon = (status) => {
    if (status === "ACTIVE") return <CheckCircle className="size-4 text-emerald-400" />;
    if (status === "COMPLETED") return <CheckCircle className="size-4 text-sky-400" />;
    if (status === "CANCELED" || status === "DELETED") return <XCircle className="size-4 text-rose-400" />;
    return <AlertTriangle className="size-4 text-amber-400" />;
  };

  const formattedDate = (iso) => (iso ? dayjs(iso).format("DD-MM-YYYY HH:mm") : "—");

  const pageSummary = useMemo(() => {
    if (!listings.length) return null;
    const totalValue = listings.reduce((sum, item) => sum + Number(item.highestBid ?? 0), 0);
    return { totalValue };
  }, [listings]);

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Filtry listingów</CardTitle>
            <CardDescription>Ogranicz wyniki według SKU, wariantów i statusów aby szybciej odnaleźć oferty.</CardDescription>
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Product ID(s)"
              value={filters.productIds}
              onChange={(e) => handleInputChange("productIds", e.target.value)}
            />
            <Input
              placeholder="Variant ID(s)"
              value={filters.variantIds}
              onChange={(e) => handleInputChange("variantIds", e.target.value)}
            />
            <Select value={filters.listingStatuses} onValueChange={(value) => handleInputChange("listingStatuses", value)}>
              <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <SelectItem value="">Dowolny status</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.inventoryTypes} onValueChange={(value) => handleInputChange("inventoryTypes", value)}>
              <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <SelectValue placeholder="Typ magazynu" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <SelectItem value="">Dowolny typ</SelectItem>
                {INVENTORY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(filters.pageSize)} onValueChange={(value) => handleInputChange("pageSize", Number(value))}>
              <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-100">
                <SelectValue placeholder="Rozmiar strony" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} wyników
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={handleFilterSubmit} className="bg-emerald-600 hover:bg-emerald-500">
              <RefreshCcw className="mr-2 size-4" />
              Zastosuj filtry
            </Button>
            {pageSummary && (
              <div className="text-sm text-zinc-400">
                Wartość najwyższych ofert na stronie:{" "}
                <span className="font-semibold text-zinc-200">{pageSummary.totalValue.toFixed(0)} USD</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card className="border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-400">
          Ładowanie listingów...
        </Card>
      ) : listings.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-400">
          Brak aktywnych listingów dla wybranych filtrów.
        </Card>
      ) : viewMode === "tile" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.listingId} className="border-zinc-800 bg-zinc-900/60">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-zinc-100">Listing {listing.listingId}</CardTitle>
                  {statusIcon(listing.status)}
                </div>
                <CardDescription className="text-xs text-zinc-500">
                  {formattedDate(listing.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm text-zinc-400">Produkt</div>
                  <div className="text-sm font-medium text-zinc-100">{listing.product?.productName || "—"}</div>
                  <div className="text-xs text-zinc-500">{listing.variant?.variantName}</div>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(listing.status)}
                  <Badge className="bg-zinc-800 text-zinc-300">{listing.inventoryType || "STANDARD"}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-zinc-500">Popyt</div>
                    <div className="font-semibold text-zinc-100">{listing.highestBid || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500">Podanie ceny</div>
                    <div className="font-semibold text-zinc-100">{listing.askingPrice || "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800" onClick={() => setSelectedListing(listing)}>
                    Szczegóły
                  </Button>
                  <Button variant="destructive" className="bg-rose-600 hover:bg-rose-500">
                    Usuń
                  </Button>
                </div>
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
                  <TableHead>Listing</TableHead>
                  <TableHead>Produkt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead className="text-right">Utworzono</TableHead>
                  <TableHead className="text-right w-36">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow key={listing.listingId}>
                    <TableCell className="font-medium text-zinc-100">{listing.listingId}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <div className="text-sm font-medium text-zinc-200">{listing.product?.productName || "—"}</div>
                      <div className="text-xs text-zinc-500">{listing.variant?.variantName || listing.variant?.variantValue}</div>
                    </TableCell>
                    <TableCell>{statusBadge(listing.status)}</TableCell>
                    <TableCell>
                      <Badge className="bg-zinc-800 text-zinc-300">{listing.inventoryType || "STANDARD"}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-zinc-400">{formattedDate(listing.createdAt)}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button variant="outline" className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800" onClick={() => setSelectedListing(listing)}>
                        Szczegóły
                      </Button>
                      <Button variant="destructive" className="bg-rose-600 hover:bg-rose-500">
                        Usuń
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
          <Button
            variant="outline"
            className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
          >
            Poprzednia
          </Button>
          <span className="text-sm text-zinc-400">
            Strona <span className="font-semibold text-zinc-100">{pageNumber}</span>
          </span>
          <Button
            variant="outline"
            className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 disabled:opacity-40"
            disabled={!hasNextPage}
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
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
          <Button variant="outline" onClick={handleGoToPage} className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
            Przejdź
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedListing} onOpenChange={(open) => !open && setSelectedListing(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Listing {selectedListing?.listingId}</DialogTitle>
            <DialogDescription>Pełne metadane oferty StockX.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoRow label="Produkt" value={selectedListing?.product?.productName} />
            <InfoRow label="Wariant" value={selectedListing?.variant?.variantName} />
            <InfoRow label="Status" value={statusBadge(selectedListing?.status)} />
            <InfoRow label="Typ magazynu" value={selectedListing?.inventoryType} />
            <InfoRow label="Utworzono" value={formattedDate(selectedListing?.createdAt)} />
            <InfoRow label="Aktualizacja" value={formattedDate(selectedListing?.updatedAt)} />
            <InfoRow label="Highest bid" value={selectedListing?.highestBid} />
            <InfoRow label="Ask price" value={selectedListing?.askingPrice} />
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800" onClick={() => setSelectedListing(null)}>
              Zamknij
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500">Edytuj listing</Button>
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
