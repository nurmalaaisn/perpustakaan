/*
  Warnings:

  - You are about to drop the column `kelas` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `student` table. All the data in the column will be lost.
  - Made the column `email` on table `student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `peminjamanbuku` DROP FOREIGN KEY `PeminjamanBuku_nis_fkey`;

-- DropIndex
DROP INDEX `PeminjamanBuku_nis_fkey` ON `peminjamanbuku`;

-- AlterTable
ALTER TABLE `peminjamanbuku` MODIFY `nis` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `kelas`,
    DROP COLUMN `name`,
    MODIFY `nis` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `PeminjamanBuku` ADD CONSTRAINT `PeminjamanBuku_nis_fkey` FOREIGN KEY (`nis`) REFERENCES `Student`(`nis`) ON DELETE SET NULL ON UPDATE CASCADE;
