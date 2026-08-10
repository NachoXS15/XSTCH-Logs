'use client'

import { useEffect, useState } from 'react'
import { btnGhost, btnPrimary, inputClass } from './shared'

export interface SavingsFormPayload {
    name: string
    goal_amount: number
    description: string
    deadline?: string
}

interface Props {
    open: boolean
    onClose: () => void
    onSubmit: (payload: SavingsFormPayload) => Promise<void>
}

export default function SavingsForm({ open, onClose, onSubmit }: Props) {
    const [name, setName] = useState('')
    const [goal, setGoal] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) {
            setName(''); setGoal(''); setDescription(''); setDeadline('')
        }
    }, [open])

    if (!open) return null

    async function handleSubmit() {
        if (!name || !goal) return
        setLoading(true)
        try {
            await onSubmit({
                name,
                goal_amount: Number(goal),
                description,
                deadline: deadline || undefined,
            })
            onClose()
        } catch { /* logged upstream */ }
        setLoading(false)
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 flex flex-col gap-3 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Nombre del proyecto" value={name}
                    onChange={e => setName(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Objetivo ($)" value={goal}
                    onChange={e => setGoal(e.target.value)} className={inputClass} />
                <input type="text" placeholder="Descripción (opcional)" value={description}
                    onChange={e => setDescription(e.target.value)} className={inputClass} />
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-500 dark:text-slate-400">Fecha límite (opcional)</label>
                    <input type="date" value={deadline}
                        onChange={e => setDeadline(e.target.value)} className={inputClass} />
                </div>
            </div>
            <div className="flex gap-2 justify-end">
                <button onClick={onClose} className={btnGhost}>Cancelar</button>
                <button onClick={handleSubmit} disabled={loading} className={btnPrimary}>
                    {loading ? 'Guardando...' : 'Crear proyecto'}
                </button>
            </div>
        </div>
    )
}
