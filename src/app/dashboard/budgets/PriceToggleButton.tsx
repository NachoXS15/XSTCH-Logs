'use client'

import { EyeIcon, EyeClosedIcon } from 'lucide-react'
import { usePriceVisibility } from './PriceVisibilityContext'

export default function PriceToggleButton() {
    const { showPrices, toggle } = usePriceVisibility()
    return (
        <button
            onClick={toggle}
            title={showPrices ? 'Ocultar precios' : 'Mostrar precios'}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 pl-3 pr-4 py-2.5 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm font-medium"
        >
            {showPrices
                ? <EyeIcon size={15} className="shrink-0" />
                : <EyeClosedIcon size={15} className="shrink-0" />
            }
            <span className="hidden sm:inline">{showPrices ? 'Ocultar' : 'Mostrar'} precios</span>
        </button>
    )
}
