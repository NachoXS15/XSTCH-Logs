'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { expenseType } from '@/app/lib/definitions'
import { CATEGORY_COLORS } from './shared'

interface Props {
    expenses: expenseType[]
    fmt: (n: number) => string
}

export default function ExpenseCalendar({ expenses, fmt }: Props) {
    const [calendarDate, setCalendarDate] = useState(() => {
        const d = new Date()
        return { year: d.getFullYear(), month: d.getMonth() }
    })

    const calendarData = useMemo(() => {
        const { year, month } = calendarDate
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const firstJs = new Date(year, month, 1).getDay()
        const firstOffset = (firstJs + 6) % 7

        const activeExpenses = expenses.filter(e => e.active && e.pay_day && e.pay_day >= 1 && e.pay_day <= 31)
        const byDay: Record<number, expenseType[]> = {}
        for (const e of activeExpenses) {
            const d = Math.min(e.pay_day as number, daysInMonth)
            if (!byDay[d]) byDay[d] = []
            byDay[d].push(e)
        }

        const cells: Array<{ day: number | null; expenses: expenseType[]; total: number }> = []
        for (let i = 0; i < firstOffset; i++) cells.push({ day: null, expenses: [], total: 0 })
        for (let d = 1; d <= daysInMonth; d++) {
            const items = byDay[d] ?? []
            cells.push({ day: d, expenses: items, total: items.reduce((s, e) => s + e.amount, 0) })
        }
        while (cells.length % 7 !== 0) cells.push({ day: null, expenses: [], total: 0 })

        const monthTotal = activeExpenses.reduce((s, e) => s + e.amount, 0)
        const unscheduled = expenses.filter(e => e.active && (!e.pay_day || e.pay_day < 1 || e.pay_day > 31))
        const unscheduledTotal = unscheduled.reduce((s, e) => s + e.amount, 0)
        return { cells, monthTotal, unscheduled, unscheduledTotal, daysInMonth }
    }, [expenses, calendarDate])

    const monthLabel = useMemo(() => {
        const d = new Date(calendarDate.year, calendarDate.month, 1)
        return d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    }, [calendarDate])

    function shiftMonth(delta: number) {
        setCalendarDate(prev => {
            const d = new Date(prev.year, prev.month + delta, 1)
            return { year: d.getFullYear(), month: d.getMonth() }
        })
    }

    const today = new Date()
    const isCurrentMonth = today.getFullYear() === calendarDate.year && today.getMonth() === calendarDate.month

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => shiftMonth(-1)}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title="Mes anterior"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex flex-col">
                        <h4 className="font-medium text-slate-700 dark:text-slate-200 capitalize">{monthLabel}</h4>
                        {!isCurrentMonth && (
                            <button
                                onClick={() => {
                                    const d = new Date()
                                    setCalendarDate({ year: d.getFullYear(), month: d.getMonth() })
                                }}
                                className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-left transition-colors"
                            >
                                Ir a hoy
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => shiftMonth(1)}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title="Mes siguiente"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total del mes</p>
                    <p className="text-lg font-bold text-red-500 dark:text-red-400 tabular-nums">{fmt(calendarData.monthTotal)}</p>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                    <div key={d} className="py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {calendarData.cells.map((cell, i) => {
                    const isToday = isCurrentMonth && cell.day === today.getDate()
                    return (
                        <div
                            key={i}
                            className={`min-h-[70px] sm:min-h-[100px] rounded-md p-1.5 flex flex-col gap-1 text-left border transition-colors ${
                                cell.day === null
                                    ? 'border-transparent'
                                    : isToday
                                        ? 'border-slate-800 dark:border-slate-200 bg-slate-50 dark:bg-slate-800'
                                        : cell.expenses.length > 0
                                            ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50'
                            }`}
                        >
                            {cell.day !== null && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-semibold tabular-nums ${
                                            isToday ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
                                        }`}>
                                            {cell.day}
                                        </span>
                                        {cell.total > 0 && (
                                            <span className="text-[10px] sm:text-xs font-semibold text-red-500 dark:text-red-400 tabular-nums hidden sm:inline">
                                                {fmt(cell.total)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-0.5 overflow-hidden">
                                        {cell.expenses.slice(0, 3).map(e => (
                                            <div
                                                key={e.id}
                                                className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded truncate ${CATEGORY_COLORS[e.category] ?? CATEGORY_COLORS['otros']}`}
                                                title={`${e.name} · ${fmt(e.amount)}`}
                                            >
                                                <span className="hidden sm:inline">{e.name}</span>
                                                <span className="sm:hidden">•</span>
                                            </div>
                                        ))}
                                        {cell.expenses.length > 3 && (
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1">+{cell.expenses.length - 3}</span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>

            {calendarData.monthTotal > 0 && (
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Detalle del mes</h5>
                    <div className="flex flex-col gap-2">
                        {calendarData.cells
                            .filter(c => c.day !== null && c.expenses.length > 0)
                            .map(c => (
                                <div key={c.day} className="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                    <div className="shrink-0 w-14 text-center">
                                        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">Día</p>
                                        <p className="text-lg font-bold text-slate-700 dark:text-slate-200 tabular-nums">{c.day}</p>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                                        {c.expenses.map(e => (
                                            <div key={e.id} className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize shrink-0 ${CATEGORY_COLORS[e.category] ?? CATEGORY_COLORS['otros']}`}>
                                                        {e.category}
                                                    </span>
                                                    <span className="text-sm text-slate-700 dark:text-slate-200 truncate">{e.name}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 tabular-nums shrink-0">
                                                    {fmt(e.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {calendarData.unscheduled.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-slate-700 dark:text-slate-200">Sin fecha de pago</h5>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 tabular-nums">{fmt(calendarData.unscheduledTotal)}</span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                        Estos gastos activos no tienen día de pago asignado y no aparecen en el calendario.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {calendarData.unscheduled.map(e => (
                            <span key={e.id} className="text-xs px-2 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                {e.name} · {fmt(e.amount)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {calendarData.monthTotal === 0 && calendarData.unscheduled.length === 0 && (
                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                    No hay gastos activos con fecha de pago para este mes
                </div>
            )}
        </div>
    )
}
