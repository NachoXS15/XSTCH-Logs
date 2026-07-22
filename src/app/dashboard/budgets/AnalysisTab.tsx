'use client'

import { useMemo, useCallback } from 'react'
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { jobsType, expenseType, savingsProjectType } from '@/app/lib/definitions'
import { usePriceVisibility } from './PriceVisibilityContext'

const CATEGORY_HEX: Record<string, string> = {
    alquiler:       '#3b82f6',
    servicios:      '#a855f7',
    comida:         '#22c55e',
    transporte:     '#f97316',
    salud:          '#ef4444',
    educacion:      '#eab308',
    entretenimiento:'#ec4899',
    otros:          '#64748b',
}

interface Props {
    jobs:     jobsType[]
    expenses: expenseType[]
    savings:  savingsProjectType[]
}

export default function AnalysisTab({ jobs, expenses, savings }: Props) {
    const { showPrices } = usePriceVisibility()
    const fmt = (n: number) => showPrices ? '$' + n.toLocaleString('es-AR') : '$***'

    const ChartTooltip = useCallback(({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
        if (!active || !payload?.length) return null
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-lg text-sm">
                <p className="font-medium text-slate-700 dark:text-slate-200 capitalize">{payload[0].name}</p>
                <p className="text-slate-500 dark:text-slate-400">{showPrices ? '$' + payload[0].value?.toLocaleString('es-AR') : '$***'}</p>
            </div>
        )
    }, [showPrices])
    const activeJobs     = jobs.filter(j => j.active === 'Activo')
    const activeExpenses = expenses.filter(e => e.active)

    const totalIncome   = activeJobs.reduce((s, j) => s + j.price, 0)
    const totalExpenses = activeExpenses.reduce((s, e) => s + e.amount, 0)
    const balance       = totalIncome - totalExpenses
    const totalSaved    = savings.reduce((s, p) => s + p.current_amount, 0)
    const expenseRatio  = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0

    const categoryData = useMemo(() => {
        const map: Record<string, number> = {}
        activeExpenses.forEach(e => { map[e.category] = (map[e.category] ?? 0) + e.amount })
        return Object.entries(map)
            .map(([name, amount]) => ({ name, amount, color: CATEGORY_HEX[name] ?? '#64748b' }))
            .sort((a, b) => b.amount - a.amount)
    }, [activeExpenses])

    const donutData = [
        { name: 'Gastos',     value: totalExpenses,       color: '#ef4444' },
        { name: 'Disponible', value: Math.max(balance, 0), color: '#22c55e' },
    ]

    const ratioColor =
        expenseRatio > 80 ? 'text-red-600 dark:text-red-400' :
        expenseRatio > 50 ? 'text-yellow-600 dark:text-yellow-400' :
        'text-green-600 dark:text-green-400'

    const ratioBg =
        expenseRatio > 80 ? 'bg-red-50 dark:bg-red-900/20' :
        expenseRatio > 50 ? 'bg-yellow-50 dark:bg-yellow-900/20' :
        'bg-green-50 dark:bg-green-900/20'

    return (
        <div className="flex flex-col gap-6">

            {/* ── KPI cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ingreso mensual</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{fmt(totalIncome)}</p>
                    <p className="text-xs text-slate-400 mt-1">{activeJobs.length} trabajo{activeJobs.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Gastos fijos</p>
                    <p className="text-xl font-bold text-red-500 dark:text-red-400">{fmt(totalExpenses)}</p>
                    <p className="text-xs text-slate-400 mt-1">{activeExpenses.length} activos</p>
                </div>
                <div className={`rounded-lg p-4 ${balance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Disponible</p>
                    <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {fmt(balance)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">después de gastos</p>
                </div>
                <div className={`rounded-lg p-4 ${ratioBg}`}>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">% comprometido</p>
                    <p className={`text-xl font-bold ${ratioColor}`}>{expenseRatio.toFixed(1)}%</p>
                    <p className="text-xs text-slate-400 mt-1">del ingreso total</p>
                </div>
            </div>

            {/* ── gauge bar ── */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Ingreso comprometido</span>
                    <span className={`text-sm font-semibold ${ratioColor}`}>{expenseRatio.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${
                            expenseRatio > 80 ? 'bg-red-500' : expenseRatio > 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(expenseRatio, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-slate-400">0%</span>
                    <span className="text-xs text-slate-400">50%</span>
                    <span className="text-xs text-slate-400">100%</span>
                </div>
            </div>

            {/* ── charts ── */}
            {totalIncome > 0 || categoryData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Donut */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4">
                        <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Distribución del ingreso</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Gastos vs disponible</p>
                        {totalIncome === 0 ? (
                            <div className="flex items-center justify-center h-52 text-slate-400 dark:text-slate-500 text-sm">Sin ingresos registrados</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                                        {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                    <Legend
                                        formatter={(value) => (
                                            <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Horizontal bar chart by category */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4">
                        <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Gastos por categoría</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Solo gastos activos</p>
                        {categoryData.length === 0 ? (
                            <div className="flex items-center justify-center h-52 text-slate-400 dark:text-slate-500 text-sm">Sin gastos activos</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={Math.max(categoryData.length * 38 + 20, 220)}>
                                <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                                    <CartesianGrid horizontal={false} stroke="#334155" strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis
                                        type="number"
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                        tickFormatter={v => showPrices ? (v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`) : '***'}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        width={95}
                                        tickFormatter={v => v.charAt(0).toUpperCase() + v.slice(1)}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                                        {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            ) : null}

            {/* ── Category ranking ── */}
            {categoryData.length > 0 && (
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4">Ranking de categorías</h4>
                    <div className="flex flex-col gap-4">
                        {categoryData.map((cat, i) => {
                            const pctOfExpenses = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0
                            const pctOfIncome   = totalIncome   > 0 ? (cat.amount / totalIncome)   * 100 : 0
                            return (
                                <div key={cat.name}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400 dark:text-slate-500 w-4">{i + 1}.</span>
                                            <span
                                                className="text-sm font-medium capitalize"
                                                style={{ color: cat.color }}
                                            >
                                                {cat.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-400 dark:text-slate-500">{pctOfIncome.toFixed(1)}% del ingreso</span>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 min-w-[80px] text-right">
                                                {fmt(cat.amount)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${pctOfExpenses}%`, backgroundColor: cat.color }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{pctOfExpenses.toFixed(1)}% del total de gastos</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── Savings summary ── */}
            {savings.length > 0 && (
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4">
                    <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4">Proyectos de ahorro</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {savings.map(p => {
                            const pct = p.goal_amount > 0 ? Math.min((p.current_amount / p.goal_amount) * 100, 100) : 0
                            return (
                                <div key={p.id} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{p.name}</span>
                                        <span className="text-xs text-slate-400 shrink-0 ml-2">{pct.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-green-500' : 'bg-slate-800 dark:bg-slate-300'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        {fmt(p.current_amount)} / {fmt(p.goal_amount)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Total ahorrado</span>
                        <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{fmt(totalSaved)}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
