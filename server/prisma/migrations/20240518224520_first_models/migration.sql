-- CreateTable
CREATE TABLE "Registros" (
    "id" SERIAL NOT NULL,
    "idCliente" INTEGER NOT NULL,
    "idServicio" INTEGER NOT NULL,

    CONSTRAINT "Registros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "nombre_cliente" TEXT NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicios" (
    "id" SERIAL NOT NULL,
    "nombre_servicio" TEXT NOT NULL,

    CONSTRAINT "Servicios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Registros_idCliente_key" ON "Registros"("idCliente");

-- CreateIndex
CREATE UNIQUE INDEX "Registros_idServicio_key" ON "Registros"("idServicio");

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_id_fkey" FOREIGN KEY ("id") REFERENCES "Registros"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios" ADD CONSTRAINT "Servicios_id_fkey" FOREIGN KEY ("id") REFERENCES "Registros"("idServicio") ON DELETE RESTRICT ON UPDATE CASCADE;
