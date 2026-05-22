-- Script à exécuter dans phpMyAdmin Hostinger
-- Sélectionnez la base u253061687_immo_rentier avant d'exécuter.

CREATE TABLE IF NOT EXISTS `Locataires` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(191) NOT NULL,
  `bien` VARCHAR(191) NULL,
  `loyer` INT NOT NULL DEFAULT 0,
  `statut` VARCHAR(50) NOT NULL DEFAULT 'À jour',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
