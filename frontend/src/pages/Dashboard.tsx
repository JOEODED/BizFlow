import { useEffect, useState } from "react";
import { apiRequest, DashboardSummary } from "../lib/api";

const nairaFmt = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/dashboard/summary")
      .then(setSummary)
      .catch((err) => setError(err.message));
  }, []);

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="p-10 max-w-4xl">
      <p className="text-slate text-sm mb-1">{today}</p>
      <h1 className="font-display font-bold text-3xl mb-8">Today</h1>

      {error && <p className="text-alert">{error}</p>}

      {summary && (
        <>
          {/* Hero stat: today's sales, the number that matters most */}
          <div className="bg-ink text-paper rounded p-8 mb-6">
            <p className="text-paper/50 text-sm mb-2">Sales so far today</p>
            <p className="font-display font-bold text-5xl">{nairaFmt.format(summary.todaySales)}</p>
            <p className="text-paper/50 text-sm mt-3">
              {summary.saleCount} sale{summary.saleCount === 1 ? "" : "s"} recorded
            </p>
          </div>

          {/* Secondary stats: quiet, bordered, no shadow */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-ink/10 rounded p-5">
              <p className="text-slate text-sm mb-1">Products</p>
              <p className="font-display font-bold text-2xl">{summary.totalProducts}</p>
            </div>
            <div className="border border-ink/10 rounded p-5">
              <p className="text-slate text-sm mb-1">Low stock</p>
              <p
                className={`font-display font-bold text-2xl ${
                  summary.lowStock > 0 ? "text-alert" : ""
                }`}
              >
                {summary.lowStock}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
