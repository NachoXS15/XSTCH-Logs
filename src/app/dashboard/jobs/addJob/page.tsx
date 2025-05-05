"use client"
import { postJob } from "@/app/lib/data-client"
export default function page() {

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget)
        const clientName = formData.get("nombre")?.toString();
        const price = formData.get("price")?.toString();
        const date = formData.get("date")?.toString();
        const active = formData.get("active")?.toString();
        const account = formData.get("account")?.toString();
        const obvs = formData.get("obvs")?.toString();
        const partner = formData.get("partner") == "Solo" ? false : true;
        const pay_method = formData.get("method")?.toString();
        const partner_name = formData.get("partner_name")?.toString();
        
        if (!clientName || !price || !account || !active || !date ||!obvs) {
            console.error("Todos los campos son obligatorios");
            return;
        }
        console.log(pay_method);
        
        try {
            await postJob({
                client_name: clientName,
                price: Number(price),
                date: date,
                obvs: obvs,
                account: account,
                active: active,
                partner: partner,
                partner_name: partner_name, 
                pay_method: pay_method
            })
            // window.location.href = "/dashboard/jobs"
        } catch (error) {
            console.log("Error: ", error);
        }
    }


    return (
        <section className="w-full md:w-5/6 xl:w-4/6 px-5 py-10 flex items-center justify-start flex-col">
            <div className="text-left w-full">
                <h3 className="text-lg font-semibold ml-3 text-slate-800">Agregar Trabajo</h3>
                <p className="text-slate-500 mb-5 ml-3">Manejo de Redes Sociales, Proyectos de Programación, etc</p>
            </div>
            <form onSubmit={handleSubmit} className="w-full md:px-5 flex flex-col gap-5">
                <div className="w-full flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Nombre</label>
                        <input type="text" id="nombre" name="nombre" className="bg-slate-200 rounded h-10 py-2 pl-4" placeholder="Empresa X"/>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Precio</label>
                        <input type="number" id="price" name="price" className="bg-slate-200 rounded h-10 py-2 pl-4" placeholder="Ej: 12000"/>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Método de Pago</label>
                        <select name="method" className="bg-slate-200 rounded h-10 py-2 px-4">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Transferencia">Transferencia</option>
                            <option value="Mixto">Mixto</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="service">Fecha estimada de pago</label>
                        <input type="text" id="date" name="date" className="bg-slate-200 rounded h-10 py-2 px-4" placeholder="Ej: 1-10"/>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Estado</label>
                        <select className="bg-slate-200 rounded h-10 py-2 pl-4" name="active">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Activo">Activo</option>
                            <option value="Por confirmar">Por confirmar</option>
                            <option value="No Activo">No Activo</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="service">Cuenta</label>
                        <input type="text" id="date" name="account" className="bg-slate-200 rounded h-10 py-2 px-4" placeholder="Ej: @cuenta123_"/>
                    </div>
                </div>
                <div className="w-full flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Compañero?</label>
                        <select className="bg-slate-200 rounded h-10 py-2 pl-4" name="partner">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Solo">Solo</option>
                            <option value="Acompañado">Acompañado</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Nombre de Compañero</label>
                        <input type="text" id="partner_name" name="partner_name" className="bg-slate-200 rounded h-10 py-2 pl-4" placeholder="Lucas"/>
                    </div>
                </div>
                <div className="flex gap-2 flex-col">
                    <label htmlFor="obvs">Observaciones</label>
                    <textarea name="obvs" id="obvs" className="w-full h-24 p-4 bg-slate-200 resize-none" placeholder="Ej: Quiere más historias"></textarea>
                </div>
                <div className="w-full flex gap-4">
                    <button type="submit" className="w-1/2 transition border bg-green-500 text-white py-3 rounded hover:bg-white hover:text-green-500">Cargar Registro</button>
                    <button type="reset" className="w-1/2 transition border border-red-500 text-red-500 py-3 rounded hover:bg-red-500 hover:text-white">Limpiar</button>
                </div>
            </form>
        </section>
    )
}
