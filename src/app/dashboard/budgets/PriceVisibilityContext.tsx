'use client'

import { createContext, useContext, useState } from 'react'

interface PriceVisibilityContextType {
    showPrices: boolean
    toggle: () => void
}

const PriceVisibilityContext = createContext<PriceVisibilityContextType>({
    showPrices: false,
    toggle: () => {},
})

export function PriceVisibilityProvider({ children }: { children: React.ReactNode }) {
    const [showPrices, setShowPrices] = useState(false)
    return (
        <PriceVisibilityContext.Provider value={{ showPrices, toggle: () => setShowPrices(p => !p) }}>
            {children}
        </PriceVisibilityContext.Provider>
    )
}

export const usePriceVisibility = () => useContext(PriceVisibilityContext)
