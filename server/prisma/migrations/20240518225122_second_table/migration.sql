/*
  Warnings:

  - Added the required column `egreso` to the `Registros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Registros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pago` to the `Registros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio` to the `Registros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registros" ADD COLUMN     "egreso" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "pago" TEXT NOT NULL,
ADD COLUMN     "precio" INTEGER NOT NULL;
