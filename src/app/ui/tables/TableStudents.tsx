'use client'
import Link from 'next/link'
import { studentType } from "../../lib/definitions"
import {EyeIcon, EyeClosedIcon} from 'lucide-react'
import { useState } from 'react'

export default function Table({ students }: { students: studentType[] }) {

    const [showPrice, setShowPrice] = useState(false)
    const ConditionField = [
        { title: "Promoción", style: "text-green-600 bg-green-200" },
        { title: "Regular", style: "text-blue-500 bg-blue-200" },
        { title: "Libre", style: "text-red-600 bg-red-200" },
    ]

    const PaymentField = [
        { title: "Pagado", style: "text-green-600 bg-green-200" },
        { title: "Señado", style: "text-orange-500 bg-orange-200" },
        { title: "Pendiente", style: "text-pink-600 bg-pink-200" },
        { title: "No Cobrado", style: "text-red-600 bg-red-200" },
    ]

    const GradeField = [
        { title: "Aprobado", style: "text-green-600 bg-green-200" },
        { title: "Ausente", style: "text-orange-500 bg-orange-200" },
        { title: "Reprobado", style: "text-red-600 bg-red-200" },
        { title: "Pendiente", style: "text-blue-500 bg-blue-200" },
        { title: "Abandonó", style: "text-pink-600 bg-pink-200" },
    ]

    const MateriasField = [
        { title: "Fundamentos de Programación", style: "text-green-600 bg-green-200" },
        { title: "Programación I", style: "text-yellow-700 bg-yellow-200" },
        { title: "Programación II", style: "text-purple-600 bg-purple-200" },
        { title: "Inglés", style: "text-blue-600 bg-blue-200" },
        { title: "Seminario de Actualización I", style: "text-pink-600 bg-pink-200" },
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
                                Estudiante
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                            <p className="block text-sm font-normal leading-none text-slate-500">
                                Materia
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
                                Tipo
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                            <p className="block text-sm font-normal leading-none text-slate-500">
                                Fecha/Mesa
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                            <p className="block text-sm font-normal leading-none text-slate-500">
                                Estado
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                            <p className="block text-sm font-normal leading-none text-slate-500">
                                Nota
                            </p>
                        </th>
                        <th className="p-4 border-b border-slate-300 bg-slate-50">
                            <p className="block text-sm font-normal leading-none text-slate-500">
                                Condicion
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
                        students.map((student, i) => {
                            const selectedConditionField = ConditionField.find(field => field.title === student.condition)
                            const selectedPaymentField = PaymentField.find(field => field.title === student.payment)
                            const selectedGradeField = GradeField.find(field => field.title === student.grade)
                            const selectedMateriaField = MateriasField.find(field => field.title === student.materia)
                            
                            totalEarned = totalEarned + student.price
                            totalLogs = totalLogs + 1
                            return (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            {student.student_name}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className={`block w-fit text-sm text-start px-3 rounded py-1 ${selectedMateriaField?.style}`}>
                                            {student.materia}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            ${showPrice ? student.price : "***"}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            {student.type}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="block text-sm text-slate-800">
                                            {student.date}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className={`block text-sm rounded px-2 text-center py-1 ${selectedPaymentField?.style}`}>
                                            {student.payment}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className={`block text-sm px-2 rounded text-center py-1 ${selectedGradeField?.style}`}>
                                            {student.grade}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className={`block text-sm px-2 rounded text-center py-1 ${selectedConditionField?.style}`}>
                                            {student.condition}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <Link href={`/dashboard/students/${student.id}`} className="block text-center text-sm cursor-pointer hover:bg-purple-500 hover:text-purple-200 transition border border-purple-500 rounded px-2 py-1 text-purple-500">
                                            Editar
                                        </Link>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <button className="block text-center text-sm cursor-pointer hover:bg-red-500 hover:text-red-200 border border-red-500 rounded px-2 py-1 transition text-red-500">
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
                        <td className="p-4 font-semibold text-slate-800 border-t border-slate-300">
                            ${totalEarned}
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
