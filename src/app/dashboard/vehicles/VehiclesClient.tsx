'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    Car, Bike, Truck, CarFront, Plus, X, Pencil, Trash2, Wrench, CheckCircle2, Circle,
    AlertTriangle, ShieldCheck, ClipboardCheck, type LucideIcon,
} from 'lucide-react'
import { vehicleType, vehicleProblemType, vehicleProblemStatus } from '@/app/lib/definitions'
import {
    postVehicle, updateVehicle, deleteVehicle,
    postVehicleProblem, updateVehicleProblem, deleteVehicleProblem,
} from '@/app/lib/data-client'

// ---------- constantes ----------

const VEHICLE_TYPES = ['Auto', 'Moto', 'Camioneta', 'Otro'] as const
const FUELS = ['Nafta', 'Diésel', 'GNC', 'Nafta + GNC', 'Eléctrico', 'Híbrido'] as const

const TYPE_ICONS: Record<string, LucideIcon> = {
    Auto: Car,
    Moto: Bike,
    Camioneta: Truck,
    Otro: CarFront,
}

const STATUS_STYLES: Record<vehicleProblemStatus, string> = {
    Pendiente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    Arreglado: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
}

const INPUT_CLS = 'w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white'
const LABEL_CLS = 'text-xs font-medium text-slate-500 dark:text-slate-400'

type ProblemFilter = 'Pendiente' | 'Arreglado' | 'Todos'

// ---------- helpers ----------

const todayStr = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const fmtDate = (d?: string | null) => {
    if (!d) return '—'
    const [y, m, day] = d.slice(0, 10).split('-')
    return `${day}/${m}/${y}`
}

const daysUntil = (d: string) => {
    const [y, m, day] = d.slice(0, 10).split('-').map(Number)
    const [ty, tm, td] = todayStr().split('-').map(Number)
    return Math.round((Date.UTC(y, m - 1, day) - Date.UTC(ty, tm - 1, td)) / 86400000)
}

type ExpiryState = 'vencido' | 'pronto' | 'ok' | null
const expiryState = (d?: string | null): ExpiryState => {
    if (!d) return null
    const n = daysUntil(d)
    if (n < 0) return 'vencido'
    if (n <= 30) return 'pronto'
    return 'ok'
}

const hasNoInsurance = (v: vehicleType) => !v.insurance_company && !v.insurance_policy && !v.insurance_expiry

const fmtMoney = (n?: number | null) =>
    n == null ? null : n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

const emptyToNull = (v: string) => (v.trim() === '' ? null : v.trim())
const intOrNull = (v: string) => (v.trim() === '' || isNaN(Number(v)) ? null : Math.round(Number(v)))

// ---------- formularios ----------

type VehicleForm = {
    name: string; type: string; brand: string; model: string; year: string; plate: string
    color: string; fuel: string; mileage_km: string; vin: string; engine_number: string
    insurance_company: string; insurance_policy: string; insurance_expiry: string; vtv_expiry: string; notes: string
}

const EMPTY_VEHICLE: VehicleForm = {
    name: '', type: 'Auto', brand: '', model: '', year: '', plate: '', color: '', fuel: '',
    mileage_km: '', vin: '', engine_number: '', insurance_company: '', insurance_policy: '',
    insurance_expiry: '', vtv_expiry: '', notes: '',
}

const vehicleToForm = (v: vehicleType): VehicleForm => ({
    name: v.name ?? '', type: v.type ?? 'Auto', brand: v.brand ?? '', model: v.model ?? '',
    year: v.year?.toString() ?? '', plate: v.plate ?? '', color: v.color ?? '', fuel: v.fuel ?? '',
    mileage_km: v.mileage_km?.toString() ?? '', vin: v.vin ?? '', engine_number: v.engine_number ?? '',
    insurance_company: v.insurance_company ?? '', insurance_policy: v.insurance_policy ?? '',
    insurance_expiry: v.insurance_expiry ?? '', vtv_expiry: v.vtv_expiry ?? '', notes: v.notes ?? '',
})

