'use client'
import { useState, useMemo } from 'react'
import { Dumbbell, Plus, X, Trash2, Pencil, Search, ListChecks, GripVertical } from 'lucide-react'
import { exerciseType, routineType, routineExerciseType } from '@/app/lib/definitions'
import MuscleGroups from '@/app/utils/muscleGroups'
import {
    postExercise, updateExercise, deleteExercise,
    postRoutine, updateRoutine, deleteRoutine,
    addRoutineExercise, updateRoutineExercise, removeRoutineExercise,
} from '@/app/lib/data-client'
import { useRouter } from 'next/navigation'

const MUSCLE_STYLES: Record<string, string> = {
    "Pecho": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    "Espalda": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    "Pierna": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    "Hombro": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Bíceps": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    "Tríceps": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400",
    "Core": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    "Glúteos": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    "Cardio": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400",
}

type ExerciseForm = { name: string; muscle_group: string; equipment: string; notes: string }
type RoutineForm = { name: string; description: string; active: boolean }

const EMPTY_EXERCISE: ExerciseForm = { name: '', muscle_group: MuscleGroups[0], equipment: '', notes: '' }
const EMPTY_ROUTINE: RoutineForm = { name: '', description: '', active: true }

function ExerciseModal({
    title, form, setForm, onSubmit, onClose, loading, submitLabel,
}: {
    title: string
    form: ExerciseForm
    setForm: React.Dispatch<React.SetStateAction<ExerciseForm>>
    onSubmit: (e: React.FormEvent) => void
    onClose: () => void
    loading: boolean
    submitLabel: string
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-lg text-black dark:text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-black dark:hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Nombre</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Ej: Press banca"
                            className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Grupo muscular</label>
                        <select
                            value={form.muscle_group}
                            onChange={e => setForm(f => ({ ...f, muscle_group: e.target.value }))}
                            className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        >
                            {MuscleGroups.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Equipo (opcional)</label>
                        <input
                            type="text"
                            value={form.equipment}
                            onChange={e => setForm(f => ({ ...f, equipment: e.target.value }))}
                            placeholder="Ej: Barra, mancuernas, máquina..."
                            className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Notas / técnica (opcional)</label>
                        <textarea
                            value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            className="w-full h-20 p-3 resize-none border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            placeholder="Ej: bajar controlado, codos a 45°..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !form.name.trim()}
                        className="mt-1 w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-40"
                    >
                        {loading ? 'Guardando...' : submitLabel}
                    </button>
                </form>
            </div>
        </div>
    )
}

function RoutineModal({
    title, form, setForm, onSubmit, onClose, loading, submitLabel,
}: {
    title: string
    form: RoutineForm
    setForm: React.Dispatch<React.SetStateAction<RoutineForm>>
    onSubmit: (e: React.FormEvent) => void
    onClose: () => void
    loading: boolean
    submitLabel: string
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-lg text-black dark:text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-black dark:hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Nombre</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Ej: Día de pecho y tríceps"
                            className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Descripción (opcional)</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full h-20 p-3 resize-none border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            placeholder="Ej: rutina de empuje, 2 veces por semana..."
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <input
                            type="checkbox"
                            checked={form.active}
                            onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                        />
                        Rutina activa
                    </label>
                    <button
                        type="submit"
                        disabled={loading || !form.name.trim()}
                        className="mt-1 w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-40"
                    >
                        {loading ? 'Guardando...' : submitLabel}
                    </button>
                </form>
            </div>
        </div>
    )
}

