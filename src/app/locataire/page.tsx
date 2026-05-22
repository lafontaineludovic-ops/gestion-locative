import Link from "next/link";
import { locataires } from "@/lib/data";

export default function LocatairePage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Locataires</h1>
          <p className="page-subtitle">Suivez vos locataires et leurs paiements</p>
        </div>
        <Link href="/locataire" className="btn-primary">
          + Nouveau locataire
        </Link>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Bien</th>
              <th>Loyer</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {locataires.map((locataire) => (
              <tr key={locataire.id}>
                <td className="cell-strong">{locataire.nom}</td>
                <td>{locataire.bien}</td>
                <td>{locataire.loyer > 0 ? `${locataire.loyer} €` : "—"}</td>
                <td>
                  <span
                    className={`status-pill${
                      locataire.statut === "Retard"
                        ? " status-pill--danger"
                        : locataire.statut === "Archivé"
                          ? " status-pill--muted"
                          : " status-pill--success"
                    }`}
                  >
                    {locataire.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
