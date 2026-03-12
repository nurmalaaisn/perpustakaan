/*
  Warnings:

  - Added the required column `name` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `kelas` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `jurusan` VARCHAR(191) NULL,
    ALTER COLUMN `password` DROP DEFAULT,
    ALTER COLUMN `role` DROP DEFAULT;
