/*
  Warnings:

  - You are about to drop the column `accountType` on the `image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `image` DROP COLUMN `accountType`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `accountType` ENUM('FREE', 'PAID') NOT NULL DEFAULT 'FREE';
