'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function MobileHeader() {
    const { theme, setTheme } = useTheme()
    return (
        <div className="md:hidden w-full flex items-center justify-end gap-2 px-4 pt-4 pb-2">
            <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
                {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
                href="/logout"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
                <LogOut size={18} />
            </Link>
        </div>
    )
}
