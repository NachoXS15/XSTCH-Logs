import { fetchClientByID } from "@/app/lib/data-server"
import { editClient } from "./actions"
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from "next/dist/build/templates/pages";

export default async function Page({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { id } = await params
    const client = await fetchClientByID(id);


    return (
        <section className="w-full md:w-5/6 xl:w-4/6 lg:px-24 py-10 flex items-center justify-start flex-col">
            <div className="text-left w-full">
                <h3 className="text-lg font-semibold ml-3 text-slate-800">Editar o actualizar cliente</h3>
                <p className="text-slate-500 mb-5 ml-3">Registro de Clientes pertenecientes a XSTCH</p>
            </div>
            <form className="w-full px-5 flex flex-col gap-5">
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Nombre</label>
                        <input type="text" id="nombre" defaultValue={client?.client_name} name="nombre" className="bg-slate-200 rounded h-10 py-2 pl-4" placeholder="Ej: Angel Reynoso"/>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label htmlFor="service">Servicio</label>
                        <input type="text" id="service" defaultValue={client?.service} name="service" className="bg-slate-200 rounded h-10 py-2 px-4" placeholder="Ej: Angel Reynoso"/>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Precio</label>
                        <input type="number" id="price" defaultValue={client?.price} name="price" className="bg-slate-200 rounded h-10 py-2 pl-4" placeholder="Ej: Angel Reynoso"/>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label htmlFor="service">Fecha de Egreso</label>
                        <input type="date" id="date" name="date" defaultValue={client?.egreso} className="bg-slate-200 rounded h-10 py-2 px-4" placeholder="Ej: Angel Reynoso"/>
                    </div>
                </div>
                <input type="hidden" value={id} name="id" />
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Estado</label>
                        <select className="bg-slate-200 px rounded h-10 py-2 px-4" defaultValue={client?.status} name="status">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Listo">Listo</option>
                            <option value="A cumplir">A cumplir</option>
                            <option value="A confirmar">A confirmar</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Pago</label>
                        <select className="bg-slate-200 px rounded h-10 py-2 px-4" defaultValue={client?.payment} name="payment">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Pagado">Pagado</option>
                            <option value="Señado">Señado</option>
                            <option value="Pendiente">Pendiente</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Lugar</label>
                        <select className="bg-slate-200 px rounded h-10 py-2 px-4" defaultValue={client?.place} name="place">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Taller">Taller</option>
                            <option value="Punto de Encuentro">Punto de Encuentro</option>
                            <option value="Domicilio">Domicilio</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 flex-col">
                    <label htmlFor="obvs">Observaciones</label>
                    <textarea name="obvs" id="obvs" defaultValue={client?.obvs} className="w-full h-24 p-4 bg-slate-200 resize-none" placeholder="Ej: Temperaturas altas"></textarea>
                </div>
                <div className="w-full flex gap-4">
                    <button formAction={editClient} type="submit" className="w-1/2 transition border bg-green-500 text-white py-3 rounded hover:bg-white hover:text-green-500">Actualizar registro</button>
                    <button type="reset" className="w-1/2 transition border border-red-500 text-red-500 py-3 rounded hover:bg-red-500 hover:text-white">Limpiar</button>
                </div>
            </form>
        </section>
    )
}
