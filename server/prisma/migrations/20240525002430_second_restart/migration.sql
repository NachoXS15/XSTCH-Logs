/*
  Warnings:

  - The primary key for the `Clients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Servicios` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_id_fkey";

-- DropForeignKey
ALTER TABLE "Servicios" DROP CONSTRAINT "Servicios_id_fkey";

-- AlterTable
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Clients_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Clients_id_seq";

-- AlterTable
ALTER TABLE "Registros" ALTER COLUMN "idCliente" SET DATA TYPE TEXT,
ALTER COLUMN "idServicio" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Servicios" DROP CONSTRAINT "Servicios_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Servicios_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Servicios_id_seq";

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_id_fkey" FOREIGN KEY ("id") REFERENCES "Registros"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios" ADD CONSTRAINT "Servicios_id_fkey" FOREIGN KEY ("id") REFERENCES "Registros"("idServicio") ON DELETE RESTRICT ON UPDATE CASCADE;
