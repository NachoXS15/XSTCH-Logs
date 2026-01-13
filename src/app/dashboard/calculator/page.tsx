
export default function page() {
    return (
        <section className='w-full z-40 xl:w-10/12 overflow-hidden px-5 py-10 flex items-center justify-start flex-col'>
            <div className="w-full flex flex-col py-5 md:flex-row justify-between items-center">
                <div className="text-left w-full border-b border-slate-200 mb-4 md:border-0 md:mb-0">
                    <h3 className="text-lg font-semibold ml-3 text-slate-800">Calculadora de Costos</h3>
                    <p className="text-slate-500 mb-5 ml-3">Presupuesto para técnico y lista de precios de todos los servicios</p>
                </div>
            </div>
            <section>
                <table className="text-left table-auto min-w-max overflow-hidden w-full">
                    <thead className="w-full border-b border-slate-300 bg-slate-50">
                        <tr className='w-full'>
                            <th className="p-4 border-b border-slate-300 bg-slate-50">
                                <p className="block text-sm font-normal leading-none text-slate-500">
                                    Servicio
                                </p>
                            </th>
                            <th className="p-4 border-b border-slate-300 bg-slate-50">
                                <p className="block text-sm font-normal leading-none text-slate-500">
                                    Precio
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-slate-50">
                            <td className="p-4 border-b border-slate-200">
                                <p className="block text-sm text-slate-800">
                                    Limpieza
                                </p>
                            </td>
                            <td className="p-4 border-b border-slate-200">
                                <p className="block text-sm text-slate-800">
                                    $20000
                                </p>
                            </td>
                        </tr>
                    </tbody>

                </table>
            </section>
        </section>
    )
}
