'use client'

import { useMemo, useState } from 'react'
import { jobsType, expenseType, savingsProjectType } from '@/app/lib/definitions'
import {
    postExpense, deleteExpense, toggleExpense, updateExpense,
    postSavingsProject, deleteSavingsProject, updateSavingsAmount,
} from '@/app/lib/data-client'
import { Plus, Trash2, Pencil, Search, X } from 'lucide-react'
import { InstagramIcon } from '@/app/ui/Icons'
import AnalysisTab from './AnalysisTab'
import ExpenseCalendar from '@/app/ui/budgets/ExpenseCalendar'
import ExpenseForm, { ExpenseFormPayload } from '@/app/ui/budgets/ExpenseForm'
import SavingsForm, { SavingsFormPayload } from '@/app/ui/budgets/SavingsForm'
import { CATEGORIES, CATEGORY_COLORS, btnGhost, btnPrimary, inputClass, parsePayDay } from '@/app/ui/budgets/shared'
import Link from 'next/link'
import { usePriceVisibility } from './PriceVisibilityContext'

type Tab = 'sueldos' | 'gastos' | 'calendario' | 'presupuestos' | 'analisis'

interface Props {
    jobs: jobsType[]
    expenses: expenseType[]
    savingsProjects: savingsProjectType[]
}

