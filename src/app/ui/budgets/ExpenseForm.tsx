'use client'

import { useEffect, useState } from 'react'
import { CATEGORIES, btnGhost, btnPrimary, inputClass, parsePayDay } from './shared'

export interface ExpenseFormPayload {
    name: string
    amount: number
    category: string
    pay_day: number | null
}

interface Props {
    open: boolean
    onClose: () => void
    onSubmit: (payload: ExpenseFormPayload) => Promise<void>
}

export default function ExpenseForm({ open, onClose, onSubmit }: Props) {
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('otros')
    const [payDay, setPayDay] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) {
            setName(''); setAmount(''); setCategory('otros'); setPayDay('')
        }
    }, [open])

    if (!open) return null

    async function handleSubmit() {
        if (!name || !amount) return
        setLoading(true)
        try {
            await onSubmit({ name, amount: Number(amount), category, pay_day: parsePayDay(payDay) })
            onClose()
        } catch { /* logged upstream */ }
        setLoading(false)
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 flex flex-col gap-3 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input type="text" placeholder="Nombre del gasto" value={name}
                    onChange={e => setName(e.target.value)} className={inputClass} />
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                    {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                </select>
                <input type="number" min={1} max={31} placeholder="Día de pago (1-31)" value={payDay}
                    onChange={e => setPayDay(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Monto" value={amount}
                    onChange={e => setAmount(e.target.value)} className={inputClass} />
            </div>
            <div className="flex gap-2 justify-end">
                <button onClick={onClose} className={btnGhost}>Cancelar</button>
                <button onClick={handleSubmit} disabled={loading} className={btnPrimary}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </div>
    )
}
