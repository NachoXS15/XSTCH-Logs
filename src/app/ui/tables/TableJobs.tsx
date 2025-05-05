'use client'
import Link from 'next/link'
import { jobsType } from "../../lib/definitions"
import { EyeIcon, EyeClosedIcon } from 'lucide-react'
import { useState } from 'react'
import { deleteJob } from '@/app/dashboard/jobs/actions'
import { InstagramIcon } from '../Icons'
export default function Table({ jobs }: { jobs: jobsType[] }) {

    const [showPrice, setShowPrice] = useState(false)
    const ActiveField = [
        { title: "Activo", style: "text-green-600 bg-green-200" },
        { title: "Por confirmar", style: "text-blue-500 bg-blue-200" },
        { title: "No Activo", style: "text-red-600 bg-red-300" },
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
                                Estado
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
                                Cuenta
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                            <p className="block text-sm font-normal leading-none text-slate-500">
                                Fecha de Cobro Estimada
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                            <p className="block text-sm font-normal leading-none text-slate-500">
                                Método de Pago
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
                        jobs.map((job, i) => {
                            const selectedActiveField = ActiveField.find(field => field.title === job.active)
                            const id = job

                            if(job.active == "Activo"){
                                totalEarned = totalEarned + job.price
                            }

                            totalLogs = totalLogs + 1
                            return (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            {job.client_name}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className={`block text-sm text-center rounded py-1 ${selectedActiveField?.style}`}>
                                            {job.active}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            ${showPrice ? job.price : "***"}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <a href={`https://instagram.com/${job.account}`} target='_blank' className="text-sm flex items-center gap-2 text-slate-800">
                                            <InstagramIcon color='black'/>
                                            <span className='hover:underline'>{job.account}</span>
                                        </a>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            {job.date}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            {job.pay_method}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            {job.obvs == "" ? "-" : job.obvs}
                                        </p>
                                    </td>
                                    <td className="border-b border-slate-200">
                                        <Link href={`/dashboard/jobs/${job.id}`} className="w-fit block text-center text-sm cursor-pointer hover:bg-purple-500 hover:text-purple-200 transition border border-purple-500 rounded px-2 py-1 text-purple-500">
                                            Editar
                                        </Link>
                                    </td>
                                    <td className="border-b border-slate-200">
                                        <button onClick={() => deleteJob(id.id)} className="block text-center text-sm cursor-pointer hover:bg-red-500 hover:text-red-200 border border-red-500 rounded px-2 py-1 transition text-red-500">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>

                            )
                        })
                    }
                </tbody>
                <tfoot>
                    <tr className='w-full border-t-2 border-slate-300'>
                        <td colSpan={2} className="p-4 text-left font-bold text-slate-800 ">
                            Total: {totalLogs}
                        </td>
                        <td colSpan={2} className="p-4 font-semibold text-slate-800 border-t border-slate-300">
                            ${totalEarned}
                        </td>
                    </tr>
                </tfoot>
            </table>
            {/* <div className="flex justify-between items-center px-4 py-3">
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
            </div> */}
        </>
    )
}
