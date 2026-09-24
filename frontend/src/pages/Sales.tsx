import { useEffect, useState, FormEvent } from "react";
import { apiRequest, Product } from "../lib/api";

const nairaFmt = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

interface Sale {
  id: number;
  product_name: string;
  quantity: number;
  total: number;
  sold_at: string;
}

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");

  function load() {
    apiRequest("/products").then(setProducts).catch(() => {});
    apiRequest("/sales").then(setSales).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleSale(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await apiRequest("/sales", {
        method: "POST",
        body: JSON.stringify({ productId: Number(productId), quantity: Number(quantity) }),
      });
      setQuantity("1");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record sale");
    }
  }

  return (
    <div className="p-10 max-w-4xl">
      <h1 className="font-display font-bold text-3xl mb-8">Sales</h1>

      <form onSubmit={handleSale} className="border border-ink/10 rounded p-5 mb-6 flex gap-3 items-end flex-wrap">
        <label className="flex-1 min-w-[180px]">
          <span className="text-sm font-medium">Product</span>
          <select
            required
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:border-marigold"
          >
            <option value="" disabled>
              Choose a product
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.quantity} in stock
              </option>
            ))}
          </select>
        </label>
        <label className="w-28">
          <span className="text-sm font-medium">Quantity</span>
          <input
            type="number"
            required
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:border-marigold"
          />
        </label>
        <button type="submit" className="bg-marigold text-ink font-semibold px-4 py-2 rounded hover:opacity-90 transition-opacity">
          Record sale
        </button>
      </form>

      {error && <p className="text-alert mb-4">{error}</p>}

      <div className="border border-ink/10 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-slate">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Qty</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              sales.map((s) => (
                <tr key={s.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3">{s.product_name}</td>
                  <td className="px-5 py-3">{s.quantity}</td>
                  <td className="px-5 py-3">{nairaFmt.format(Number(s.total))}</td>
                  <td className="px-5 py-3 text-slate">
                    {new Date(s.sold_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
