'use client'
import Link from 'next/link'
import { jobsType } from "../../lib/definitions"
import { EyeIcon, EyeClosedIcon, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { deleteJob } from '@/app/dashboard/jobs/actions'
import { InstagramIcon } from '../Icons'

export default function Table({ jobs }: { jobs: jobsType[] }) {

    const [showPrice, setShowPrice] = useState(false)
    const ActiveField = [
        { title: "Activo", style: "text-green-600 bg-green-200 dark:bg-green-900/40 dark:text-green-300" },
        { title: "Por confirmar", style: "text-blue-500 bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300" },
        { title: "No Activo", style: "text-red-600 bg-red-300 dark:bg-red-900/40 dark:text-red-300 px-2" },
    ]

    let totalEarned = 0;
    let totalLogs = 0;

    return (
        <>
            <table className="text-left table-auto min-w-max overflow-hidden w-full">
                <thead className="w-full border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <tr className='w-full'>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-400">
                                Cliente
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-400">
                                Estado
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <p className="text-sm font-normal flex items-center gap-2 leading-none text-slate-500 dark:text-slate-400">
                                Precio
                                <button onClick={() => setShowPrice(!showPrice)}>
                                    {showPrice
                                        ? <EyeIcon size={20} className='hover:scale-110 transition cursor-pointer' />
                                        : <EyeClosedIcon size={20} className='hover:scale-110 transition cursor-pointer' />
                                    }
                                </button>
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-400">
                                Cuenta
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-400">
                                Fecha de Cobro Estimada
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-400">
                                Compañero/a
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-400">
                                Método de Pago
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                            <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-400">
                                Observaciones
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"></th>
                        <th className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"></th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job, i) => {
                        const selectedActiveField = ActiveField.find(field => field.title === job.active)

                        if (job.active == "Activo") totalEarned = totalEarned + job.price
                        totalLogs = totalLogs + 1

                        return (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm text-slate-800 dark:text-slate-200">
                                        {job.client_name}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className={`block text-sm text-center rounded py-1 ${selectedActiveField?.style}`}>
                                        {job.active}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm text-slate-800 dark:text-slate-200">
                                        ${showPrice ? job.price : "***"}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <a href={`https://instagram.com/${job.account}`} target='_blank' className="text-sm flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                        <InstagramIcon />
                                        <span className='hover:underline'>{job.account}</span>
                                    </a>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm text-slate-800 dark:text-slate-200">
                                        {job.date}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                        <UserIcon size={16} />
                                        {job.partner_name == "" ? "Solo" : job.partner_name}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm text-slate-800 dark:text-slate-200">
                                        {job.pay_method}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm text-slate-800 dark:text-slate-200">
                                        {job.obvs == "" ? "-" : job.obvs}
                                    </p>
                                </td>
                                <td className="border-b border-slate-200 dark:border-slate-700 pr-5">
                                    <Link href={`/dashboard/jobs/${job.id}`} className="w-fit block text-center text-sm cursor-pointer hover:bg-purple-500 hover:text-purple-200 transition border border-purple-500 rounded px-2 py-1 text-purple-500">
                                        Editar
                                    </Link>
                                </td>
                                <td className="border-b border-slate-200 dark:border-slate-700 pr-5">
                                    <button onClick={() => deleteJob(job.id)} className="block text-center text-sm cursor-pointer hover:bg-red-500 hover:text-red-200 border border-red-500 rounded px-2 py-1 transition text-red-500">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr className='w-full border-t-2 border-slate-300 dark:border-slate-600'>
                        <td colSpan={2} className="p-4 text-left font-bold text-slate-800 dark:text-slate-200">
                            Total: {totalLogs}
                        </td>
                        <td colSpan={2} className="p-4 font-semibold text-slate-800 dark:text-slate-200 border-t border-slate-300 dark:border-slate-600">
                            ${showPrice ? totalEarned : "***"}
                            <button onClick={() => setShowPrice(!showPrice)}>
                                {showPrice
                                    ? <EyeIcon size={20} className='hover:scale-110 transition cursor-pointer' />
                                    : <EyeClosedIcon size={20} className='hover:scale-110 transition cursor-pointer' />
                                }
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}
