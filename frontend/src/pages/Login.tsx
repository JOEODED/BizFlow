import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login" ? { email, password } : { businessName, email, password };
      const data = await apiRequest(path, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("bizflow_token", data.token);
      localStorage.setItem("bizflow_business", data.businessName);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden md:flex flex-col justify-between bg-ink text-paper p-12">
        <p className="font-display font-bold text-2xl">BizFlow</p>
        <div>
          <p className="font-display text-4xl leading-tight max-w-sm">
            Run the whole shop from one screen.
          </p>
          <p className="text-paper/60 mt-4 max-w-sm">
            Products, stock, sales and today's profit — in one place, built for how you
            actually run your business.
          </p>
        </div>
        <p className="text-paper/40 text-sm">A tool for Nigerian small businesses</p>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="font-display font-bold text-2xl mb-1">
            {mode === "login" ? "Welcome back" : "Set up your business"}
          </h1>
          <p className="text-slate text-sm mb-6">
            {mode === "login" ? "Log in to see today's numbers." : "Takes less than a minute."}
          </p>

          {mode === "register" && (
            <label className="block mb-4">
              <span className="text-sm font-medium">Business name</span>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:border-marigold"
                placeholder="e.g. Chidinma Pharmacy"
              />
            </label>
          )}

          <label className="block mb-4">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:border-marigold"
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-ink/15 rounded px-3 py-2 focus:outline-none focus:border-marigold"
            />
          </label>

          {error && <p className="text-alert text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-marigold text-ink font-semibold py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-sm text-slate mt-4 hover:text-ink transition-colors"
          >
            {mode === "login" ? "New here? Create a business account" : "Already have an account? Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
