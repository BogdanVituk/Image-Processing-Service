/*
  Warnings:

  - A unique constraint covering the columns `[fileName]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Image_fileName_key` ON `Image`(`fileName`);
