-- AlterTable
ALTER TABLE `image` ADD COLUMN `accountType` ENUM('FREE', 'PAID') NOT NULL DEFAULT 'FREE';
