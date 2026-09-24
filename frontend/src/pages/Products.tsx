import { useEffect, useState, FormEvent } from "react";
import { apiRequest, Product } from "../lib/api";

const nairaFmt = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  function load() {
    apiRequest("/products").then(setProducts).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify({ name, price: Number(price), quantity: Number(quantity) }),
      });
      setName("");
      setPrice("");
      setQuantity("");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    }
  }

  return (
    <div className="p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-marigold text-ink font-semibold px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          {showForm ? "Cancel" : "Add product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="border border-ink/10 rounded p-5 mb-6 flex gap-3 items-end flex-wrap">
          <label className="flex-1 min-w-[160px]">
            <span className="text-sm font-medium">Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:border-marigold"
            />
          </label>
          <label className="w-32">
            <span className="text-sm font-medium">Price (₦)</span>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:border-marigold"
            />
          </label>
          <label className="w-28">
            <span className="text-sm font-medium">Stock</span>
            <input
              type="number"
              required
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:border-marigold"
            />
          </label>
          <button type="submit" className="bg-ink text-paper px-4 py-2 rounded font-semibold">
            Save
          </button>
        </form>
      )}

      {error && <p className="text-alert mb-4">{error}</p>}

      <div className="border border-ink/10 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-slate">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-slate">
                  No products yet — add your first one above.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3">{p.name}</td>
                  <td className="px-5 py-3">{nairaFmt.format(Number(p.price))}</td>
                  <td className={`px-5 py-3 ${p.quantity <= p.low_stock_threshold ? "text-alert font-medium" : ""}`}>
                    {p.quantity}
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
