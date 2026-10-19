'use client'

import { useEffect, useState } from 'react'
import { btnGhost, btnPrimary, inputClass } from './shared'

export interface SalaryFormPayload {
    client_name: string
    price: number
    account: string
    pay_method: string
    date: string
    obvs: string
}

interface Props {
    open: boolean
    onClose: () => void
    onSubmit: (payload: SalaryFormPayload) => Promise<void>
}

const PAY_METHODS = ['Transferencia', 'Efectivo', 'Mixto'] as const

export default function SalaryForm({ open, onClose, onSubmit }: Props) {
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [account, setAccount] = useState('')
    const [payMethod, setPayMethod] = useState<string>('Transferencia')
    const [date, setDate] = useState('')
    const [obvs, setObvs] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) {
            setName(''); setAmount(''); setAccount(''); setPayMethod('Transferencia'); setDate(''); setObvs('')
        }
    }, [open])

    if (!open) return null

    async function handleSubmit() {
        if (!name.trim() || !amount) return
        setLoading(true)
        try {
            await onSubmit({
                client_name: name.trim(),
                price: Number(amount),
                account: account.trim(),
                pay_method: payMethod,
                date: date.trim(),
                obvs: obvs.trim(),
            })
            onClose()
        } catch { /* logged upstream */ }
        setLoading(false)
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 flex flex-col gap-3 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" placeholder="Nombre / empresa" value={name}
                    onChange={e => setName(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Monto mensual" value={amount}
                    onChange={e => setAmount(e.target.value)} className={inputClass} />
                <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className={inputClass}>
                    {PAY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <input type="text" placeholder="Fecha estimada de pago (ej: 1-10)" value={date}
                    onChange={e => setDate(e.target.value)} className={inputClass} />
                <input type="text" placeholder="Cuenta (opcional, ej: @cuenta)" value={account}
                    onChange={e => setAccount(e.target.value.replace(/^@/, ''))} className={inputClass} />
                <input type="text" placeholder="Observaciones (opcional)" value={obvs}
                    onChange={e => setObvs(e.target.value)} className={inputClass} />
            </div>
            <div className="flex gap-2 justify-end">
                <button onClick={onClose} className={btnGhost}>Cancelar</button>
                <button onClick={handleSubmit} disabled={loading || !name.trim() || !amount} className={btnPrimary}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </div>
    )
}
