'use client'
import { useState, useCallback, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
    UserRound, HeartPulse, Scale, Trash2, Plus, Pencil, Camera, Phone,
    Ruler, Droplet, ShieldAlert, Pill, StickyNote, X, Loader2,
} from 'lucide-react'
import { profileType, bodyMeasurementType } from '@/app/lib/definitions'
import { upsertProfile, uploadProfilePhoto, postBodyMeasurement, deleteBodyMeasurement } from '@/app/lib/data-client'
import { useRouter } from 'next/navigation'

type ProfileForm = {
    full_name: string
    birth_date: string
    height_cm: string
    blood_type: string
    emergency_contact_name: string
    emergency_contact_phone: string
    allergies: string
    chronic_conditions: string
    medications: string
    medical_notes: string
}

const emptyForm = (p: profileType | null): ProfileForm => ({
    full_name: p?.full_name ?? '',
    birth_date: p?.birth_date ?? '',
    height_cm: p?.height_cm != null ? String(p.height_cm) : '',
    blood_type: p?.blood_type ?? '',
    emergency_contact_name: p?.emergency_contact_name ?? '',
    emergency_contact_phone: p?.emergency_contact_phone ?? '',
    allergies: p?.allergies ?? '',
    chronic_conditions: p?.chronic_conditions ?? '',
    medications: p?.medications ?? '',
    medical_notes: p?.medical_notes ?? '',
})

const formToPayload = (form: ProfileForm, photo_url?: string | null) => ({
    full_name: form.full_name,
    photo_url: photo_url ?? null,
    birth_date: form.birth_date || null,
    height_cm: form.height_cm ? Number(form.height_cm) : null,
    blood_type: form.blood_type || null,
    emergency_contact_name: form.emergency_contact_name || null,
    emergency_contact_phone: form.emergency_contact_phone || null,
    allergies: form.allergies || null,
    chronic_conditions: form.chronic_conditions || null,
    medications: form.medications || null,
    medical_notes: form.medical_notes || null,
})

function calcAge(birthDate?: string | null): number | null {
    if (!birthDate) return null
    const b = new Date(birthDate)
    if (Number.isNaN(b.getTime())) return null
    const today = new Date()
    let age = today.getFullYear() - b.getFullYear()
    const m = today.getMonth() - b.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--
    return age
}

const inputClass = "border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white w-full"
const labelClass = "text-xs font-medium text-slate-500 dark:text-slate-400"

function EditProfileModal({
    form, setForm, onSubmit, onClose, loading,
}: {
    form: ProfileForm
    setForm: React.Dispatch<React.SetStateAction<ProfileForm>>
    onSubmit: (e: React.FormEvent) => void
    onClose: () => void
    loading: boolean
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-lg text-black dark:text-white">Editar perfil</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-black dark:hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Nombre completo</label>
                            <input className={inputClass} value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Ej: Ignacio Pantoja" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Fecha de nacimiento</label>
                            <input type="date" className={inputClass} value={form.birth_date} onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Altura (cm)</label>
                            <input type="number" className={inputClass} value={form.height_cm} onChange={e => setForm(f => ({ ...f, height_cm: e.target.value }))} placeholder="Ej: 178" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Grupo sanguíneo</label>
                            <input className={inputClass} value={form.blood_type} onChange={e => setForm(f => ({ ...f, blood_type: e.target.value }))} placeholder="Ej: O+" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Contacto de emergencia</label>
                            <input className={inputClass} value={form.emergency_contact_name} onChange={e => setForm(f => ({ ...f, emergency_contact_name: e.target.value }))} placeholder="Nombre" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Teléfono de emergencia</label>
                            <input className={inputClass} value={form.emergency_contact_phone} onChange={e => setForm(f => ({ ...f, emergency_contact_phone: e.target.value }))} placeholder="Ej: +54 9 ..." />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <HeartPulse size={16} className="text-red-500" />
                        <p className="text-sm font-semibold text-black dark:text-white">Salud</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Alergias</label>
                            <textarea className={`${inputClass} h-20 resize-none`} value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} placeholder="Ej: penicilina, polen..." />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Condiciones crónicas</label>
                            <textarea className={`${inputClass} h-20 resize-none`} value={form.chronic_conditions} onChange={e => setForm(f => ({ ...f, chronic_conditions: e.target.value }))} placeholder="Ej: asma, hipertensión..." />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Medicación habitual</label>
                            <textarea className={`${inputClass} h-20 resize-none`} value={form.medications} onChange={e => setForm(f => ({ ...f, medications: e.target.value }))} placeholder="Ej: ..." />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className={labelClass}>Notas médicas</label>
                            <textarea className={`${inputClass} h-20 resize-none`} value={form.medical_notes} onChange={e => setForm(f => ({ ...f, medical_notes: e.target.value }))} placeholder="Cualquier otra info relevante" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !form.full_name.trim()}
                        className="mt-1 w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-40"
                    >
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </form>
            </div>
        </div>
    )
}