function RoutineBuilder({
    routine, entries, exercises, onClose, onChanged,
}: {
    routine: routineType
    entries: routineExerciseType[]
    exercises: exerciseType[]
    onClose: () => void
    onChanged: () => void
}) {
    const [muscleFilter, setMuscleFilter] = useState<string>(MuscleGroups[0])
    const [exerciseId, setExerciseId] = useState<string>('')
    const [sets, setSets] = useState('3')
    const [reps, setReps] = useState('8-12')
    const [saving, setSaving] = useState(false)

    const exercisesById = useMemo(() => {
        const map = new Map<string, exerciseType>()
        exercises.forEach(e => { if (e.id) map.set(e.id, e) })
        return map
    }, [exercises])

    const filteredExercises = exercises.filter(e => e.muscle_group === muscleFilter)
    const sortedEntries = [...entries].sort((a, b) => a.order - b.order)

    const handleAdd = async () => {
        if (!exerciseId || !routine.id) return
        setSaving(true)
        try {
            const nextOrder = sortedEntries.length > 0 ? Math.max(...sortedEntries.map(e => e.order)) + 1 : 1
            await addRoutineExercise({
                routine_id: routine.id,
                exercise_id: exerciseId,
                order: nextOrder,
                sets_target: sets ? Number(sets) : null,
                reps_target: reps || null,
            })
            setExerciseId('')
            onChanged()
        } finally {
            setSaving(false)
        }
    }

    const handleRemove = async (id?: string) => {
        if (!id) return
        await removeRoutineExercise(id)
        onChanged()
    }

    const handleFieldChange = async (id: string | undefined, fields: Partial<Pick<routineExerciseType, 'sets_target' | 'reps_target'>>) => {
        if (!id) return
        await updateRoutineExercise(id, fields)
        onChanged()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="font-bold text-lg text-black dark:text-white">{routine.name}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-black dark:hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>
                {routine.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{routine.description}</p>
                )}

                <div className="flex flex-col gap-2 mb-5">
                    {sortedEntries.length === 0 && (
                        <p className="text-sm text-slate-400 dark:text-slate-500 italic py-4 text-center">
                            Todavía no agregaste ejercicios a esta rutina.
                        </p>
                    )}
                    {sortedEntries.map(entry => {
                        const ex = exercisesById.get(entry.exercise_id)
                        return (
                            <div
                                key={entry.id}
                                className="flex items-center gap-3 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                            >
                                <GripVertical size={16} className="text-slate-300 dark:text-slate-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-black dark:text-white truncate">{ex?.name ?? 'Ejercicio eliminado'}</p>
                                    {ex && (
                                        <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${MUSCLE_STYLES[ex.muscle_group] ?? ''}`}>
                                            {ex.muscle_group}
                                        </span>
                                    )}
                                </div>
                                <input
                                    type="number"
                                    min={1}
                                    defaultValue={entry.sets_target ?? ''}
                                    onBlur={e => handleFieldChange(entry.id, { sets_target: e.target.value ? Number(e.target.value) : null })}
                                    className="w-14 text-sm text-center border border-slate-200 dark:border-slate-700 rounded px-1 py-1 bg-white dark:bg-gray-800 text-black dark:text-white"
                                    title="Series"
                                    placeholder="Series"
                                />
                                <span className="text-xs text-slate-400">x</span>
                                <input
                                    type="text"
                                    defaultValue={entry.reps_target ?? ''}
                                    onBlur={e => handleFieldChange(entry.id, { reps_target: e.target.value || null })}
                                    className="w-16 text-sm text-center border border-slate-200 dark:border-slate-700 rounded px-1 py-1 bg-white dark:bg-gray-800 text-black dark:text-white"
                                    title="Repeticiones"
                                    placeholder="Reps"
                                />
                                <button onClick={() => handleRemove(entry.id)} className="text-slate-400 hover:text-red-500 transition p-1">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        )
                    })}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Agregar ejercicio</p>
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={muscleFilter}
                            onChange={e => { setMuscleFilter(e.target.value); setExerciseId('') }}
                            className="border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
                        >
                            {MuscleGroups.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select
                            value={exerciseId}
                            onChange={e => setExerciseId(e.target.value)}
                            className="flex-1 min-w-[140px] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
                        >
                            <option value="">Seleccionar ejercicio</option>
                            {filteredExercises.length === 0 && <option disabled>No hay ejercicios en este grupo</option>}
                            {filteredExercises.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min={1}
                            value={sets}
                            onChange={e => setSets(e.target.value)}
                            className="w-16 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm text-center bg-white dark:bg-gray-800 text-black dark:text-white"
                            placeholder="Series"
                        />
                        <input
                            type="text"
                            value={reps}
                            onChange={e => setReps(e.target.value)}
                            className="w-20 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm text-center bg-white dark:bg-gray-800 text-black dark:text-white"
                            placeholder="Reps"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!exerciseId || saving}
                            className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition disabled:opacity-40"
                        >
                            <Plus size={15} /> Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function TrainingClient({
    exercises, routines, routineExercises,
}: {
    exercises: exerciseType[]
    routines: routineType[]
    routineExercises: routineExerciseType[]
}) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'catalogo' | 'rutinas'>('catalogo')

    // Catálogo state
    const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [showAddExercise, setShowAddExercise] = useState(false)
    const [editExerciseItem, setEditExerciseItem] = useState<exerciseType | null>(null)
    const [addExerciseForm, setAddExerciseForm] = useState<ExerciseForm>(EMPTY_EXERCISE)
    const [editExerciseForm, setEditExerciseForm] = useState<ExerciseForm>(EMPTY_EXERCISE)

    // Rutinas state
    const [showAddRoutine, setShowAddRoutine] = useState(false)
    const [editRoutineItem, setEditRoutineItem] = useState<routineType | null>(null)
    const [addRoutineForm, setAddRoutineForm] = useState<RoutineForm>(EMPTY_ROUTINE)
    const [editRoutineForm, setEditRoutineForm] = useState<RoutineForm>(EMPTY_ROUTINE)
    const [builderRoutine, setBuilderRoutine] = useState<routineType | null>(null)

    const [loading, setLoading] = useState(false)

    const countByMuscle = (m: string) => exercises.filter(e => e.muscle_group === m).length

    const filteredExercises = exercises
        .filter(e => selectedMuscle ? e.muscle_group === selectedMuscle : true)
        .filter(e => search.trim() ? e.name.toLowerCase().includes(search.toLowerCase()) : true)

    // ---- Exercise handlers ----
    const handleAddExercise = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!addExerciseForm.name.trim()) return
        setLoading(true)
        try {
            await postExercise(addExerciseForm)
            setAddExerciseForm(EMPTY_EXERCISE)
            setShowAddExercise(false)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const openEditExercise = (item: exerciseType) => {
        setEditExerciseItem(item)
        setEditExerciseForm({
            name: item.name,
            muscle_group: item.muscle_group,
            equipment: item.equipment ?? '',
            notes: item.notes ?? '',
        })
    }

    const handleEditExercise = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editExerciseItem?.id || !editExerciseForm.name.trim()) return
        setLoading(true)
        try {
            await updateExercise(editExerciseItem.id, editExerciseForm)
            setEditExerciseItem(null)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteExercise = async (id?: string) => {
        if (!id) return
        await deleteExercise(id)
        router.refresh()
    }

    // ---- Routine handlers ----
    const handleAddRoutine = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!addRoutineForm.name.trim()) return
        setLoading(true)
        try {
            await postRoutine(addRoutineForm)
            setAddRoutineForm(EMPTY_ROUTINE)
            setShowAddRoutine(false)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const openEditRoutine = (item: routineType) => {
        setEditRoutineItem(item)
        setEditRoutineForm({ name: item.name, description: item.description ?? '', active: item.active })
    }

    const handleEditRoutine = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editRoutineItem?.id || !editRoutineForm.name.trim()) return
        setLoading(true)
        try {
            await updateRoutine(editRoutineItem.id, editRoutineForm)
            setEditRoutineItem(null)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteRoutine = async (id?: string) => {
        if (!id) return
        await deleteRoutine(id)
        router.refresh()
    }

    return (
        <div className="w-full min-h-screen flex flex-col">
            <div className="px-4 md:px-6 pt-8 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">Gym</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {activeTab === 'catalogo' ? `${exercises.length} ejercicios en el catálogo` : `${routines.length} rutinas`}
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (activeTab === 'catalogo') {
                            setAddExerciseForm({ ...EMPTY_EXERCISE, muscle_group: selectedMuscle ?? MuscleGroups[0] })
                            setShowAddExercise(true)
                        } else {
                            setAddRoutineForm(EMPTY_ROUTINE)
                            setShowAddRoutine(true)
                        }
                    }}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">
                        {activeTab === 'catalogo' ? 'Agregar ejercicio' : 'Nueva rutina'}
                    </span>
                </button>
            </div>

            <div className="px-4 md:px-6 pb-4 flex gap-2">
                <button
                    onClick={() => setActiveTab('catalogo')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                        activeTab === 'catalogo'
                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <Dumbbell size={13} /> Catálogo
                </button>
                <button
                    onClick={() => setActiveTab('rutinas')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                        activeTab === 'rutinas'
                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <ListChecks size={13} /> Rutinas
                </button>
            </div>

            {activeTab === 'catalogo' ? (
                <>
                    <div className="px-4 md:px-6 pb-3">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar ejercicio..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>
                    </div>

                    <div className="md:hidden px-4 pb-4 overflow-x-auto">
                        <div className="flex gap-2 w-max">
                            <button
                                onClick={() => setSelectedMuscle(null)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                                    selectedMuscle === null
                                        ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                Todos · {exercises.length}
                            </button>
                            {MuscleGroups.map(m => (
                                <button
                                    key={m}
                                    onClick={() => setSelectedMuscle(m)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                                        selectedMuscle === m
                                            ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {m}{countByMuscle(m) > 0 ? ` · ${countByMuscle(m)}` : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-1 px-4 md:px-6 pb-10 gap-6">
                        <aside className="hidden md:block w-1/4 shrink-0">
                            <div className="sticky top-6 flex flex-col gap-1">
                                <button
                                    onClick={() => setSelectedMuscle(null)}
                                    className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                                        selectedMuscle === null
                                            ? 'bg-black dark:bg-white text-white dark:text-black'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-black dark:text-white'
                                    }`}
                                >
                                    <span>Todos</span>
                                    <span className="text-xs opacity-60">{exercises.length}</span>
                                </button>
                                <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
                                {MuscleGroups.map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setSelectedMuscle(m)}
                                        className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                                            selectedMuscle === m
                                                ? 'bg-black dark:bg-white text-white dark:text-black'
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-black dark:text-white'
                                        }`}
                                    >
                                        <span>{m}</span>
                                        {countByMuscle(m) > 0 && <span className="text-xs opacity-60">{countByMuscle(m)}</span>}
                                    </button>
                                ))}
                            </div>
                        </aside>

                        <div className="flex-1 min-w-0">
                            {filteredExercises.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-600 gap-2">
                                    <Dumbbell size={40} strokeWidth={1} />
                                    <p className="text-sm">No hay ejercicios aquí</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                    {filteredExercises.map(item => (
                                        <div
                                            key={item.id}
                                            className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                    <Dumbbell size={20} className="text-slate-600 dark:text-slate-300" />
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={() => openEditExercise(item)} className="text-slate-400 hover:text-blue-500 transition p-1">
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button onClick={() => handleDeleteExercise(item.id)} className="text-slate-400 hover:text-red-500 transition p-1">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-black dark:text-white leading-tight">{item.name}</p>
                                                {item.equipment && (
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.equipment}</p>
                                                )}
                                            </div>
                                            <span className={`self-start text-xs px-2 py-0.5 rounded-full font-medium ${MUSCLE_STYLES[item.muscle_group] ?? ''}`}>
                                                {item.muscle_group}
                                            </span>
                                            {item.notes && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.notes}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="px-4 md:px-6 pb-10">
                    {routines.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-600 gap-2">
                            <ListChecks size={40} strokeWidth={1} />
                            <p className="text-sm">Todavía no armaste ninguna rutina</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {routines.map(routine => {
                                const count = routineExercises.filter(re => re.routine_id === routine.id).length
                                return (
                                    <div
                                        key={routine.id}
                                        className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shrink-0">
                                                <ListChecks size={20} className="text-slate-600 dark:text-slate-300" />
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => openEditRoutine(routine)} className="text-slate-400 hover:text-blue-500 transition p-1">
                                                    <Pencil size={15} />
                                                </button>
                                                <button onClick={() => handleDeleteRoutine(routine.id)} className="text-slate-400 hover:text-red-500 transition p-1">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-black dark:text-white leading-tight">{routine.name}</p>
                                            {routine.description && (
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">{routine.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${routine.active ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                                                {routine.active ? 'Activa' : 'Inactiva'}
                                            </span>
                                            <span className="text-xs text-slate-400">{count} ejercicio{count !== 1 ? 's' : ''}</span>
                                        </div>
                                        <button
                                            onClick={() => setBuilderRoutine(routine)}
                                            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg text-xs font-medium hover:opacity-80 transition"
                                        >
                                            Editar ejercicios
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {showAddExercise && (
                <ExerciseModal
                    title="Nuevo ejercicio"
                    form={addExerciseForm}
                    setForm={setAddExerciseForm}
                    onSubmit={handleAddExercise}
                    onClose={() => setShowAddExercise(false)}
                    loading={loading}
                    submitLabel="Guardar ejercicio"
                />
            )}

            {editExerciseItem && (
                <ExerciseModal
                    title="Editar ejercicio"
                    form={editExerciseForm}
                    setForm={setEditExerciseForm}
                    onSubmit={handleEditExercise}
                    onClose={() => setEditExerciseItem(null)}
                    loading={loading}
                    submitLabel="Guardar cambios"
                />
            )}

            {showAddRoutine && (
                <RoutineModal
                    title="Nueva rutina"
                    form={addRoutineForm}
                    setForm={setAddRoutineForm}
                    onSubmit={handleAddRoutine}
                    onClose={() => setShowAddRoutine(false)}
                    loading={loading}
                    submitLabel="Guardar rutina"
                />
            )}

            {editRoutineItem && (
                <RoutineModal
                    title="Editar rutina"
                    form={editRoutineForm}
                    setForm={setEditRoutineForm}
                    onSubmit={handleEditRoutine}
                    onClose={() => setEditRoutineItem(null)}
                    loading={loading}
                    submitLabel="Guardar cambios"
                />
            )}

            {builderRoutine && (
                <RoutineBuilder
                    routine={builderRoutine}
                    entries={routineExercises.filter(re => re.routine_id === builderRoutine.id)}
                    exercises={exercises}
                    onClose={() => setBuilderRoutine(null)}
                    onChanged={() => router.refresh()}
                />
            )}
        </div>
    )
}
