import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1 className="page-title">Accueil</h1>
      <p className="page-subtitle">
        Sélectionnez une section dans le menu pour commencer.
      </p>

      <div className="home-grid">
        <Link href="/bien" className="home-card">
          <h2>Bien</h2>
          <p>Gérez vos biens immobiliers : adresses, types, loyers.</p>
          <span className="home-card-link">Accéder →</span>
        </Link>

        <Link href="/locataire" className="home-card">
          <h2>Locataire</h2>
          <p>Gérez vos locataires : coordonnées, baux, paiements.</p>
          <span className="home-card-link">Accéder →</span>
        </Link>
      </div>
    </>
  );
}