const formToVehicle = (f: VehicleForm): vehicleType => ({
    name: f.name.trim(),
    type: f.type,
    brand: emptyToNull(f.brand),
    model: emptyToNull(f.model),
    year: intOrNull(f.year),
    plate: emptyToNull(f.plate)?.toUpperCase() ?? null,
    color: emptyToNull(f.color),
    fuel: emptyToNull(f.fuel),
    mileage_km: intOrNull(f.mileage_km),
    vin: emptyToNull(f.vin),
    engine_number: emptyToNull(f.engine_number),
    insurance_company: emptyToNull(f.insurance_company),
    insurance_policy: emptyToNull(f.insurance_policy),
    insurance_expiry: emptyToNull(f.insurance_expiry),
    vtv_expiry: emptyToNull(f.vtv_expiry),
    notes: emptyToNull(f.notes),
})

type ProblemForm = {
    title: string; description: string; status: vehicleProblemStatus
    reported_at: string; fixed_at: string; cost: string
}

const emptyProblem = (): ProblemForm => ({
    title: '', description: '', status: 'Pendiente', reported_at: todayStr(), fixed_at: '', cost: '',
})

const problemToForm = (p: vehicleProblemType): ProblemForm => ({
    title: p.title, description: p.description ?? '', status: p.status,
    reported_at: p.reported_at ?? todayStr(), fixed_at: p.fixed_at ?? '', cost: p.cost?.toString() ?? '',
})

// ---------- modales ----------

function ModalShell({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} mx-4 p-6 max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-lg text-black dark:text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-black dark:hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
    return (
        <div className={`flex flex-col gap-1 ${full ? 'sm:col-span-2' : ''}`}>
            <label className={LABEL_CLS}>{label}</label>
            {children}
        </div>
    )
}

