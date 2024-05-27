/*
  Warnings:

  - The primary key for the `Registros` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idCliente` on the `Registros` table. All the data in the column will be lost.
  - You are about to drop the column `idServicio` on the `Registros` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_id_fkey";

-- DropForeignKey
ALTER TABLE "Servicios" DROP CONSTRAINT "Servicios_id_fkey";

-- DropIndex
DROP INDEX "Registros_idCliente_key";

-- DropIndex
DROP INDEX "Registros_idServicio_key";

-- AlterTable
ALTER TABLE "Registros" DROP CONSTRAINT "Registros_pkey",
DROP COLUMN "idCliente",
DROP COLUMN "idServicio",
ADD COLUMN     "clienteId" TEXT,
ADD COLUMN     "servicioId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Registros_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Registros_id_seq";

-- AddForeignKey
ALTER TABLE "Registros" ADD CONSTRAINT "Registros_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registros" ADD CONSTRAINT "Registros_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
