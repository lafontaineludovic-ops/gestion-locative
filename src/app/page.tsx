import Link from "next/link";
import {
  IconBuilding,
  IconExpense,
  IconIncome,
  IconKey,
  IconReceipt,
  IconUsers,
} from "@/components/icons";
import { actualites, quickActions, stats } from "@/lib/data";

const actionIcons = {
  building: IconBuilding,
  users: IconUsers,
  key: IconKey,
  receipt: IconReceipt,
  income: IconIncome,
  expense: IconExpense,
};

export default function HomePage() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-greeting">
        Bonjour Ludovic ! <span aria-hidden="true">👋</span>
      </h1>

      <section className="quick-actions">
        {quickActions.map((action) => {
          const Icon = actionIcons[action.icon];
          return (
            <Link key={action.label} href={action.href} className="quick-action">
              <span className="quick-action-icon">
                <Icon />
              </span>
              <span className="quick-action-label">{action.label}</span>
            </Link>
          );
        })}
      </section>

      <section className="stats-grid">
        <Link href="/bien" className="stat-card">
          <div className="stat-card-header">
            <span>Biens</span>
            <button type="button" className="stat-card-settings" aria-label="Paramètres">
              ⚙
            </button>
          </div>
          <p className="stat-card-value">{stats.biens}</p>
        </Link>

        <Link href="/locataire" className="stat-card">
          <div className="stat-card-header">
            <span>Locataires</span>
            <button type="button" className="stat-card-settings" aria-label="Paramètres">
              ⚙
            </button>
          </div>
          <p className="stat-card-value">{stats.locataires}</p>
          <p className="stat-card-meta">{stats.locatairesArchives} archives</p>
        </Link>

        <Link href="/locations" className="stat-card">
          <div className="stat-card-header">
            <span>Locations</span>
            <button type="button" className="stat-card-settings" aria-label="Paramètres">
              ⚙
            </button>
          </div>
          <p className="stat-card-value">{stats.locations}</p>
          <p className="stat-card-meta">{stats.locationsArchives} archives</p>
        </Link>
      </section>

      <section className="dashboard-panels">
        <article className="panel">
          <div className="panel-header">
            <h2>Revenus et dépenses</h2>
            <button type="button" className="stat-card-settings" aria-label="Paramètres">
              ⚙
            </button>
          </div>

          <div className="panel-tabs">
            <button type="button" className="panel-tab panel-tab--active">
              Mois en cours
            </button>
            <button type="button" className="panel-tab">
              Mois dernier
            </button>
            <button type="button" className="panel-tab">
              Année en cours
            </button>
            <button type="button" className="panel-tab">
              12 mois
            </button>
          </div>

          <div className="panel-filter">
            <label htmlFor="bien-filter">Filtrer par bien</label>
            <select id="bien-filter" defaultValue="all">
              <option value="all">Tous les biens</option>
              <option value="lyon">Appartement T3 — Lyon 3e</option>
              <option value="villeurbanne">Studio — Villeurbanne</option>
            </select>
          </div>

          <div className="finance-stats">
            <div>
              <p className="finance-label">Loyers payés</p>
              <p className="finance-value finance-value--success">{stats.loyersPayes}</p>
            </div>
            <div>
              <p className="finance-label">Loyer en retard</p>
              <p className="finance-value finance-value--danger">{stats.loyerEnRetard}</p>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Actualités immobilières</h2>
          </div>

          <ul className="news-list">
            {actualites.map((item) => (
              <li key={item.titre} className="news-item">
                <span className="news-tag">{item.tag}</span>
                <p className="news-title">{item.titre}</p>
                <p className="news-date">{item.date}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
