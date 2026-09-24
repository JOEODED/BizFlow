  const BASE = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("bizflow_token");
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Something went wrong" }));
    throw new Error(body.error || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

export interface Product {
  id: number;
  name: string;
  sku: string | null;
  price: number;
  cost: number;
  quantity: number;
  low_stock_threshold: number;
}

export interface DashboardSummary {
  todaySales: number;
  saleCount: number;
  totalProducts: number;
  lowStock: number;
}
