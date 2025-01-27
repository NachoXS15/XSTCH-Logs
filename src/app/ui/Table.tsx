import clientType from "../lib/definitions"


export default function Table({ clients }: { clients: clientType[] }) {
    return (
        <table className="w-full text-left table-auto min-w-max">
            <thead>
                <tr>
                    <th className="p-4 border-b border-slate-300 bg-slate-50">
                        <p className="block text-sm font-normal leading-none text-slate-500">
                            Cliente
                        </p>
                    </th>
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
                    <th className="p-4 border-b border-slate-300 bg-slate-50">
                        <p className="block text-sm font-normal leading-none text-slate-500">
                            Lugar
                        </p>
                    </th>
                    <th className="p-4 border-b border-slate-300 bg-slate-50">
                        <p className="block text-sm font-normal leading-none text-slate-500">
                            Egreso
                        </p>
                    </th>
                    <th className="p-4 border-b border-slate-300 bg-slate-50">
                        <p className="block text-sm font-normal leading-none text-slate-500">
                            Estado
                        </p>
                    </th>
                    <th className="p-4 border-b border-slate-300 bg-slate-50">
                        <p className="block text-sm font-normal leading-none text-slate-500">
                            Pago
                        </p>
                    </th>
                    <th className="p-4 border-b border-slate-300 bg-slate-50">
                        <p className="block text-sm font-normal leading-none text-slate-500">
                            Observaciones
                        </p>
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    clients.map((client, i) => {
                        return (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-sm text-slate-800">
                                        {client.client_name}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-sm text-slate-800">
                                        {client.service}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-sm text-slate-800">
                                        ${client.price}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-sm text-slate-800">
                                        {client.place}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-sm text-slate-800">
                                        {client.egreso}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-sm text-slate-800">
                                        {client.status}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-sm text-slate-800">
                                        {client.payment}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-sm text-slate-800">
                                        {client.obvs ?? "-"}
                                    </p>
                                </td>
                            </tr>

                        )
                    })
                }
            </tbody>
            {/* <tfoot>
            <tr>
              <td colSpan={2} className="p-4 text-left font-bold text-slate-800 border-t border-slate-300">
                Total:
              </td>
              <td colSpan={2} className="p-4 font-bold text-slate-800 border-t border-slate-300">
                7
              </td>
              <td colSpan={2} className="p-4 font-semibold text-slate-800 border-t border-slate-300">
                $605.00
              </td>
            </tr>
          </tfoot> */}
        </table>
    )
}
