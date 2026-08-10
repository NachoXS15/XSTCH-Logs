export const CATEGORIES = ['servicios', 'comida', 'transporte', 'educacion', 'entretenimiento', 'otros'] as const

export type ExpenseCategory = typeof CATEGORIES[number]

export const CATEGORY_COLORS: Record<string, string> = {
    alquiler: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    servicios: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
    comida: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    transporte: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
    salud: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    educacion: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    entretenimiento: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
    otros: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
}

export const inputClass = 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-slate-400'
export const btnPrimary = 'text-sm bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors disabled:opacity-50'
export const btnGhost = 'text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-2 transition-colors'

export function parsePayDay(v: string): number | null {
    if (!v) return null
    const n = Math.floor(Number(v))
    if (!Number.isFinite(n) || n < 1 || n > 31) return null
    return n
}
