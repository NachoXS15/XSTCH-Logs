import { Services } from "@/app/utils/services";

export default function page() {
    return (
        <section className='w-full z-40 xl:w-10/12 overflow-hidden px-5 py-10 flex items-center justify-start flex-col'>
            <div className="w-full flex flex-col py-5 md:flex-row justify-between items-center">
                <div className="text-left w-full border-b border-slate-200 mb-4 md:border-0 md:mb-0">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50">Calculadora de Costos</h3>
                    <p className="text-slate-500 mb-5">Presupuesto para técnico y lista de precios de todos los servicios</p>
                </div>
            </div>
            <section className="w-full flex gap-20">
                <table className="text-left table-auto w-1/3 overflow-hidden">
                    <thead className="w-full border-b border-slate-300 bg-slate-50">
                        <tr className='w-full'>
                            <th className="p-4 border-b border-slate-300 bg-slate-50">
                                <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-950">
                                    Servicio
                                </p>
                            </th>
                            <th className="p-4 border-b border-slate-300 bg-slate-50">
                                <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-950">
                                    Precio
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Services.map((service, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-500 text-slate-500 dark:text-slate-50">
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm">
                                            {service.name}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm">
                                            ${service.price}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
                <div>
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-50">¿Cuánto cobrar?</h4>
                    <p className="text-slate-500">Selecciona los servicios solicitados y calcule el costo</p>
                    <div></div>
                </div>
            </section>
        </section>
    )
}
