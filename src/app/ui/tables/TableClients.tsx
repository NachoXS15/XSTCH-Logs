'use client'
import Link from 'next/link'
import { clientType } from "../../lib/definitions"
import { EyeIcon, EyeClosedIcon } from 'lucide-react'
import { useState } from 'react'
import { deleteClient } from '@/app/dashboard/clients/actions'
export default function Table({ clients }: { clients: clientType[] }) {

    const [showPrice, setShowPrice] = useState(false)
    const StatusField = [
        { title: "Listo", style: "text-green-600 bg-green-200" },
        { title: "A cumplir", style: "text-blue-500 bg-blue-200" },
        { title: "A confirmar", style: "text-red-600 bg-red-200" },
    ]

    const PaymentField = [
        { title: "Pagado", style: "text-green-600 bg-green-200" },
        { title: "Señado", style: "text-orange-500 bg-orange-200" },
        { title: "Pendiente", style: "text-red-600 bg-red-200" },
    ]

    let totalEarned = 0;
    let totalLogs = 0;

    return (
        <>
            <table className="text-left table-auto min-w-max overflow-hidden w-full">
                <thead className="w-full border-b border-slate-300 bg-slate-50">
                    <tr className='w-full'>
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
                            <p className="text-sm font-normal flex items-center gap-2 leading-none text-slate-500">
                                Precio
                                <button onClick={() => setShowPrice(!showPrice)}>{showPrice ? <EyeIcon size={20} className='hover:scale-110 transition cursor-pointer' /> : <EyeClosedIcon size={20} className='hover:scale-110 transition cursor-pointer' />}</button>
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                            <p className="block text-sm font-normal leading-none text-slate-500">
                                Lugar
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                            <p className="block text-sm font-normal leading-none text-slate-500">
                                Egreso/Fecha
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
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        clients.map((client, i) => {
                            const selectedStatusField = StatusField.find(field => field.title === client.status)
                            const selectedPaymentField = PaymentField.find(field => field.title === client.payment)
                            const id = client.id

                            totalEarned = totalEarned + client.price
                            totalLogs = totalLogs + 1
                            return (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            {client.client_name}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm leading-6 text-slate-800 max-w-[400px] text-wrap">
                                            {client.service}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            ${showPrice ? client.price : "***"}
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
                                        <p className={`block text-sm rounded px-2 text-center py-1 ${selectedStatusField?.style}`}>
                                            {client.status}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className={`block text-sm px-2 rounded text-center py-1 ${selectedPaymentField?.style}`}>
                                            {client.payment}
                                        </p>
                                    </td>
                                    <td className="p-4 w-32 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            {client.obvs == "" ? "-" : client.obvs}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <Link href={`/dashboard/clients/${client.id}`} className="block text-center text-sm cursor-pointer hover:bg-purple-500 hover:text-purple-200 transition border border-purple-500 rounded px-2 py-1 text-purple-500">
                                            Editar
                                        </Link>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <button onClick={() => deleteClient(id)} className="block text-center text-sm cursor-pointer hover:bg-red-500 hover:text-red-200 border border-red-500 rounded px-2 py-1 transition text-red-500">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>

                            )
                        })
                    }
                </tbody>
                <tfoot>
                    <tr className=' w-full '>
                        <td colSpan={2} className="p-4 text-left font-bold text-slate-800border-t-2 border-slate-300">
                            Total: {totalLogs}
                        </td>
                        <td colSpan={2} className="p-4 font-semibold text-slate-800 border-t border-slate-300">
                            ${showPrice ? totalEarned: "***"}
                        </td>
                    </tr>
                </tfoot>
            </table>
            <div className="flex justify-between items-center px-4 py-3">
                <div className="text-sm text-slate-500">
                    Mostrando <b>1-5</b> de 45
                </div>
                <div className="flex space-x-1">
                    <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                        {`<`}
                    </button>
                    <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
                        1
                    </button>
                    <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                        2
                    </button>
                    <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                        3
                    </button>
                    <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                        {`>`}
                    </button>
                </div>
                <div></div>
            </div>
        </>
    )
}
