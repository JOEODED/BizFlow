import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";

function isLoggedIn() {
  return Boolean(localStorage.getItem("bizflow_token"));
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={isLoggedIn() ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedLayout>
            <Products />
          </ProtectedLayout>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedLayout>
            <Sales />
          </ProtectedLayout>
        }
      />
    </Routes>
  );
}
