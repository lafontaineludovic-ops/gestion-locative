"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBuilding,
  IconDocument,
  IconFinance,
  IconHome,
  IconKey,
  IconUsers,
} from "./icons";

const essentialNav = [
  { label: "Bureau", href: "/", icon: IconHome },
  { label: "Biens", href: "/bien", icon: IconBuilding },
  { label: "Locataires", href: "/locataire", icon: IconUsers },
  { label: "Locations", href: "/locations", icon: IconKey },
  { label: "Finances", href: "/finances", icon: IconFinance, badge: 2 },
  { label: "Documents", href: "/documents", icon: IconDocument },
];

const plusNav = [
  "Carnet",
  "Interventions",
  "Tâches",
  "Notes",
  "Messages",
  "Candidats",
  "Outils",
  "Corbeille",
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <p className="sidebar-heading">L&apos;essentiel</p>
        <nav className="sidebar-nav">
          {essentialNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link${active ? " sidebar-link--active" : ""}`}
              >
                <span className="sidebar-link-icon">
                  <Icon />
                </span>
                <span className="sidebar-link-label">{item.label}</span>
                {item.badge ? (
                  <span className="sidebar-badge">{item.badge}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-heading">Le plus</p>
        <nav className="sidebar-nav sidebar-nav--muted">
          {plusNav.map((label) => (
            <span key={label} className="sidebar-link sidebar-link--disabled">
              <span className="sidebar-link-label">{label}</span>
            </span>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-footer-label">Mode expert</span>
        <label className="toggle">
          <input type="checkbox" defaultChecked readOnly />
          <span className="toggle-track" />
        </label>
      </div>
    </aside>
  );
}
