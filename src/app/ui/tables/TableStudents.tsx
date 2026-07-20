'use client'
import Link from 'next/link'
import { studentType } from "../../lib/definitions"
import { EyeIcon, EyeClosedIcon } from 'lucide-react'
import { useState } from 'react'
import { deleteStudent } from '@/app/dashboard/students/actions'

export default function Table({ students }: { students: studentType[] }) {

    const [showPrice, setShowPrice] = useState(false)

    const ConditionField = [
        { title: "Promoción", style: "text-green-600 bg-green-200 dark:bg-green-900/40 dark:text-green-300" },
        { title: "Regular",   style: "text-blue-500 bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300" },
        { title: "Libre",     style: "text-red-600 bg-red-200 dark:bg-red-900/40 dark:text-red-300" },
    ]

    const PaymentField = [
        { title: "Pagado",     style: "text-green-600 bg-green-200 dark:bg-green-900/40 dark:text-green-300" },
        { title: "Señado",     style: "text-orange-500 bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300" },
        { title: "Pendiente",  style: "text-pink-600 bg-pink-200 dark:bg-pink-900/40 dark:text-pink-300" },
        { title: "No Cobrado", style: "text-red-600 bg-red-200 dark:bg-red-900/40 dark:text-red-300" },
    ]

    const GradeField = [
        { title: "Aprobado",  style: "text-green-600 bg-green-200 dark:bg-green-900/40 dark:text-green-300" },
        { title: "Ausente",   style: "text-orange-500 bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300" },
        { title: "Reprobado", style: "text-red-600 bg-red-200 dark:bg-red-900/40 dark:text-red-300" },
        { title: "Pendiente", style: "text-blue-500 bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300" },
        { title: "Abandonó",  style: "text-pink-600 bg-pink-200 dark:bg-pink-900/40 dark:text-pink-300" },
    ]

    const MateriasField = [
        { title: "Fundamentos de Programación", style: "text-green-600 bg-green-200 dark:bg-green-900/40 dark:text-green-300" },
        { title: "Programación I",              style: "text-yellow-700 bg-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300" },
        { title: "Programación II",             style: "text-purple-600 bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300" },
        { title: "Inglés",                      style: "text-blue-600 bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300" },
        { title: "Seminario de Actualización I",style: "text-pink-600 bg-pink-200 dark:bg-pink-900/40 dark:text-pink-300" },
    ]

    let totalEarned = 0
    let totalLogs = 0

    return (
        <>
            <table className="text-left table-auto min-w-max overflow-hidden w-full">
                <thead className="w-full border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <tr className='w-full'>
                        {[
                            'Estudiante', 'Materia', 'Precio', 'Tipo',
                            'Fecha/Mesa', 'Estado', 'Nota', 'Condicion', 'Observaciones', '', ''
                        ].map((label, i) => (
                            <th key={i} className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                {label === 'Precio' ? (
                                    <p className="text-sm font-normal flex items-center gap-2 leading-none text-slate-500 dark:text-slate-400">
                                        Precio
                                        <button onClick={() => setShowPrice(!showPrice)}>
                                            {showPrice
                                                ? <EyeIcon size={20} className='hover:scale-110 transition cursor-pointer' />
                                                : <EyeClosedIcon size={20} className='hover:scale-110 transition cursor-pointer' />
                                            }
                                        </button>
                                    </p>
                                ) : (
                                    <p className="block text-sm font-normal leading-none text-slate-500 dark:text-slate-400">{label}</p>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, i) => {
                        const selectedConditionField = ConditionField.find(f => f.title === student.condition)
                        const selectedPaymentField   = PaymentField.find(f => f.title === student.payment)
                        const selectedGradeField     = GradeField.find(f => f.title === student.grade)
                        const selectedMateriaField   = MateriasField.find(f => f.title === student.materia)

                        totalEarned += student.price
                        totalLogs   += 1

                        return (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm text-slate-800 dark:text-slate-200">{student.student_name}</p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className={`block w-fit text-sm text-start px-3 rounded py-1 ${selectedMateriaField?.style}`}>
                                        {student.materia}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm text-slate-800 dark:text-slate-200">
                                        ${showPrice ? student.price : '***'}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm text-slate-800 dark:text-slate-200">{student.type}</p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm text-slate-800 dark:text-slate-200">{student.date}</p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className={`block text-sm rounded px-2 text-center py-1 ${selectedPaymentField?.style}`}>
                                        {student.payment}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className={`block text-sm px-2 rounded text-center py-1 ${selectedGradeField?.style}`}>
                                        {student.grade}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className={`block text-sm px-2 rounded text-center py-1 ${selectedConditionField?.style}`}>
                                        {student.condition}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="block text-sm px-2 rounded text-start py-1 text-slate-800 dark:text-slate-200">
                                        {student.obvs ? student.obvs : '-'}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <Link href={`/dashboard/students/${student.id}`} className="block text-center text-sm cursor-pointer hover:bg-purple-500 hover:text-purple-200 transition border border-purple-500 rounded px-2 py-1 text-purple-500">
                                        Editar
                                    </Link>
                                </td>
                                <td className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <button onClick={() => deleteStudent(student.id)} className="block text-center text-sm cursor-pointer hover:bg-red-500 hover:text-red-200 border border-red-500 rounded px-2 py-1 transition text-red-500">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr className="w-full border-t-2 border-slate-300 dark:border-slate-600">
                        <td colSpan={2} className="p-4 text-left font-bold text-slate-800 dark:text-slate-200">
                            Total: {totalLogs}
                        </td>
                        <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 border-t border-slate-300 dark:border-slate-600">
                            ${showPrice ? totalEarned.toLocaleString('es-AR') : '***'}
                            <button onClick={() => setShowPrice(!showPrice)} className="ml-2">
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
