"use client"
import { postClient } from "@/app/lib/data-client"
export default function page() {

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const clientName = formData.get("nombre")?.toString();
        const price = formData.get("price")?.toString();
        const service = formData.get("service")?.toString();
        const date = formData.get("date")?.toString();
        const status = formData.get("status")?.toString();
        const payment = formData.get("payment")?.toString();
        const place = formData.get("place")?.toString();
        const obvs = formData.get("obvs")?.toString()

        console.log({
            clientName,
            price,
            status,
            date,
            obvs,
            payment,
            place,
            service,
        });
        if (!clientName || !price || !service || !date || !status || !payment || !place) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        try {
            await postClient({
                client_name: clientName,
                price: Number(price),
                service: service,
                egreso: date,
                status: status,
                payment: payment,
                place: place,
                obvs: obvs
            })
            window.location.href = "/dashboard/clients"
        } catch (error) {
            console.log("Error: ", error);
        }
    }


    return (
        <section className="xl:w-4/6 px-5 py-10 flex items-center justify-start flex-col">
            <div className="text-left w-full">
                <h3 className="text-lg font-semibold ml-3 text-slate-800">Agregar registro</h3>
                <p className="text-slate-500 mb-5 ml-3">Registro de Clientes pertenecientes a XSTCH</p>
            </div>
            <form onSubmit={handleSubmit} className="w-full px-5 flex flex-col gap-5">
                <div className="flex items-center gap-5">
                    <div className="w-1/2 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Nombre</label>
                        <input type="text" id="nombre" name="nombre" className="bg-slate-200 rounded h-10 py-2 pl-4" placeholder="Ej: Angel Reynoso"/>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <label htmlFor="service">Servicio</label>
                        <input type="text" id="service" name="service" className="bg-slate-200 rounded h-10 py-2 px-4" placeholder="Ej: Limpieza a PC"/>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="w-1/2 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Precio</label>
                        <input type="number" id="price" name="price" className="bg-slate-200 rounded h-10 py-2 pl-4" placeholder="Ej: 12000"/>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <label htmlFor="service">Fecha de Egreso</label>
                        <input type="date" id="date" name="date" className="bg-slate-200 rounded h-10 py-2 px-4" placeholder="Ej: Angel Reynoso"/>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <div className="w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Estado</label>
                        <select className="bg-slate-200 rounded h-10 py-2 pl-4" name="status">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Listo">Listo</option>
                            <option value="A cumplir">A cumplir</option>
                            <option value="A confirmar">A confirmar</option>
                        </select>
                    </div>
                    <div className="w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Pago</label>
                        <select className="bg-slate-200 rounded h-10 py-2 pl-4" name="payment">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Pagado">Pagado</option>
                            <option value="Señado">Señado</option>
                            <option value="Pendiente">Pendiente</option>
                        </select>
                    </div>
                    <div className="w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Lugar</label>
                        <select className="bg-slate-200 rounded h-10 py-2 pl-4" name="place">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Taller">Taller</option>
                            <option value="Punto de Encuentro">Punto de Encuentro</option>
                            <option value="Domicilio">Domicilio</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 flex-col">
                    <label htmlFor="obvs">Observaciones</label>
                    <textarea name="obvs" id="obvs" className="w-full h-24 p-4 bg-slate-200 resize-none" placeholder="Ej: Temperaturas altas"></textarea>
                </div>
                <div className="w-full flex gap-4">
                    <button type="submit" className="w-1/2 transition border bg-green-500 text-white py-3 rounded hover:bg-white hover:text-green-500">Cargar Registro</button>
                    <button type="reset" className="w-1/2 transition border border-red-500 text-red-500 py-3 rounded hover:bg-red-500 hover:text-white">Limpiar</button>
                </div>
            </form>
        </section>
    )
}
