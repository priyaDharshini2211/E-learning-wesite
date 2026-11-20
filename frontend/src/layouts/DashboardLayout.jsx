import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandMark from "../components/BrandMark";
import { NAV_ITEMS, ROLE_LABEL } from "./navConfig";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const items = NAV_ITEMS[user.role] || [];
  const displayName = user.first_name ? `${user.first_name} ${user.last_name}` : user.username;

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar-brand">
          <BrandMark compact />
        </div>
        <nav className="app-sidebar-nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `app-sidebar-link${isActive ? " active" : ""}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="app-sidebar-footer">
          <NavLink to="/" className="app-sidebar-link mb-2">
            <i className="bi bi-house"></i>
            <span>Home page</span>
          </NavLink>
          <button className="btn btn-outline-primary btn-sm w-100" onClick={logout}>
            <i className="bi bi-box-arrow-right me-1"></i>
            Log out
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-role">{ROLE_LABEL[user.role]}</div>
          <div className="d-flex align-items-center gap-2">
            <div className="avatar">{(user.first_name?.[0] || user.username[0]).toUpperCase()}</div>
            <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>
              {displayName}
            </div>
          </div>
        </header>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
