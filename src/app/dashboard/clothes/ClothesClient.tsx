'use client'
import { useState } from 'react'
import { Shirt, Layers, Footprints, Crown, Wind, Tag, Plus, X, Trash2, Pencil, Search, type LucideIcon } from 'lucide-react'
import { clothesType } from '@/app/lib/definitions'
import ClothesCategories from '@/app/utils/clothesCategories'
import { postCloth, deleteCloth, updateCloth } from '@/app/lib/data-client'
import { useRouter } from 'next/navigation'

const CONDITIONS = ["Nuevo", "Gastado", "Muy desgastado"] as const

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "Remeras cortas": Shirt,
    "Remeras largas": Shirt,
    "Pantalones": Layers,
    "Zapatos": Footprints,
    "Buzos": Shirt,
    "Puloveres": Shirt,
    "Gorras": Crown,
    "Camperas livianas": Wind,
    "Camperas grandes": Wind,
}

const CONDITION_STYLES: Record<string, string> = {
    "Nuevo": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    "Gastado": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    "Muy desgastado": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
}

const EMPTY_FORM = { name: '', category: ClothesCategories[0], condition: 'Nuevo' as clothesType['condition'] }

type FormState = { name: string; category: string; condition: clothesType['condition'] }

function ClothModal({
    title, form, setForm, onSubmit, onClose, loading, submitLabel,
}: {
    title: string
    form: FormState
    setForm: React.Dispatch<React.SetStateAction<FormState>>
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
                            placeholder="Ej: Remera blanca basic"
                            className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Categoría</label>
                        <select
                            value={form.category}
                            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                            className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        >
                            {ClothesCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Estado</label>
                        <div className="flex gap-2">
                            {CONDITIONS.map(cond => (
                                <button
                                    type="button"
                                    key={cond}
                                    onClick={() => setForm(f => ({ ...f, condition: cond }))}
                                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                                        form.condition === cond
                                            ? CONDITION_STYLES[cond] + ' border-transparent'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {cond}
                                </button>
                            ))}
                        </div>
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

function CardsGrid({
    items,
    onEdit,
    onDelete,
}: {
    items: clothesType[]
    onEdit: (item: clothesType) => void
    onDelete: (id: string) => void
}) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-600 gap-2">
                <Tag size={40} strokeWidth={1} />
                <p className="text-sm">No hay prendas aquí</p>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {items.map(item => {
                const Icon = CATEGORY_ICONS[item.category] ?? Tag
                return (
                    <div
                        key={item.id}
                        className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                <Icon size={20} className="text-slate-600 dark:text-slate-300" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="text-slate-400 hover:text-blue-500 transition p-1"
                                >
                                    <Pencil size={15} />
                                </button>
                                <button
                                    onClick={() => item.id && onDelete(item.id)}
                                    className="text-slate-400 hover:text-red-500 transition p-1"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-black dark:text-white leading-tight">{item.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.category}</p>
                        </div>
                        <span className={`self-start text-xs px-2 py-0.5 rounded-full font-medium ${CONDITION_STYLES[item.condition]}`}>
                            {item.condition}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

export default function ClothesClient({ clothes }: { clothes: clothesType[] }) {
    const router = useRouter()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [showAdd, setShowAdd] = useState(false)
    const [editItem, setEditItem] = useState<clothesType | null>(null)
    const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM)
    const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM)
    const [loading, setLoading] = useState(false)

    const filtered = clothes
        .filter(c => selectedCategory ? c.category === selectedCategory : true)
        .filter(c => search.trim() ? c.name.toLowerCase().includes(search.toLowerCase()) : true)

    const countByCategory = (cat: string) => clothes.filter(c => c.category === cat).length

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!addForm.name.trim()) return
        setLoading(true)
        try {
            await postCloth(addForm)
            setAddForm(EMPTY_FORM)
            setShowAdd(false)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const openEdit = (item: clothesType) => {
        setEditItem(item)
        setEditForm({ name: item.name, category: item.category, condition: item.condition })
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editItem?.id || !editForm.name.trim()) return
        setLoading(true)
        try {
            await updateCloth(editItem.id, editForm)
            setEditItem(null)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        await deleteCloth(id)
        router.refresh()
    }

    const openAdd = () => {
        setAddForm({ ...EMPTY_FORM, category: selectedCategory ?? ClothesCategories[0] })
        setShowAdd(true)
    }

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Header */}
            <div className="px-4 md:px-6 pt-8 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">Ropa</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{clothes.length} prendas en total</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Agregar prenda</span>
                </button>
            </div>

            {/* Search bar */}
            <div className="px-4 md:px-6 pb-3">
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar prenda..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black dark:hover:text-white transition"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile: chips row */}
            <div className="md:hidden px-4 pb-4 overflow-x-auto">
                <div className="flex gap-2 w-max">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                            selectedCategory === null
                                ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        Todas · {clothes.length}
                    </button>
                    {ClothesCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                                selectedCategory === cat
                                    ? 'bg-black dark:bg-white text-white dark:text-black border-transparent'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {cat}{countByCategory(cat) > 0 ? ` · ${countByCategory(cat)}` : ''}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 px-4 md:px-6 pb-10 gap-6">
                {/* Desktop: category sidebar */}
                <aside className="hidden md:block w-1/4 shrink-0">
                    <div className="sticky top-6 flex flex-col gap-1">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                                selectedCategory === null
                                    ? 'bg-black dark:bg-white text-white dark:text-black'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-black dark:text-white'
                            }`}
                        >
                            <span>Todas</span>
                            <span className="text-xs opacity-60">{clothes.length}</span>
                        </button>
                        {ClothesCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                                    selectedCategory === cat
                                        ? 'bg-black dark:bg-white text-white dark:text-black'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-black dark:text-white'
                                }`}
                            >
                                <span>{cat}</span>
                                {countByCategory(cat) > 0 && (
                                    <span className="text-xs opacity-60">{countByCategory(cat)}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Cards grid */}
                <div className="flex-1 min-w-0">
                    <CardsGrid items={filtered} onEdit={openEdit} onDelete={handleDelete} />
                </div>
            </div>

            {showAdd && (
                <ClothModal
                    title="Nueva prenda"
                    form={addForm}
                    setForm={setAddForm}
                    onSubmit={handleAdd}
                    onClose={() => setShowAdd(false)}
                    loading={loading}
                    submitLabel="Guardar prenda"
                />
            )}

            {editItem && (
                <ClothModal
                    title="Editar prenda"
                    form={editForm}
                    setForm={setEditForm}
                    onSubmit={handleEdit}
                    onClose={() => setEditItem(null)}
                    loading={loading}
                    submitLabel="Guardar cambios"
                />
            )}
        </div>
    )
}