export default function BudgetsClient({ jobs, expenses: init_expenses, savingsProjects: init_savings }: Props) {
    const { showPrices } = usePriceVisibility()
    const fmt = (n: number) => showPrices ? '$' + n.toLocaleString('es-AR') : '$***'

    const [activeTab, setActiveTab] = useState<Tab>('sueldos')
    const [expenses, setExpenses] = useState<expenseType[]>(init_expenses ?? [])
    const [savings, setSavings] = useState<savingsProjectType[]>(init_savings ?? [])

    const [showExpenseForm, setShowExpenseForm] = useState(false)
    const [showSavingsForm, setShowSavingsForm] = useState(false)

    // Search & filter
    const [expenseSearch, setExpenseSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')

    // Inline edit
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editAmount, setEditAmount] = useState('')
    const [editCategory, setEditCategory] = useState('otros')
    const [editPayDay, setEditPayDay] = useState('')
    const [editLoading, setEditLoading] = useState(false)

    // Contribution
    const [contributionTarget, setContributionTarget] = useState<string | null>(null)
    const [contributionAmount, setContributionAmount] = useState('')

    const allJobs = jobs ?? []
    const activeJobs = allJobs.filter(j => j.active === 'Activo')
    const totalIncome = activeJobs.reduce((s, j) => s + j.price, 0)
    const saved1 = totalIncome * 0.10
    const totalExpenses = expenses.filter(e => e.active).reduce((s, e) => s + e.amount, 0)
    const balance = totalIncome - totalExpenses
    const totalSaved = savings.reduce((s, p) => s + p.current_amount, 0)

    const filteredExpenses = useMemo(() => {
        return expenses.filter(e => {
            const matchSearch = !expenseSearch || e.name.toLowerCase().includes(expenseSearch.toLowerCase())
            const matchCategory = !categoryFilter || e.category === categoryFilter
            return matchSearch && matchCategory
        })
    }, [expenses, expenseSearch, categoryFilter])

    function startEdit(expense: expenseType) {
        setEditingId(expense.id!)
        setEditName(expense.name)
        setEditAmount(String(expense.amount))
        setEditCategory(expense.category)
        setEditPayDay(expense.pay_day ? String(expense.pay_day) : '')
    }

    function cancelEdit() {
        setEditingId(null)
        setEditName(''); setEditAmount(''); setEditCategory('otros'); setEditPayDay('')
    }

    async function handleAddExpense(payload: ExpenseFormPayload) {
        const data = await postExpense({ ...payload, active: true })
        if (data) setExpenses(prev => [data[0] as expenseType, ...prev])
    }

    async function handleUpdateExpense() {
        if (!editingId || !editName || !editAmount) return
        setEditLoading(true)
        try {
            const pay_day = parsePayDay(editPayDay)
            await updateExpense(editingId, { name: editName, amount: Number(editAmount), category: editCategory, pay_day })
            setExpenses(prev => prev.map(e =>
                e.id === editingId ? { ...e, name: editName, amount: Number(editAmount), category: editCategory, pay_day } : e
            ))
            cancelEdit()
        } catch { /* error already logged */ }
        setEditLoading(false)
    }

    async function handleDeleteExpense(id: string) {
        try {
            await deleteExpense(id)
            setExpenses(prev => prev.filter(e => e.id !== id))
        } catch { /* error already logged */ }
    }

    async function handleToggleExpense(id: string, active: boolean) {
        try {
            await toggleExpense(id, !active)
            setExpenses(prev => prev.map(e => e.id === id ? { ...e, active: !active } : e))
        } catch { /* error already logged */ }
    }

    async function handleAddSavings(payload: SavingsFormPayload) {
        const data = await postSavingsProject({
            name: payload.name,
            goal_amount: payload.goal_amount,
            current_amount: 0,
            description: payload.description,
            deadline: payload.deadline,
        })
        if (data) setSavings(prev => [data[0] as savingsProjectType, ...prev])
    }

    async function handleDeleteSavings(id: string) {
        try {
            await deleteSavingsProject(id)
            setSavings(prev => prev.filter(p => p.id !== id))
        } catch { /* error already logged */ }
    }

    async function handleContribute(project: savingsProjectType) {
        if (!contributionAmount || !project.id) return
        const newAmount = project.current_amount + Number(contributionAmount)
        try {
            await updateSavingsAmount(project.id, newAmount)
            setSavings(prev => prev.map(p => p.id === project.id ? { ...p, current_amount: newAmount } : p))
            setContributionTarget(null); setContributionAmount('')
        } catch { /* error already logged */ }
    }

    return (
        <section className='w-full z-40 md:px-44 overflow-hidden px-5 pt-10 pb-28 md:pb-10 flex items-center justify-start flex-col'>
            <div className="w-full flex flex-col py-5 md:flex-row justify-between items-center">
                <div className="text-left w-full border-b border-slate-200 dark:border-slate-700 mb-4 md:border-0 md:mb-0">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-50">Finanzas Personales</h3>
                    <p className="text-slate-500 mb-5">Sueldos, gastos fijos y proyectos de ahorro</p>
                </div>
            </div>

            <div className="w-full flex flex-col gap-6">
                {/* Tab buttons */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full sm:w-fit gap-1 overflow-x-auto">
                    {(['sueldos', 'gastos', 'calendario', 'presupuestos', 'analisis'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                                activeTab === tab
                                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            {tab === 'sueldos' ? 'Sueldos' : tab === 'gastos' ? 'Gastos' : tab === 'calendario' ? 'Calendario' : tab === 'presupuestos' ? 'Presupuestos' : 'Análisis'}
                        </button>
                    ))}
                </div>

                {/* ── SUELDOS ── */}
                {activeTab === 'sueldos' && (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ingreso mensual</p>
                                <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{fmt(totalIncome)}</p>
                                <p className="text-xs text-slate-400 mt-1">{activeJobs.length} trabajo{activeJobs.length !== 1 ? 's' : ''} activos</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Gastos fijos</p>
                                <p className="text-xl sm:text-2xl font-bold text-red-500 dark:text-red-400">{fmt(totalExpenses)}</p>
                                <p className="text-xs text-slate-400 mt-1">{expenses.filter(e => e.active).length} gastos activos</p>
                            </div>
                            <div className={`col-span-2 md:col-span-1 rounded-lg p-4 ${balance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Disponible</p>
                                <p className={`text-xl sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {fmt(balance)}
                                </p>
                            </div>
                            <div className={`col-span-2 md:col-span-1 rounded-lg p-4 ${balance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">10% Ahorrado</p>
                                <p className={`text-xl sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {fmt(saved1)}
                                </p>
                            </div>
                        </div>

                        {activeJobs.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                                <p>No hay trabajos activos registrados</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-900">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700">Cliente</th>
                                            <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700 hidden sm:table-cell">Cuenta</th>
                                            <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700 hidden md:table-cell">Método de pago</th>
                                            <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700 hidden md:table-cell">Fecha estimada</th>
                                            <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700 hidden md:table-cell">Observaciones</th>
                                            <th className="text-right px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {activeJobs.map((job, i) => (
                                            <tr key={job.id ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{job.client_name}</td>
                                                <td className="px-4 py-3 hidden sm:table-cell">
                                                    <a href={`https://instagram.com/${job.account}`} target="_blank" className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:underline">
                                                        <InstagramIcon />
                                                        <span className="text-sm">{job.account}</span>
                                                    </a>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{job.pay_method || '-'}</td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{job.date}</td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{job.obvs || '-'}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-200">
                                                    {fmt(job.price)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900">
                                            <td colSpan={5} className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 hidden sm:table-cell">Total</td>
                                            <td colSpan={1} className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 sm:hidden">Total</td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-white">
                                                {fmt(totalIncome)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── GASTOS ── */}
                {activeTab === 'gastos' && (
                    <div className="flex flex-col gap-5">
                        {/* Balance summary */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ingreso mensual</p>
                                <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">{fmt(totalIncome)}</p>
                                <p className="text-xs text-slate-400 mt-1">{activeJobs.length} trabajos activos</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Gastos fijos</p>
                                <p className="text-lg sm:text-xl font-bold text-red-500 dark:text-red-400">{fmt(totalExpenses)}</p>
                                <p className="text-xs text-slate-400 mt-1">{expenses.filter(e => e.active).length} activos</p>
                            </div>
                            <div className={`col-span-2 md:col-span-1 rounded-lg p-4 ${balance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Disponible</p>
                                <p className={`text-lg sm:text-xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {fmt(balance)}
                                </p>
                            </div>
                        </div>

                        {/* Header + add button */}
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-700 dark:text-slate-200">Gastos fijos</h4>
                            <button
                                onClick={() => { setShowExpenseForm(v => !v); cancelEdit() }}
                                className={btnPrimary + ' flex items-center gap-1.5'}
                            >
                                <Plus size={14} />
                                Agregar
                            </button>
                        </div>

                        <ExpenseForm
                            open={showExpenseForm}
                            onClose={() => setShowExpenseForm(false)}
                            onSubmit={handleAddExpense}
                        />

                        {/* Search + category filters */}
                        {expenses.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <div className="relative">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Buscar gasto..."
                                        value={expenseSearch}
                                        onChange={e => setExpenseSearch(e.target.value)}
                                        className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white rounded-lg pl-9 pr-8 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-slate-400"
                                    />
                                    {expenseSearch && (
                                        <button
                                            onClick={() => setExpenseSearch('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
                                    <button
                                        onClick={() => setCategoryFilter('')}
                                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                                            !categoryFilter
                                                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 border-transparent'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                                        }`}
                                    >
                                        Todos
                                    </button>
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                                            className={`text-xs px-3 py-1 rounded-full border transition-colors capitalize ${
                                                categoryFilter === cat
                                                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 border-transparent'
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Expenses table */}
                        {expenses.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                                <p>No hay gastos fijos registrados</p>
                            </div>
                        ) : filteredExpenses.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                                <p>Sin resultados para la búsqueda</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-900">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700">Nombre</th>
                                            <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700 hidden sm:table-cell">Categoría</th>
                                            <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700 hidden md:table-cell">Fecha de pago</th>
                                            <th className="text-right px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700">Precio</th>
                                            <th className="text-right px-4 py-3 text-slate-500 dark:text-slate-400 font-normal border-b border-slate-200 dark:border-slate-700">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {filteredExpenses.map(expense => (
                                            editingId === expense.id ? (
                                                <tr key={expense.id} className="bg-slate-50 dark:bg-slate-800/70">
                                                    <td colSpan={5} className="px-4 py-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                                            <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                                                                className={inputClass} placeholder="Nombre" />
                                                            <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className={inputClass}>
                                                                {CATEGORIES.map(c => (
                                                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                                                ))}
                                                            </select>
                                                            <input type="number" min={1} max={31} value={editPayDay} onChange={e => setEditPayDay(e.target.value)}
                                                                className={inputClass} placeholder="Día de pago (1-31)" />
                                                            <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)}
                                                                className={inputClass} placeholder="Monto" />
                                                        </div>
                                                        <div className="flex gap-2 justify-end mt-3">
                                                            <button onClick={cancelEdit} className={btnGhost}>Cancelar</button>
                                                            <button onClick={handleUpdateExpense} disabled={editLoading} className={btnPrimary}>
                                                                {editLoading ? 'Guardando...' : 'Guardar cambios'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr key={expense.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!expense.active ? 'opacity-60' : ''}`}>
                                                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="truncate">{expense.name}</span>
                                                            <span className="sm:hidden">
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS['otros']}`}>
                                                                    {expense.category}
                                                                </span>
                                                                {expense.pay_day && (
                                                                    <span className="ml-2 text-xs text-slate-400">día {expense.pay_day}</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 hidden sm:table-cell">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS['otros']}`}>
                                                            {expense.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell tabular-nums">
                                                        {expense.pay_day ? `Día ${expense.pay_day}` : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
                                                        {fmt(expense.amount)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleToggleExpense(expense.id!, expense.active)}
                                                                className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded border transition-colors ${
                                                                    expense.active
                                                                        ? 'border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                                        : 'border-slate-300 dark:border-slate-600 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                                }`}
                                                            >
                                                                {expense.active ? 'activo' : 'inactivo'}
                                                            </button>
                                                            <button
                                                                onClick={() => { startEdit(expense); setShowExpenseForm(false) }}
                                                                className="text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Pencil size={15} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteExpense(expense.id!)}
                                                                className="text-red-400 hover:text-red-600 transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900">
                                            <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">
                                                {filteredExpenses.length} de {expenses.length} gastos
                                            </td>
                                            <td className="hidden sm:table-cell"></td>
                                            <td className="hidden md:table-cell px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Total activos</td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-white tabular-nums">
                                                {fmt(totalExpenses)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── CALENDARIO ── */}
                {activeTab === 'calendario' && (
                    <ExpenseCalendar expenses={expenses} fmt={fmt} />
                )}

                {/* ── ANÁLISIS ── */}
                {activeTab === 'analisis' && (
                    <AnalysisTab jobs={allJobs} expenses={expenses} savings={savings} />
                )}

                {/* ── PRESUPUESTOS ── */}
                {activeTab === 'presupuestos' && (
                    <div className="flex flex-col gap-5">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total ahorrado</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{fmt(totalSaved)}</p>
                            <p className="text-xs text-slate-400 mt-1">{savings.length} proyecto{savings.length !== 1 ? 's' : ''}</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-700 dark:text-slate-200">Proyectos de ahorro</h4>
                            <button onClick={() => setShowSavingsForm(v => !v)} className={btnPrimary + ' flex items-center gap-1.5'}>
                                <Plus size={14} />
                                Nuevo proyecto
                            </button>
                        </div>

                        <SavingsForm
                            open={showSavingsForm}
                            onClose={() => setShowSavingsForm(false)}
                            onSubmit={handleAddSavings}
                        />

                        {savings.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                                <p>No hay proyectos de ahorro</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {savings.map(project => {
                                    const pct = project.goal_amount > 0 ? Math.min((project.current_amount / project.goal_amount) * 100, 100) : 0
                                    const remaining = project.goal_amount - project.current_amount
                                    return (
                                        <div key={project.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4 flex flex-col gap-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h5 className="font-semibold text-slate-800 dark:text-slate-100">{project.name}</h5>
                                                    {project.description && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{project.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0 ml-2">
                                                    <Link
                                                        href={`/dashboard/budgets/projects/${project.id}`}
                                                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                                                    >
                                                        Ver detalle →
                                                    </Link>
                                                    <button onClick={() => handleDeleteSavings(project.id!)} className="text-red-400 hover:text-red-600 transition-colors">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                    <span>{fmt(project.current_amount)}</span>
                                                    <span>{fmt(project.goal_amount)}</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-green-500' : 'bg-slate-800 dark:bg-slate-300'}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-slate-400">{pct.toFixed(0)}%</span>
                                                    {project.deadline && (
                                                        <span className="text-xs text-slate-400">
                                                            Límite: {new Date(project.deadline + 'T00:00:00').toLocaleDateString('es-AR')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {remaining > 0 && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Faltan: <strong className="text-slate-700 dark:text-slate-200">{fmt(remaining)}</strong>
                                                </p>
                                            )}

                                            {contributionTarget === project.id ? (
                                                <div className="flex gap-2">
                                                    <input type="number" placeholder="Monto a agregar" value={contributionAmount}
                                                        onChange={e => setContributionAmount(e.target.value)} className={inputClass} />
                                                    <button onClick={() => handleContribute(project)} className={btnPrimary}>Agregar</button>
                                                    <button onClick={() => { setContributionTarget(null); setContributionAmount('') }} className={btnGhost}>✕</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setContributionTarget(project.id!)}
                                                    className="text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                                                >
                                                    <Plus size={13} />
                                                    Agregar ahorro
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}
