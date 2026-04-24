import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { useAuth } from "../contexts/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/chat", label: "AI Chat" },
  { to: "/tasks", label: "Daily Tasks" },
  { to: "/practice", label: "Lab" },
  { to: "/rewards", label: "Rewards" },
  { to: "/insights", label: "Insights" },
  { to: "/style", label: "Learning Style" },
  { to: "/contact", label: "Contact" },
];

export default function AppShell({ title, subtitle, children }) {
  const { logout, user } = useAuth();

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="brand-block">
          <img src="/vakify-logo.svg" alt="Vakify logo" />
          <div>
            <p>Vakify.Ai</p>
            <small>AI Learning OS</small>
          </div>
        </div>

        <nav className="side-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
          {user?.is_admin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
            >
              Admin Control
            </NavLink>
          )}
        </nav>

        <button className="outline-btn sidebar-logout" onClick={logout} type="button">
          Sign Out
        </button>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="topbar-right">
            <div className="user-chip">
              <span>{user?.name || "Learner"}</span>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
