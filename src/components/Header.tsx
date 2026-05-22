import Link from "next/link";
import {
  IconBell,
  IconHelp,
  IconHome,
  IconPlus,
  IconSearch,
  IconSettings,
} from "./icons";

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link href="/" className="topbar-logo" aria-label="Accueil">
          <IconHome className="topbar-logo-icon" />
        </Link>
        <button type="button" className="btn-add">
          <IconPlus className="btn-add-icon" />
          Ajouter
        </button>
      </div>

      <div className="topbar-right">
        <button type="button" className="topbar-icon-btn" aria-label="Rechercher">
          <IconSearch />
        </button>
        <button type="button" className="topbar-icon-btn topbar-icon-btn--alert" aria-label="Notifications">
          <IconBell />
          <span className="badge-dot" />
        </button>
        <button type="button" className="topbar-link">
          <IconHelp />
          Aide
        </button>
        <button type="button" className="topbar-link">
          <IconSettings />
          Mon compte
        </button>
      </div>
    </header>
  );
}
