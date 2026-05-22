-- Script à exécuter dans phpMyAdmin Hostinger (hPanel → Bases de données → phpMyAdmin)
-- Sélectionnez votre base de données avant d'exécuter ce script.

CREATE TABLE IF NOT EXISTS `Biens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(191) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `adresse` VARCHAR(255) NULL,
  `loyer` INT NOT NULL DEFAULT 0,
  `statut` VARCHAR(50) NOT NULL DEFAULT 'Vacant',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données d'exemple (optionnel)
INSERT INTO `Biens` (`nom`, `type`, `adresse`, `loyer`, `statut`) VALUES
  ('Appartement T3 — Lyon 3e', 'Appartement', '12 rue Garibaldi, Lyon 3e', 850, 'Loué'),
  ('Studio — Villeurbanne', 'Studio', '5 avenue Henri Barbusse, Villeurbanne', 520, 'Loué'),
  ('Maison — Caluire', 'Maison', '8 chemin des Cerisiers, Caluire', 1200, 'Vacant'),
  ('Local commercial — Part-Dieu', 'Local', '45 rue de la Part-Dieu, Lyon', 980, 'Loué');
