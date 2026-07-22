'use client'

import { useMemo, useState, useCallback } from 'react'
import { savingsProjectType, projectContributionType, projectExpenseType, jobsType } from '@/app/lib/definitions'
import {
    updateSavingsAmount, updateProject,
    addProjectContribution, deleteProjectContribution,
    addProjectExpense, deleteProjectExpense,
} from '@/app/lib/data-client'
import { ArrowLeft, Plus, Trash2, Pencil, X } from 'lucide-react'
import Link from 'next/link'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { usePriceVisibility } from '../../PriceVisibilityContext'

const inputClass = 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-slate-400'
const btnPrimary = 'text-sm bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50'
const btnGhost = 'text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-2 transition'

interface Props {
    project:          savingsProjectType
    contributions:    projectContributionType[]
    projectExpenses:  projectExpenseType[]
    jobs:             jobsType[]
}

export default function ProjectClient({ project: init, contributions: initContributions, projectExpenses: initExpenses, jobs }: Props) {
    const { showPrices } = usePriceVisibility()
    const fmt = (n: number) => showPrices ? '$' + n.toLocaleString('es-AR') : '$***'

    // ── Project state ──
    const [project, setProject]           = useState(init)
    const [contributions, setContributions] = useState(initContributions ?? [])
    const [expenses, setExpenses]         = useState(initExpenses ?? [])

    // ── Edit project ──
    const [editing, setEditing]           = useState(false)
    const [editName, setEditName]         = useState(init.name)
    const [editGoal, setEditGoal]         = useState(String(init.goal_amount))
    const [editDesc, setEditDesc]         = useState(init.description ?? '')
    const [editDeadline, setEditDeadline] = useState(init.deadline ?? '')
    const [editLoading, setEditLoading]   = useState(false)

    // ── Add contribution ──
    const [showAddContrib, setShowAddContrib]   = useState(false)
    const [contribAmount, setContribAmount]     = useState('')
    const [contribNote, setContribNote]         = useState('')
    const [contribLoading, setContribLoading]   = useState(false)

    // ── Add project expense ──
    const [showAddExpense, setShowAddExpense]   = useState(false)
    const [expenseName, setExpenseName]         = useState('')
    const [expenseAmount, setExpenseAmount]     = useState('')
    const [expenseNote, setExpenseNote]         = useState('')
    const [expenseLoading, setExpenseLoading]   = useState(false)

    // ── Derived numbers ──
    const totalContributed = contributions.reduce((s, c) => s + c.amount, 0)
    const totalSpent       = expenses.reduce((s, e) => s + e.amount, 0)
    const net              = project.current_amount   // kept in sync
    const remaining        = Math.max(project.goal_amount - net, 0)
    const pct              = project.goal_amount > 0 ? Math.min((net / project.goal_amount) * 100, 100) : 0

    const monthsToDeadline = useMemo(() => {
        if (!project.deadline) return null
        const d = new Date(project.deadline + 'T00:00:00'), now = new Date()
        return Math.max((d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth()), 0)
    }, [project.deadline])

    const monthlyNeeded = monthsToDeadline && monthsToDeadline > 0 ? remaining / monthsToDeadline : null

    // ── Chart data ──
    const donutData = [
        { name: 'Neto ahorrado', value: Math.max(net, 0),         color: '#22c55e' },
        { name: 'Gastado',       value: totalSpent,                color: '#ef4444' },
        { name: 'Restante',      value: remaining,                 color: '#cbd5e1' },
    ].filter(d => d.value > 0)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ChartTooltip = useCallback(({ active, payload }: any) => {
        if (!active || !payload?.length) return null
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-lg text-sm">
                <p className="font-medium text-slate-700 dark:text-slate-200">{payload[0].name}</p>
                <p className="text-slate-500 dark:text-slate-400">{showPrices ? '$' + payload[0].value?.toLocaleString('es-AR') : '$***'}</p>
            </div>
        )
    }, [showPrices])

    // ── Handlers ──
    async function handleSaveProject() {
        if (!editName || !editGoal) return
        setEditLoading(true)
        try {
            await updateProject(project.id!, {
                name: editName,
                goal_amount: Number(editGoal),
                description: editDesc || undefined,
                deadline: editDeadline || null,
            })
            setProject(p => ({ ...p, name: editName, goal_amount: Number(editGoal), description: editDesc, deadline: editDeadline || undefined }))
            setEditing(false)
        } catch { /* logged */ }
        setEditLoading(false)
    }

    async function handleAddContribution() {
        if (!contribAmount || !project.id) return
        setContribLoading(true)
        const newCurrent = net + Number(contribAmount)
        try {
            const data = await addProjectContribution(project.id, Number(contribAmount), contribNote, newCurrent)
            if (data) setContributions(prev => [data[0] as projectContributionType, ...prev])
            setProject(p => ({ ...p, current_amount: newCurrent }))
            setContribAmount(''); setContribNote('')
            setShowAddContrib(false)
        } catch { /* logged */ }
        setContribLoading(false)
    }

    async function handleDeleteContribution(c: projectContributionType) {
        const newCurrent = net - c.amount
        try {
            await deleteProjectContribution(c.id!, project.id!, newCurrent)
            setContributions(prev => prev.filter(x => x.id !== c.id))
            setProject(p => ({ ...p, current_amount: newCurrent }))
        } catch { /* logged */ }
    }

    async function handleAddExpense() {
        if (!expenseName || !expenseAmount || !project.id) return
        setExpenseLoading(true)
        const newCurrent = net - Number(expenseAmount)
        try {
            const data = await addProjectExpense(project.id, expenseName, Number(expenseAmount), expenseNote, newCurrent)
            if (data) setExpenses(prev => [data[0] as projectExpenseType, ...prev])
            setProject(p => ({ ...p, current_amount: newCurrent }))
            setExpenseName(''); setExpenseAmount(''); setExpenseNote('')
            setShowAddExpense(false)
        } catch { /* logged */ }
        setExpenseLoading(false)
    }

    async function handleDeleteExpense(e: projectExpenseType) {
        const newCurrent = net + e.amount
        try {
            await deleteProjectExpense(e.id!, project.id!, newCurrent)
            setExpenses(prev => prev.filter(x => x.id !== e.id))
            setProject(p => ({ ...p, current_amount: newCurrent }))
        } catch { /* logged */ }
    }

    return (
        <section className="w-full z-40 xl:w-10/12 overflow-hidden px-5 py-10 flex flex-col gap-6">

            {/* ── Header ── */}
            <div>
                <Link href="/dashboard/budgets" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-4 transition-colors">
                    <ArrowLeft size={15} /> Volver a Finanzas
                </Link>

                {editing ? (
                    <div className="flex flex-col gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Nombre</label>
                                <input value={editName} onChange={e => setEditName(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Objetivo ($)</label>
                                <input type="number" value={editGoal} onChange={e => setEditGoal(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Descripción</label>
                                <input value={editDesc} onChange={e => setEditDesc(e.target.value)} className={inputClass} placeholder="Opcional" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Fecha límite</label>
                                <input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setEditing(false)} className={btnGhost}>Cancelar</button>
                            <button onClick={handleSaveProject} disabled={editLoading} className={btnPrimary}>
                                {editLoading ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{project.name}</h2>
                            {project.description && <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{project.description}</p>}
                            {project.deadline && (
                                <p className="text-xs text-slate-400 mt-1">
                                    Fecha límite: {new Date(project.deadline + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setEditing(true)}
                            className="shrink-0 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 transition-colors"
                        >
                            <Pencil size={13} /> Editar
                        </button>
                    </div>
                )}
            </div>

            {/* ── Progress hero ── */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-5">
                <div className="flex flex-wrap gap-6 mb-4">
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Neto ahorrado</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{fmt(net)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Objetivo</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{fmt(project.goal_amount)}</p>
                    </div>
                    {monthlyNeeded != null && (
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Necesitás / mes</p>
                            <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                                {fmt(Math.ceil(monthlyNeeded))}
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="font-medium">{pct.toFixed(1)}% completado</span>
                    {remaining > 0 && <span>Faltan {fmt(remaining)}</span>}
                </div>
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-green-500' : 'bg-slate-800 dark:bg-slate-300'}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            {/* ── KPI cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total aportado</p>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{fmt(totalContributed)}</p>
                    <p className="text-xs text-slate-400 mt-1">{contributions.length} ingreso{contributions.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Gastado en proyecto</p>
                    <p className="text-xl font-bold text-red-500 dark:text-red-400">{fmt(totalSpent)}</p>
                    <p className="text-xs text-slate-400 mt-1">{expenses.length} egreso{expenses.length !== 1 ? 's' : ''}</p>
                </div>
                <div className={`rounded-lg p-4 ${net >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Neto</p>
                    <p className={`text-xl font-bold ${net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {fmt(net)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">aportado – gastado</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Restante</p>
                    <p className={`text-xl font-bold ${remaining === 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-100'}`}>
                        {remaining === 0 ? '¡Meta!' : fmt(remaining)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{pct.toFixed(1)}% logrado</p>
                </div>
            </div>

            {/* ── Analysis ── */}
            {(totalContributed > 0 || totalSpent > 0) && (
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4">
                    <h3 className="font-medium text-slate-700 dark:text-slate-200 mb-1">Distribución del proyecto</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Neto ahorrado · Gastado · Restante para la meta</p>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-full md:w-64 shrink-0">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                                        {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip content={ChartTooltip} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 w-full flex flex-col gap-3">
                            {donutData.map(d => {
                                const pctTotal = (project.goal_amount > 0 ? d.value / project.goal_amount : 0) * 100
                                return (
                                    <div key={d.name}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium" style={{ color: d.color }}>{d.name}</span>
                                            <span className="text-slate-600 dark:text-slate-300">{fmt(d.value)}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${Math.min(pctTotal, 100)}%`, backgroundColor: d.color }} />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">{pctTotal.toFixed(1)}% del objetivo</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Ingresos / Aportes ── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Ingresos / Aportes</h3>
                    <button
                        onClick={() => { setShowAddContrib(!showAddContrib); setShowAddExpense(false) }}
                        className={btnPrimary + ' flex items-center gap-1.5'}
                    >
                        <Plus size={14} /> Agregar
                    </button>
                </div>

                {showAddContrib && (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 flex flex-col gap-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Monto</label>
                                <input type="number" placeholder="Ej: 5000" value={contribAmount} onChange={e => setContribAmount(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Nota (opcional)</label>
                                <input type="text" placeholder="Ej: Sueldo enero" value={contribNote} onChange={e => setContribNote(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => { setShowAddContrib(false); setContribAmount(''); setContribNote('') }} className={btnGhost}>Cancelar</button>
                            <button onClick={handleAddContribution} disabled={contribLoading} className={btnPrimary}>
                                {contribLoading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                )}

                {contributions.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg">
                        No hay ingresos registrados
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {contributions.map(c => (
                            <div key={c.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 tabular-nums">
                                        {c.created_at ? new Date(c.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }) : '—'}
                                    </span>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400 shrink-0">{fmt(c.amount)}</span>
                                    {c.note && <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{c.note}</span>}
                                </div>
                                <button onClick={() => handleDeleteContribution(c)} className="shrink-0 text-red-400 hover:text-red-600 transition-colors">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                        <div className="flex justify-end px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 mt-1">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Total: {fmt(totalContributed)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Egresos del proyecto ── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Egresos del proyecto</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Gastos propios del proyecto, no afectan gastos fijos mensuales</p>
                    </div>
                    <button
                        onClick={() => { setShowAddExpense(!showAddExpense); setShowAddContrib(false) }}
                        className={btnPrimary + ' flex items-center gap-1.5'}
                    >
                        <Plus size={14} /> Agregar
                    </button>
                </div>

                {showAddExpense && (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 flex flex-col gap-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Nombre del gasto</label>
                                <input type="text" placeholder="Ej: Arquitecta" value={expenseName} onChange={e => setExpenseName(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Monto</label>
                                <input type="number" placeholder="Ej: 2000" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Nota (opcional)</label>
                                <input type="text" placeholder="Ej: Planos revisión 1" value={expenseNote} onChange={e => setExpenseNote(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => { setShowAddExpense(false); setExpenseName(''); setExpenseAmount(''); setExpenseNote('') }} className={btnGhost}>Cancelar</button>
                            <button onClick={handleAddExpense} disabled={expenseLoading} className={btnPrimary}>
                                {expenseLoading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                )}

                {expenses.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg">
                        No hay egresos registrados
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {expenses.map(e => (
                            <div key={e.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 tabular-nums">
                                        {e.created_at ? new Date(e.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }) : '—'}
                                    </span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 shrink-0">{e.name}</span>
                                    <span className="text-sm font-semibold text-red-500 dark:text-red-400 shrink-0">{fmt(e.amount)}</span>
                                    {e.note && <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{e.note}</span>}
                                </div>
                                <button onClick={() => handleDeleteExpense(e)} className="shrink-0 text-red-400 hover:text-red-600 transition-colors">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                        <div className="flex justify-end px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 mt-1">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Total: {fmt(totalSpent)}</span>
                        </div>
                    </div>
                )}
            </div>

        </section>
    )
}
