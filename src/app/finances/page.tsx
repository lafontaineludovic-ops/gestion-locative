import { stats } from "@/lib/data";

export default function FinancesPage() {
  return (
    <div className="page">
      <h1 className="page-title">Finances</h1>
      <p className="page-subtitle">Revenus, dépenses et quittances</p>

      <div className="stats-grid stats-grid--compact">
        <div className="stat-card stat-card--static">
          <div className="stat-card-header">
            <span>Loyers payés</span>
          </div>
          <p className="stat-card-value stat-card-value--success">{stats.loyersPayes}</p>
        </div>
        <div className="stat-card stat-card--static">
          <div className="stat-card-header">
            <span>Loyers en retard</span>
          </div>
          <p className="stat-card-value stat-card-value--danger">{stats.loyerEnRetard}</p>
        </div>
      </div>

      <div className="card">
        <p>Module finances en cours de développement.</p>
      </div>
    </div>
  );
}
