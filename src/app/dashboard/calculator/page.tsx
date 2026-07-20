'use client'

import { Services } from "@/app/utils/services";
import { GripVertical, X, Minus, Plus, FileDown } from "lucide-react";
import { useState } from "react";
import { Service } from "@/app/lib/definitions";

export default function page() {

    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
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
            setQuantities(prev => ({ ...prev, [draggedItem.name]: 1 }));
        }
        setDraggedItem(null);
    };

    const handleRemoveService = (serviceName: string): void => {
        setSelectedServices(selectedServices.filter(s => s.name !== serviceName));
        setQuantities(prev => {
            const next = { ...prev };
            delete next[serviceName];
            return next;
        });
    };

    const handleQuantityChange = (serviceName: string, delta: number): void => {
        setQuantities(prev => {
            const current = prev[serviceName] ?? 1;
            const next = Math.max(1, current + delta);
            return { ...prev, [serviceName]: next };
        });
    };

    const calculateTotal = (): number => {
        const servicesTotal = selectedServices.reduce(
            (sum, service) => sum + service.price * (quantities[service.name] ?? 1),
            0
        );
        return servicesTotal + (isDomicilio ? 5000 : 0);
    };

    const exportToPDF = async (): Promise<void> => {
        const { jsPDF } = await import('jspdf')
        const doc = new jsPDF()

        const pageWidth = doc.internal.pageSize.getWidth()
        const today = new Date().toLocaleDateString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        })

        // Header
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('XSTCH - Presupuesto', pageWidth / 2, 20, { align: 'center' })

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(120)
        doc.text(`Fecha: ${today}`, pageWidth / 2, 28, { align: 'center' })
        doc.setTextColor(0)

        // Table header
        const startY = 40
        const colX = { servicio: 14, cant: 120, precio: 140, subtotal: 165 }

        doc.setFillColor(30, 41, 59)
        doc.rect(14, startY - 6, pageWidth - 28, 10, 'F')
        doc.setTextColor(255)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('Servicio', colX.servicio + 2, startY)
        doc.text('Cant.', colX.cant, startY)
        doc.text('P. Unit.', colX.precio, startY)
        doc.text('Subtotal', colX.subtotal, startY)
        doc.setTextColor(0)

        // Rows
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        let y = startY + 10

        selectedServices.forEach((service, i) => {
            const qty = quantities[service.name] ?? 1
            const subtotal = service.price * qty

            if (i % 2 === 0) {
                doc.setFillColor(241, 245, 249)
                doc.rect(14, y - 5, pageWidth - 28, 9, 'F')
            }

            const nameLines = doc.splitTextToSize(service.name, 100)
            doc.text(nameLines, colX.servicio + 2, y)
            doc.text(String(qty), colX.cant + 4, y)
            doc.text(`$${service.price.toLocaleString('es-AR')}`, colX.precio, y)
            doc.text(`$${subtotal.toLocaleString('es-AR')}`, colX.subtotal, y)

            y += nameLines.length > 1 ? nameLines.length * 6 + 2 : 10
        })

        // Domicilio row
        if (isDomicilio) {
            doc.setFillColor(254, 243, 199)
            doc.rect(14, y - 5, pageWidth - 28, 9, 'F')
            doc.text('Visita a domicilio', colX.servicio + 2, y)
            doc.text('1', colX.cant + 4, y)
            doc.text('$5.000', colX.precio, y)
            doc.text('$5.000', colX.subtotal, y)
            y += 10
        }

        // Total
        y += 4
        doc.setDrawColor(30, 41, 59)
        doc.line(14, y - 2, pageWidth - 14, y - 2)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.text('TOTAL', colX.precio - 20, y + 6)
        doc.text(`$${calculateTotal().toLocaleString('es-AR')}`, colX.subtotal, y + 6)

        // Footer
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text('Presupuesto generado por XSTCH Logs', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })

        doc.save(`presupuesto-xstch-${today.replace(/\//g, '-')}.pdf`)
    }

    return (
        <section className='w-full z-40 xl:w-10/12 overflow-hidden px-5 py-10 flex items-center justify-start flex-col'>
            <div className="w-full flex flex-col py-5 md:flex-row justify-between items-center">
                <div className="text-left w-full border-b border-slate-200 mb-4 md:border-0 md:mb-0">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50">Calculadora de Costos</h3>
                    <p className="text-slate-500 mb-5">Presupuesto para técnico y lista de precios de todos los servicios</p>
                </div>
            </div>
            <section className="w-full flex flex-col md:flex-row gap-14">
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
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Servicios seleccionados:</h5>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="checkDomicilio" onChange={() => setIsDomicilio(!isDomicilio)} />
                                            <label htmlFor="checkDomicilio" className="text-slate-700 dark:text-slate-200 text-sm">Domicilio</label>
                                        </div>
                                    </div>
                                    {selectedServices.map((service, i) => {
                                        const qty = quantities[service.name] ?? 1
                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm gap-2"
                                            >
                                                <span className="text-slate-700 dark:text-slate-100 text-sm flex-1 min-w-0 truncate">{service.name}</span>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => handleQuantityChange(service.name, -1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-100 transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-6 text-center text-sm font-medium text-slate-700 dark:text-slate-100">{qty}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(service.name, 1)}
                                                        className="w-6 h-6 flex items-center justify-center rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-100 transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <span className="text-slate-600 dark:text-slate-300 font-medium text-sm shrink-0">
                                                    ${(service.price * qty).toLocaleString('es-AR')}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveService(service.name)}
                                                    className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                                                    aria-label={`Eliminar ${service.name}`}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <div className="self-end flex items-center gap-4 mt-3">
                <span className="dark:text-white text-lg">Total: <strong>${calculateTotal().toLocaleString('es-AR')}</strong></span>
                {selectedServices.length > 0 && (
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors text-sm font-medium"
                    >
                        <FileDown size={16} />
                        Exportar PDF
                    </button>
                )}
            </div>
        </section>
    )
}