function InfoBlock({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
    if (!value) return null
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={15} className="text-slate-500 dark:text-slate-400" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words">{value}</p>
            </div>
        </div>
    )
}

export default function ProfileClient({
    profile, measurements,
}: {
    profile: profileType | null
    measurements: bodyMeasurementType[]
}) {
    const router = useRouter()
    const [showEdit, setShowEdit] = useState(false)
    const [form, setForm] = useState<ProfileForm>(emptyForm(profile))
    const [saving, setSaving] = useState(false)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10))
    const [newWeight, setNewWeight] = useState('')
    const [addingWeight, setAddingWeight] = useState(false)

    const openEdit = () => {
        setForm(emptyForm(profile))
        setShowEdit(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.full_name.trim()) return
        setSaving(true)
        try {
            await upsertProfile(profile?.id, formToPayload(form, profile?.photo_url))
            setShowEdit(false)
            router.refresh()
        } finally {
            setSaving(false)
        }
    }

    const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return
        setUploadingPhoto(true)
        try {
            const photo_url = await uploadProfilePhoto(file)
            if (profile) {
                await upsertProfile(profile.id, formToPayload(emptyForm(profile), photo_url))
            } else {
                await upsertProfile(undefined, formToPayload({ ...emptyForm(null), full_name: 'Nacho' }, photo_url))
            }
            router.refresh()
        } finally {
            setUploadingPhoto(false)
        }
    }

    const handleAddWeight = async () => {
        if (!newWeight || !newDate) return
        setAddingWeight(true)
        try {
            await postBodyMeasurement({ date: newDate, weight_kg: Number(newWeight) })
            setNewWeight('')
            router.refresh()
        } finally {
            setAddingWeight(false)
        }
    }

    const handleDeleteWeight = async (id?: string) => {
        if (!id) return
        await deleteBodyMeasurement(id)
        router.refresh()
    }

    const ChartTooltip = useCallback(({ active, payload }: { active?: boolean; payload?: { payload: bodyMeasurementType }[] }) => {
        if (!active || !payload?.length) return null
        const p = payload[0].payload
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-lg text-sm">
                <p className="font-medium text-slate-700 dark:text-slate-200">{p.date}</p>
                <p className="text-slate-500 dark:text-slate-400">{p.weight_kg} kg</p>
            </div>
        )
    }, [])

    const sortedMeasurements = [...measurements].sort((a, b) => a.date.localeCompare(b.date))
    const lastWeight = sortedMeasurements.at(-1)?.weight_kg
    const age = calcAge(profile?.birth_date)

    const hasHealthInfo = !!(profile?.allergies || profile?.chronic_conditions || profile?.medications || profile?.medical_notes)
    const hasEmergencyContact = !!(profile?.emergency_contact_name || profile?.emergency_contact_phone)

    return (
        <div className="w-full min-h-screen flex flex-col px-4 md:px-6 py-8 gap-6 max-w-3xl">

            {/* ── Card principal de perfil ── */}
            <div className="relative bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                <button
                    onClick={openEdit}
                    className="absolute top-4 right-4 text-slate-400 hover:text-black dark:hover:text-white transition p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Editar perfil"
                >
                    <Pencil size={16} />
                </button>

                <div className="relative shrink-0">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-sm">
                        {profile?.photo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <UserRound size={48} className="text-slate-400 dark:text-slate-500" />
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md hover:opacity-80 transition disabled:opacity-50"
                        title="Cambiar foto"
                    >
                        {uploadingPhoto ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelected} />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-2">
                    {profile?.full_name ? (
                        <>
                            <h1 className="text-xl font-bold text-black dark:text-white">{profile.full_name}</h1>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                {age != null && (
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium">
                                        {age} años
                                    </span>
                                )}
                                {profile.height_cm != null && (
                                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium">
                                        <Ruler size={11} /> {profile.height_cm} cm
                                    </span>
                                )}
                                {profile.blood_type && (
                                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium">
                                        <Droplet size={11} /> {profile.blood_type}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-xl font-bold text-black dark:text-white">Sin perfil cargado</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Completá tus datos personales y de salud.</p>
                            <button
                                onClick={openEdit}
                                className="mt-1 self-center sm:self-start bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition w-fit"
                            >
                                Completar perfil
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ── Contacto de emergencia ── */}
            {hasEmergencyContact && (
                <div className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Phone size={16} className="text-blue-500" />
                        <p className="text-sm font-semibold text-black dark:text-white">Contacto de emergencia</p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        {profile?.emergency_contact_name && (
                            <div>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Nombre</p>
                                <p className="text-sm text-slate-700 dark:text-slate-200">{profile.emergency_contact_name}</p>
                            </div>
                        )}
                        {profile?.emergency_contact_phone && (
                            <div>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Teléfono</p>
                                <p className="text-sm text-slate-700 dark:text-slate-200">{profile.emergency_contact_phone}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Salud ── */}
            {hasHealthInfo && (
                <div className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <HeartPulse size={16} className="text-red-500" />
                        <p className="text-sm font-semibold text-black dark:text-white">Salud</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoBlock icon={ShieldAlert} label="Alergias" value={profile?.allergies} />
                        <InfoBlock icon={HeartPulse} label="Condiciones crónicas" value={profile?.chronic_conditions} />
                        <InfoBlock icon={Pill} label="Medicación habitual" value={profile?.medications} />
                        <InfoBlock icon={StickyNote} label="Notas médicas" value={profile?.medical_notes} />
                    </div>
                </div>
            )}

            {/* ── Evolución de peso ── */}
            <div className="flex flex-col gap-4 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Scale size={16} className="text-blue-500" />
                        <p className="text-sm font-semibold text-black dark:text-white">Evolución de peso</p>
                    </div>
                    {lastWeight != null && (
                        <span className="text-xs text-slate-400">Último registro: {lastWeight} kg</span>
                    )}
                </div>

                {sortedMeasurements.length > 1 && (
                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sortedMeasurements} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                                <Tooltip content={<ChartTooltip />} />
                                <Line type="monotone" dataKey="weight_kg" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="flex flex-wrap items-end gap-2">
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Fecha</label>
                        <input type="date" className={inputClass} value={newDate} onChange={e => setNewDate(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Peso (kg)</label>
                        <input type="number" step="0.1" className={`${inputClass} w-28`} value={newWeight} onChange={e => setNewWeight(e.target.value)} placeholder="Ej: 78.5" />
                    </div>
                    <button
                        onClick={handleAddWeight}
                        disabled={!newWeight || addingWeight}
                        className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-40"
                    >
                        <Plus size={15} /> Registrar
                    </button>
                </div>

                {sortedMeasurements.length > 0 && (
                    <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                        {[...sortedMeasurements].reverse().map(m => (
                            <div key={m.id} className="flex items-center justify-between text-sm border-b border-slate-100 dark:border-slate-800 py-1.5">
                                <span className="text-slate-600 dark:text-slate-300">{m.date}</span>
                                <span className="text-black dark:text-white font-medium">{m.weight_kg} kg</span>
                                <button onClick={() => handleDeleteWeight(m.id)} className="text-slate-400 hover:text-red-500 transition p-1">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showEdit && (
                <EditProfileModal
                    form={form}
                    setForm={setForm}
                    onSubmit={handleSave}
                    onClose={() => setShowEdit(false)}
                    loading={saving}
                />
            )}
        </div>
    )
}
