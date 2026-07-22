import { PriceVisibilityProvider } from './PriceVisibilityContext'
import PriceToggleButton from './PriceToggleButton'

export default function BudgetsLayout({ children }: { children: React.ReactNode }) {
    return (
        <PriceVisibilityProvider>
            {children}
            <PriceToggleButton />
        </PriceVisibilityProvider>
    )
}