function VehicleModal({
    title, form, setForm, onSubmit, onClose, loading, submitLabel,
}: {
    title: string
    form: VehicleForm
    setForm: React.Dispatch<React.SetStateAction<VehicleForm>>
    onSubmit: (e: React.FormEvent) => void
    onClose: () => void
    loading: boolean
    submitLabel: string
}) {
    const set = (k: keyof VehicleForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }))

    return (
        <ModalShell title={title} onClose={onClose} wide>
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label className={LABEL_CLS}>Tipo</label>
                    <div className="flex gap-2">
                        {VEHICLE_TYPES.map(t => {
                            const Icon = TYPE_ICONS[t]
                            return (
                                <button
                                    type="button"
                                    key={t}
                                    onClick={() => setForm(f => ({ ...f, type: t }))}
                                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition flex items-center justify-center gap-1.5 ${
                                        form.type === t
                                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Icon size={14} /> {t}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Datos generales</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Nombre / apodo *" full>
                            <input className={INPUT_CLS} value={form.name} onChange={set('name')} placeholder="Ej: El Gol, Moto de papá" />
                        </Field>
                        <Field label="Marca"><input className={INPUT_CLS} value={form.brand} onChange={set('brand')} placeholder="Ej: Volkswagen" /></Field>
                        <Field label="Modelo"><input className={INPUT_CLS} value={form.model} onChange={set('model')} placeholder="Ej: Gol Trend" /></Field>
                        <Field label="Año"><input className={INPUT_CLS} type="number" inputMode="numeric" value={form.year} onChange={set('year')} placeholder="Ej: 2015" /></Field>
                        <Field label="Patente"><input className={`${INPUT_CLS} uppercase`} value={form.plate} onChange={set('plate')} placeholder="Ej: AB123CD" /></Field>
                        <Field label="Color"><input className={INPUT_CLS} value={form.color} onChange={set('color')} placeholder="Ej: Gris plata" /></Field>
                        <Field label="Combustible">
                            <select className={INPUT_CLS} value={form.fuel} onChange={set('fuel')}>
                                <option value="">—</option>
                                {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </Field>
                        <Field label="Kilometraje"><input className={INPUT_CLS} type="number" inputMode="numeric" value={form.mileage_km} onChange={set('mileage_km')} placeholder="Ej: 85000" /></Field>
                        <Field label="N° de chasis (VIN)"><input className={INPUT_CLS} value={form.vin} onChange={set('vin')} /></Field>
                        <Field label="N° de motor"><input className={INPUT_CLS} value={form.engine_number} onChange={set('engine_number')} /></Field>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Seguro y VTV</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Aseguradora"><input className={INPUT_CLS} value={form.insurance_company} onChange={set('insurance_company')} placeholder="Ej: La Caja" /></Field>
                        <Field label="N° de póliza"><input className={INPUT_CLS} value={form.insurance_policy} onChange={set('insurance_policy')} /></Field>
                        <Field label="Vencimiento del seguro"><input className={INPUT_CLS} type="date" value={form.insurance_expiry} onChange={set('insurance_expiry')} /></Field>
                        <Field label="Vencimiento de la VTV"><input className={INPUT_CLS} type="date" value={form.vtv_expiry} onChange={set('vtv_expiry')} /></Field>
                    </div>
                </div>

                <Field label="Notas">
                    <textarea className={`${INPUT_CLS} min-h-20`} value={form.notes} onChange={set('notes')} placeholder="Cualquier dato extra (medida de cubiertas, aceite que usa, etc.)" />
                </Field>

                <button
                    type="submit"
                    disabled={loading || !form.name.trim()}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-40"
                >
                    {loading ? 'Guardando...' : submitLabel}
                </button>
            </form>
        </ModalShell>
    )
}

function ProblemModal({
    title, form, setForm, onSubmit, onClose, loading, submitLabel,
}: {
    title: string
    form: ProblemForm
    setForm: React.Dispatch<React.SetStateAction<ProblemForm>>
    onSubmit: (e: React.FormEvent) => void
    onClose: () => void
    loading: boolean
    submitLabel: string
}) {
    const set = (k: keyof ProblemForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }))

    const setStatus = (status: vehicleProblemStatus) =>
        setForm(f => ({
            ...f,
            status,
            fixed_at: status === 'Arreglado' ? (f.fixed_at || todayStr()) : '',
        }))

    return (
        <ModalShell title={title} onClose={onClose}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <Field label="Problema *">
                    <input className={INPUT_CLS} value={form.title} onChange={set('title')} placeholder="Ej: Ruido en la suspensión delantera" />
                </Field>
                <Field label="Descripción">
                    <textarea className={`${INPUT_CLS} min-h-24`} value={form.description} onChange={set('description')} placeholder="Cuándo pasa, qué se escucha, qué dijo el mecánico..." />
                </Field>
                <div className="flex flex-col gap-1">
                    <label className={LABEL_CLS}>Estado</label>
                    <div className="flex gap-2">
                        {(['Pendiente', 'Arreglado'] as const).map(s => (
                            <button
                                type="button"
                                key={s}
                                onClick={() => setStatus(s)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                                    form.status === s
                                        ? STATUS_STYLES[s] + ' border-transparent'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Detectado el">
                        <input className={INPUT_CLS} type="date" value={form.reported_at} onChange={set('reported_at')} />
                    </Field>
                    <Field label="Arreglado el">
                        <input className={INPUT_CLS} type="date" value={form.fixed_at} onChange={set('fixed_at')} disabled={form.status !== 'Arreglado'} />
                    </Field>
                </div>
                <Field label="Costo (opcional)">
                    <input className={INPUT_CLS} type="number" inputMode="decimal" value={form.cost} onChange={set('cost')} placeholder="Ej: 45000" />
                </Field>
                <button
                    type="submit"
                    disabled={loading || !form.title.trim()}
                    className="mt-1 w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-40"
                >
                    {loading ? 'Guardando...' : submitLabel}
                </button>
            </form>
        </ModalShell>
    )
}

// ---------- piezas de UI ----------

function ExpiryBadge({ label, date }: { label: string; date?: string | null }) {
    const st = expiryState(date)
    if (!st || st === 'ok') return null
    const cls = st === 'vencido'
        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
    return (
        <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${cls}`}>
            <AlertTriangle size={11} /> {label} {st === 'vencido' ? 'vencido' : 'vence pronto'}
        </span>
    )
}

function NoInsuranceBadge() {
    return (
        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
            <AlertTriangle size={11} /> Sin seguro
        </span>
    )
}

function InfoItem({ label, value, mono }: { label: string; value?: React.ReactNode; mono?: boolean }) {
    return (
        <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
            <p className={`text-sm text-black dark:text-white truncate ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
        </div>
    )
}

function ExpiryItem({ label, date, icon: Icon }: { label: string; date?: string | null; icon: LucideIcon }) {
    const st = expiryState(date)
    const color = st === 'vencido' ? 'text-red-600 dark:text-red-400'
        : st === 'pronto' ? 'text-amber-600 dark:text-amber-400'
        : 'text-black dark:text-white'
    const extra = date
        ? (() => {
            const n = daysUntil(date)
            if (n < 0) return `venció hace ${-n} día${n === -1 ? '' : 's'}`
            if (n === 0) return 'vence hoy'
            return `en ${n} día${n === 1 ? '' : 's'}`
        })()
        : null
    return (
        <div className="flex items-start gap-2 min-w-0">
            <Icon size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
                <p className={`text-sm ${color}`}>{fmtDate(date)}</p>
                {extra && <p className={`text-[11px] ${st === 'ok' ? 'text-slate-400' : color}`}>{extra}</p>}
            </div>
        </div>
    )
}

// ---------- componente principal ----------

export default function VehiclesClient({ vehicles, problems }: { vehicles: vehicleType[]; problems: vehicleProblemType[] }) {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState<string | null>(vehicles[0]?.id ?? null)
    const [loading, setLoading] = useState(false)

    const [showAddVehicle, setShowAddVehicle] = useState(false)
    const [editVehicleOpen, setEditVehicleOpen] = useState(false)
    const [vehicleForm, setVehicleForm] = useState<VehicleForm>(EMPTY_VEHICLE)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const [filter, setFilter] = useState<ProblemFilter>('Pendiente')
    const [problemModal, setProblemModal] = useState<{ mode: 'add' } | { mode: 'edit'; id: string } | null>(null)
    const [problemForm, setProblemForm] = useState<ProblemForm>(emptyProblem())

    const selected = vehicles.find(v => v.id === selectedId) ?? vehicles[0] ?? null

    const problemsByVehicle = useMemo(() => {
        const map = new Map<string, vehicleProblemType[]>()
        problems.forEach(p => {
            const arr = map.get(p.vehicle_id) ?? []
            arr.push(p)
            map.set(p.vehicle_id, arr)
        })
        return map
    }, [problems])

    const selectedProblems = selected?.id ? problemsByVehicle.get(selected.id) ?? [] : []
    const pendingCount = selectedProblems.filter(p => p.status === 'Pendiente').length
    const fixedCount = selectedProblems.length - pendingCount
    const visibleProblems = selectedProblems
        .filter(p => filter === 'Todos' || p.status === filter)
        .sort((a, b) => {
            if (a.status !== b.status) return a.status === 'Pendiente' ? -1 : 1
            return (b.reported_at ?? '').localeCompare(a.reported_at ?? '')
        })

    const run = async (fn: () => Promise<unknown>) => {
        setLoading(true)
        try {
            await fn()
            router.refresh()
        } catch {
            alert('No se pudo guardar. Revisá la consola para más detalle.')
        } finally {
            setLoading(false)
        }
    }

    // ---- vehículos ----
    const openAddVehicle = () => {
        setVehicleForm(EMPTY_VEHICLE)
        setShowAddVehicle(true)
    }

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault()
        if (!vehicleForm.name.trim()) return
        run(async () => {
            const data = await postVehicle(formToVehicle(vehicleForm))
            const newId = (data?.[0] as vehicleType | undefined)?.id
            if (newId) setSelectedId(newId)
            setShowAddVehicle(false)
        })
    }

    const openEditVehicle = () => {
        if (!selected) return
        setVehicleForm(vehicleToForm(selected))
        setEditVehicleOpen(true)
    }

    const handleEditVehicle = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected?.id || !vehicleForm.name.trim()) return
        const id = selected.id
        run(async () => {
            await updateVehicle(id, formToVehicle(vehicleForm))
            setEditVehicleOpen(false)
        })
    }

    const handleDeleteVehicle = () => {
        if (!selected?.id) return
        const id = selected.id
        run(async () => {
            await deleteVehicle(id)
            setConfirmDelete(false)
            setSelectedId(vehicles.find(v => v.id !== id)?.id ?? null)
        })
    }

    // ---- problemas ----
    const openAddProblem = () => {
        setProblemForm(emptyProblem())
        setProblemModal({ mode: 'add' })
    }

    const openEditProblem = (p: vehicleProblemType) => {
        if (!p.id) return
        setProblemForm(problemToForm(p))
        setProblemModal({ mode: 'edit', id: p.id })
    }

    const handleSubmitProblem = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected?.id || !problemForm.title.trim() || !problemModal) return
        const payload = {
            title: problemForm.title.trim(),
            description: emptyToNull(problemForm.description),
            status: problemForm.status,
            reported_at: problemForm.reported_at || todayStr(),
            fixed_at: problemForm.status === 'Arreglado' ? (problemForm.fixed_at || todayStr()) : null,
            cost: problemForm.cost.trim() === '' || isNaN(Number(problemForm.cost)) ? null : Number(problemForm.cost),
        }
        const vehicleId = selected.id
        const modal = problemModal
        run(async () => {
            if (modal.mode === 'add') {
                await postVehicleProblem({ vehicle_id: vehicleId, ...payload })
            } else {
                await updateVehicleProblem(modal.id, payload)
            }
            setProblemModal(null)
        })
    }

    const toggleProblem = (p: vehicleProblemType) => {
        if (!p.id) return
        const id = p.id
        const nowFixed = p.status === 'Pendiente'
        run(() => updateVehicleProblem(id, {
            status: nowFixed ? 'Arreglado' : 'Pendiente',
            fixed_at: nowFixed ? todayStr() : null,
        }))
    }

    const removeProblem = (id?: string) => {
        if (!id) return
        run(() => deleteVehicleProblem(id))
    }

    // ---------- render ----------

    return (
        <div className="w-full lg:px-20 px-5 py-10 flex flex-col gap-8">
            {/* encabezado */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">Vehículos</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Datos de cada vehículo y sus problemas</p>
                </div>
                <button
                    onClick={openAddVehicle}
                    className="flex items-center gap-1.5 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition shrink-0"
                >
                    <Plus size={16} /> <span className="hidden sm:inline">Nuevo vehículo</span><span className="sm:hidden">Nuevo</span>
                </button>
            </div>

            {vehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-600 gap-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                    <Car size={44} strokeWidth={1} />
                    <p className="text-sm">Todavía no registraste ningún vehículo</p>
                    <button onClick={openAddVehicle} className="text-sm font-medium text-black dark:text-white underline underline-offset-4">
                        Agregar el primero
                    </button>
                </div>
            ) : (
                <>
                    {/* selector de vehículos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {vehicles.map(v => {
                            const Icon = TYPE_ICONS[v.type] ?? CarFront
                            const pend = (problemsByVehicle.get(v.id ?? '') ?? []).filter(p => p.status === 'Pendiente').length
                            const active = v.id === selected?.id
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => { setSelectedId(v.id ?? null); setConfirmDelete(false) }}
                                    className={`text-left rounded-xl p-4 border transition flex flex-col gap-2 ${
                                        active
                                            ? 'border-black dark:border-white bg-slate-100 dark:bg-slate-800'
                                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-gray-900 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                            <Icon size={20} className="text-slate-600 dark:text-slate-300" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm text-black dark:text-white truncate">{v.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {[v.brand, v.model, v.year].filter(Boolean).join(' · ') || v.type}
                                            </p>
                                        </div>
                                        {v.plate && (
                                            <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 shrink-0">
                                                {v.plate}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {pend > 0 ? (
                                            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES.Pendiente}`}>
                                                <Wrench size={11} /> {pend} pendiente{pend === 1 ? '' : 's'}
                                            </span>
                                        ) : (
                                            <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES.Arreglado}`}>
                                                <CheckCircle2 size={11} /> Sin problemas
                                            </span>
                                        )}
                                        {hasNoInsurance(v) ? <NoInsuranceBadge /> : <ExpiryBadge label="Seguro" date={v.insurance_expiry} />}
                                        <ExpiryBadge label="VTV" date={v.vtv_expiry} />
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {selected && (
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                            {/* ficha */}
                            <section className="xl:col-span-2 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-5 h-fit">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2 className="font-bold text-lg text-black dark:text-white truncate">{selected.name}</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{selected.type}</p>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button onClick={openEditVehicle} className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Editar">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => setConfirmDelete(true)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Eliminar">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {confirmDelete && (
                                    <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-3 flex flex-col gap-2">
                                        <p className="text-sm text-red-700 dark:text-red-400">
                                            ¿Eliminar <b>{selected.name}</b>? También se borran sus {selectedProblems.length} problema{selectedProblems.length === 1 ? '' : 's'}.
                                        </p>
                                        <div className="flex gap-2">
                                            <button onClick={handleDeleteVehicle} disabled={loading} className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50">
                                                Sí, eliminar
                                            </button>
                                            <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <InfoItem label="Marca" value={selected.brand} />
                                    <InfoItem label="Modelo" value={selected.model} />
                                    <InfoItem label="Año" value={selected.year} />
                                    <InfoItem label="Patente" value={selected.plate} mono />
                                    <InfoItem label="Color" value={selected.color} />
                                    <InfoItem label="Combustible" value={selected.fuel} />
                                    <InfoItem label="Kilometraje" value={selected.mileage_km != null ? `${selected.mileage_km.toLocaleString('es-AR')} km` : null} />
                                    <InfoItem label="N° de motor" value={selected.engine_number} mono />
                                    <div className="col-span-2"><InfoItem label="N° de chasis (VIN)" value={selected.vin} mono /></div>
                                </div>

                                {hasNoInsurance(selected) && (
                                    <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-2 flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
                                        <AlertTriangle size={15} className="shrink-0" /> Este vehículo no tiene seguro cargado
                                    </div>
                                )}

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                                    <InfoItem label="Aseguradora" value={selected.insurance_company} />
                                    <InfoItem label="N° de póliza" value={selected.insurance_policy} mono />
                                    <ExpiryItem label="Vence seguro" date={selected.insurance_expiry} icon={ShieldCheck} />
                                    <ExpiryItem label="Vence VTV" date={selected.vtv_expiry} icon={ClipboardCheck} />
                                </div>

                                {selected.notes && (
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                        <p className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Notas</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selected.notes}</p>
                                    </div>
                                )}
                            </section>

                            {/* problemas */}
                            <section className="xl:col-span-3 flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="font-bold text-lg text-black dark:text-white flex items-center gap-2">
                                        <Wrench size={18} /> Problemas
                                    </h2>
                                    <button
                                        onClick={openAddProblem}
                                        className="flex items-center gap-1.5 border border-slate-300 dark:border-slate-600 text-black dark:text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    >
                                        <Plus size={15} /> Agregar
                                    </button>
                                </div>

                                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                                    {([
                                        ['Pendiente', `Pendientes (${pendingCount})`],
                                        ['Arreglado', `Arreglados (${fixedCount})`],
                                        ['Todos', `Todos (${selectedProblems.length})`],
                                    ] as [ProblemFilter, string][]).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => setFilter(key)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                                filter === key
                                                    ? 'bg-white dark:bg-gray-950 text-black dark:text-white shadow-sm'
                                                    : 'text-slate-500 hover:text-black dark:hover:text-white'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {visibleProblems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-600 gap-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                                        <CheckCircle2 size={36} strokeWidth={1} />
                                        <p className="text-sm">
                                            {filter === 'Pendiente' ? 'No hay problemas pendientes' : filter === 'Arreglado' ? 'Nada arreglado todavía' : 'No hay problemas registrados'}
                                        </p>
                                    </div>
                                ) : (
                                    <ul className="flex flex-col gap-2">
                                        {visibleProblems.map(p => {
                                            const fixed = p.status === 'Arreglado'
                                            return (
                                                <li
                                                    key={p.id}
                                                    className="group bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-3 items-start"
                                                >
                                                    <button
                                                        onClick={() => toggleProblem(p)}
                                                        disabled={loading}
                                                        title={fixed ? 'Marcar como pendiente' : 'Marcar como arreglado'}
                                                        className="mt-0.5 shrink-0 transition hover:scale-110 disabled:opacity-50"
                                                    >
                                                        {fixed
                                                            ? <CheckCircle2 size={22} className="text-green-600 dark:text-green-400" />
                                                            : <Circle size={22} className="text-slate-300 dark:text-slate-600 hover:text-green-500" />}
                                                    </button>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className={`font-semibold text-sm leading-tight ${fixed ? 'text-slate-400 line-through' : 'text-black dark:text-white'}`}>
                                                                {p.title}
                                                            </p>
                                                            <div className="flex gap-1 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition">
                                                                <button onClick={() => openEditProblem(p)} className="text-slate-400 hover:text-blue-500 transition p-1">
                                                                    <Pencil size={14} />
                                                                </button>
                                                                <button onClick={() => removeProblem(p.id)} className="text-slate-400 hover:text-red-500 transition p-1">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {p.description && (
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">{p.description}</p>
                                                        )}
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                                                            <span className={`px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[p.status]}`}>{p.status}</span>
                                                            <span>Detectado {fmtDate(p.reported_at)}</span>
                                                            {fixed && p.fixed_at && <span>Arreglado {fmtDate(p.fixed_at)}</span>}
                                                            {p.cost != null && <span>{fmtMoney(p.cost)}</span>}
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </section>
                        </div>
                    )}
                </>
            )}

            {showAddVehicle && (
                <VehicleModal
                    title="Nuevo vehículo"
                    form={vehicleForm}
                    setForm={setVehicleForm}
                    onSubmit={handleAddVehicle}
                    onClose={() => setShowAddVehicle(false)}
                    loading={loading}
                    submitLabel="Agregar vehículo"
                />
            )}
            {editVehicleOpen && (
                <VehicleModal
                    title="Editar vehículo"
                    form={vehicleForm}
                    setForm={setVehicleForm}
                    onSubmit={handleEditVehicle}
                    onClose={() => setEditVehicleOpen(false)}
                    loading={loading}
                    submitLabel="Guardar cambios"
                />
            )}
            {problemModal && (
                <ProblemModal
                    title={problemModal.mode === 'add' ? `Nuevo problema · ${selected?.name ?? ''}` : 'Editar problema'}
                    form={problemForm}
                    setForm={setProblemForm}
                    onSubmit={handleSubmitProblem}
                    onClose={() => setProblemModal(null)}
                    loading={loading}
                    submitLabel={problemModal.mode === 'add' ? 'Agregar problema' : 'Guardar cambios'}
                />
            )}
        </div>
    )
}
