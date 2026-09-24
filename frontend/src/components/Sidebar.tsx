import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Today" },
  { to: "/products", label: "Products" },
  { to: "/sales", label: "Sales" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const businessName = localStorage.getItem("bizflow_business") || "Your business";

  function logout() {
    localStorage.removeItem("bizflow_token");
    localStorage.removeItem("bizflow_business");
    navigate("/login");
  }

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 bg-ink text-paper flex flex-col justify-between py-6">
      <div>
        <div className="px-6 pb-8">
          <p className="font-display font-bold text-xl tracking-tight">BizFlow</p>
          <p className="text-xs text-paper/50 mt-1 truncate">{businessName}</p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive ? "bg-marigold text-ink" : "text-paper/70 hover:bg-white/5 hover:text-paper"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        onClick={logout}
        className="mx-6 text-left text-sm text-paper/50 hover:text-paper transition-colors"
      >
        Log out
      </button>
    </aside>
  );
}
