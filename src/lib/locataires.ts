export type LocataireInput = {
  nom: string;
  bien?: string | null;
  loyer: number;
  statut: string;
};

export type LocataireRecord = LocataireInput & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export const LOCATAIRE_STATUTS = ["À jour", "Retard", "Archivé"] as const;

export function validateLocataireInput(body: unknown): LocataireInput | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;
  const nom = typeof data.nom === "string" ? data.nom.trim() : "";
  const bien =
    typeof data.bien === "string" && data.bien.trim() ? data.bien.trim() : null;
  const loyer = Number(data.loyer);
  const statut = typeof data.statut === "string" ? data.statut.trim() : "";

  if (!nom || !statut || Number.isNaN(loyer) || loyer < 0) return null;
  if (!LOCATAIRE_STATUTS.includes(statut as (typeof LOCATAIRE_STATUTS)[number])) {
    return null;
  }

  return { nom, bien, loyer: Math.round(loyer), statut };
}

export function serializeLocataire(locataire: {
  id: number;
  nom: string;
  bien: string | null;
  loyer: number;
  statut: string;
  createdAt: Date;
  updatedAt: Date;
}): LocataireRecord {
  return {
    id: locataire.id,
    nom: locataire.nom,
    bien: locataire.bien,
    loyer: locataire.loyer,
    statut: locataire.statut,
    createdAt: locataire.createdAt.toISOString(),
    updatedAt: locataire.updatedAt.toISOString(),
  };
}
