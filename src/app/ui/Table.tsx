import {clientType} from "../lib/definitions"


export default function Table({ clients }: { clients: clientType[] }) {

    const StatusField = [
        {title: "Listo", style: "text-green-600 bg-green-200"},
        {title: "A cumplir", style: "text-orange-500 bg-orange-200"},
        {title: "A confirmar", style: "text-red-600 bg-red-200"},
    ]

    const PaymentField = [
        {title: "Pagado", style: "text-green-600 bg-green-200"},
        {title: "Señado", style: "text-orange-500 bg-orange-200"},
        {title: "Pendiente", style: "text-red-600 bg-red-200"},
    ]


    return (
        <table className="w-full text-left table-auto min-w-max">
            <thead className="border-b border-slate-300 bg-slate-50">
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
                        const selectedStatusField = StatusField.find(field => field.title === client.status)
                        const selectedPaymentField = PaymentField.find(field => field.title === client.payment)

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
                                    <p className={`block text-sm rounded text-center py-1 ${selectedStatusField?.style}`}>
                                        {client.status}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className={`block text-sm px-2 rounded text-center py-1 ${selectedPaymentField?.style}`}>
                                        {client.payment}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-sm text-slate-800">
                                        {client.obvs ?? "-"}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-center text-sm cursor-pointer hover:bg-purple-500 hover:text-purple-200 transition border border-purple-500 rounded px-2 py-1 text-purple-500">
                                        Editar
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="block text-center text-sm cursor-pointer hover:bg-red-500 hover:text-red-200 border border-red-500 rounded px-2 py-1 transition text-red-500">
                                        Eliminar
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
