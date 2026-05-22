export type BienInput = {
  nom: string;
  type: string;
  adresse?: string | null;
  loyer: number;
  statut: string;
};

export type BienRecord = BienInput & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export const BIEN_TYPES = ["Appartement", "Studio", "Maison", "Local", "Parking", "Autre"] as const;

export const BIEN_STATUTS = ["Loué", "Vacant", "En travaux", "Archivé"] as const;

export function validateBienInput(body: unknown): BienInput | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;
  const nom = typeof data.nom === "string" ? data.nom.trim() : "";
  const type = typeof data.type === "string" ? data.type.trim() : "";
  const adresse =
    typeof data.adresse === "string" && data.adresse.trim() ? data.adresse.trim() : null;
  const loyer = Number(data.loyer);
  const statut = typeof data.statut === "string" ? data.statut.trim() : "";

  if (!nom || !type || !statut || Number.isNaN(loyer) || loyer < 0) return null;
  if (!BIEN_TYPES.includes(type as (typeof BIEN_TYPES)[number])) return null;
  if (!BIEN_STATUTS.includes(statut as (typeof BIEN_STATUTS)[number])) return null;

  return { nom, type, adresse, loyer: Math.round(loyer), statut };
}

export function serializeBien(bien: {
  id: number;
  nom: string;
  type: string;
  adresse: string | null;
  loyer: number;
  statut: string;
  createdAt: Date;
  updatedAt: Date;
}): BienRecord {
  return {
    id: bien.id,
    nom: bien.nom,
    type: bien.type,
    adresse: bien.adresse,
    loyer: bien.loyer,
    statut: bien.statut,
    createdAt: bien.createdAt.toISOString(),
    updatedAt: bien.updatedAt.toISOString(),
  };
}
