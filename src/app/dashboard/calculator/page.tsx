'use client'

import { Services } from "@/app/utils/services";
import { GripVertical, X } from "lucide-react";
import { useState } from "react";
import { Service } from "@/app/lib/definitions";


export default function page() {

    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [draggedItem, setDraggedItem] = useState<Service | null>(null);
    const [isDomicilio, setIsDomicilio] = useState(false)
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, service: Service): void => {
        setDraggedItem(service);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        if (draggedItem && !selectedServices.find(s => s.name === draggedItem.name)) {
            setSelectedServices([...selectedServices, draggedItem]);
        }
        setDraggedItem(null);
    };

    const handleRemoveService = (serviceName: string): void => {
        setSelectedServices(selectedServices.filter(s => s.name !== serviceName));
    };

    const calculateTotal = (): number => {
        const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
        const valorDomicilio = isDomicilio ? 5000 : 0
        return servicesTotal + valorDomicilio
    };

    return (
        <section className='w-full z-40 xl:w-10/12 overflow-hidden px-5 py-10 flex items-center justify-start flex-col'>
            <div className="w-full flex flex-col py-5 md:flex-row justify-between items-center">
                <div className="text-left w-full border-b border-slate-200 mb-4 md:border-0 md:mb-0">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50">Calculadora de Costos</h3>
                    <p className="text-slate-500 mb-5">Presupuesto para técnico y lista de precios de todos los servicios</p>
                </div>
            </div>
            <section className="w-full flex flex-col md:flex-row gap-14">
                {/* <table className="text-left table-auto w-1/4 overflow-hidden">
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
                </table> */}
                <div className="w-full">
                    <p className="text-slate-500 mb-4">Arrastra los servicios solicitados para calcular el costo</p>
                    <div className="w-full flex flex-col md:flex-row gap-5">
                        {/* Lista de servicios arrastrables */}
                        <div className="flex flex-col gap-2 w-full md:w-1/2" id="options">
                            {Services.map((service, i) => (
                                <div
                                    key={i}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, service)}
                                    className="h-10 py-5 flex items-center gap-2 text-slate-500 dark:bg-slate-900 bg-slate-200 dark:hover:bg-transparent rounded-lg px-4 cursor-move dark:hover:bg-white hover:bg-slate-600 transition-colors"
                                >
                                    <span><GripVertical className="text-slate-500 dark:text-white" size={20} /></span>
                                    <span className="text-slate-500 hover:text-white dark:text-white text-sm">{service.name}</span>
                                    <span className="text-slate-700 hover:text-white dark:text-slate-300 text-sm ml-auto">${service.price}</span>
                                </div>
                            ))}
                        </div>

                        {/* Área de destino */}
                        <div
                            id="target"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 w-full md:w-1/2 min-h-64 rounded-lg p-4 transition-colors hover:border-slate-400"
                        >
                            {selectedServices.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-slate-400 text-center">
                                        Arrastra los servicios aquí<br />
                                        <span className="text-sm">para calcular el presupuesto</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Servicios seleccionados:</h5>
                                        <div>
                                            <input type="checkbox" id="checkDomicilio" onChange={() => setIsDomicilio(!isDomicilio)} />
                                            <label htmlFor="checkDomicilio" className="px-2 text-slate-700 dark:text-slate-200">Realizar en Domicilio</label>
                                        </div>
                                    </div>
                                    {selectedServices.map((service, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm"
                                        >
                                            <span className="text-slate-700 dark:text-slate-100 text-sm">{service.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-600 dark:text-slate-300 font-medium">${service.price}</span>
                                                <button
                                                    onClick={() => handleRemoveService(service.name)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    aria-label={`Eliminar ${service.name}`}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <span className="self-end dark:text-white text-lg mt-3">Total: <strong>${calculateTotal()}</strong></span>
        </section>
    )
}
