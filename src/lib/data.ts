export const stats = {
  biens: 19,
  locataires: 21,
  locatairesArchives: 9,
  locations: 17,
  locationsArchives: 7,
  loyersPayes: 18,
  loyerEnRetard: 1,
};

export const biens = [
  { id: 1, nom: "Appartement T3 — Lyon 3e", type: "Appartement", loyer: 850, statut: "Loué" },
  { id: 2, nom: "Studio — Villeurbanne", type: "Studio", loyer: 520, statut: "Loué" },
  { id: 3, nom: "Maison — Caluire", type: "Maison", loyer: 1200, statut: "Vacant" },
  { id: 4, nom: "Local commercial — Part-Dieu", type: "Local", loyer: 980, statut: "Loué" },
];

export const locataires = [
  { id: 1, nom: "Martin Dupont", bien: "Appartement T3 — Lyon 3e", loyer: 850, statut: "À jour" },
  { id: 2, nom: "Sophie Bernard", bien: "Studio — Villeurbanne", loyer: 520, statut: "À jour" },
  { id: 3, nom: "Karim El Amrani", bien: "Local commercial — Part-Dieu", loyer: 980, statut: "Retard" },
  { id: 4, nom: "Julie Moreau", bien: "—", loyer: 0, statut: "Archivé" },
];

export const actualites = [
  {
    tag: "Location",
    titre: "Révision annuelle des loyers : ce que dit l'indice IRL",
    date: "22 mai 2026",
  },
  {
    tag: "Aides",
    titre: "Logement social : les livraisons repartent à la hausse",
    date: "20 mai 2026",
  },
  {
    tag: "Fiscalité",
    titre: "Déclaration des revenus fonciers : les dates à retenir",
    date: "18 mai 2026",
  },
];

export const quickActions = [
  { label: "Nouveau bien", href: "/bien", icon: "building" as const },
  { label: "Nouveau locataire", href: "/locataire", icon: "users" as const },
  { label: "Nouvelle location", href: "/locations", icon: "key" as const },
  { label: "Mes quittances", href: "/finances", icon: "receipt" as const },
  { label: "Ajouter un revenu", href: "/finances", icon: "income" as const },
  { label: "Ajouter une dépense", href: "/finances", icon: "expense" as const },
];
