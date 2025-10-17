import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Alert } from "./components/ui/alert";

export default function SalesPanel() {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ productName: "", quantity: 1, price: 0, saleDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/sales");
      setSales(res.data ?? []);
    } catch (err) {
      setError("Nie udało się pobrać historii sprzedaży.");
    } finally {
      setLoading(false);
    }
  };

  const submitSale = async () => {
    if (!form.productName || !form.saleDate) {
      setError("Uzupełnij nazwę produktu i datę sprzedaży.");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/api/sales", form);
      setForm({ productName: "", quantity: 1, price: 0, saleDate: "" });
      fetchSales();
    } catch (err) {
      setError("Nie udało się zapisać sprzedaży.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const revenue = sales.reduce((sum, sale) => sum + (sale.price || 0) * (sale.quantity || 0), 0);
    const quantity = sales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
    return { revenue, quantity };
  }, [sales]);

  return (
    <div className="space-y-8">
      {error && <Alert variant="destructive">{error}</Alert>}

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle>Zapisz sprzedaż offline</CardTitle>
          <CardDescription>Rejestruj transakcje poza StockX, aby mieć komplet danych o kanale własnym.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input
            placeholder="Produkt"
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
          />
          <Input
            type="number"
            min="1"
            placeholder="Ilość"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) || 0 })}
          />
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Cena jednostkowa"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })}
          />
          <Input
            type="date"
            value={form.saleDate}
            onChange={(e) => setForm({ ...form, saleDate: e.target.value })}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={submitSale} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">
            Zapisz sprzedaż
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Historia sprzedaży ręcznej</CardTitle>
            <CardDescription>Transakcje spoza integracji StockX.</CardDescription>
          </div>
          <div className="text-xs text-zinc-400">
            Łącznie: <span className="font-semibold text-zinc-100">{totals.quantity}</span> szt. |{" "}
            <span className="font-semibold text-zinc-100">{totals.revenue.toFixed(2)} PLN</span>
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-xl border border-zinc-800 p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produkt</TableHead>
                <TableHead className="text-right">Ilość</TableHead>
                <TableHead className="text-right">Cena</TableHead>
                <TableHead className="text-right">Wartość</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-sm text-zinc-400">
                    Ładowanie danych...
                  </TableCell>
                </TableRow>
              ) : sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-sm text-zinc-400">
                    Brak zapisanych transakcji offline.
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="text-sm text-zinc-300">{sale.saleDate || "—"}</TableCell>
                    <TableCell className="font-medium text-zinc-100">{sale.productName}</TableCell>
                    <TableCell className="text-right text-sm text-zinc-300">{sale.quantity}</TableCell>
                    <TableCell className="text-right text-sm text-zinc-300">{sale.price.toFixed(2)} PLN</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-zinc-100">
                      {(sale.price * sale.quantity).toFixed(2)} PLN
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
