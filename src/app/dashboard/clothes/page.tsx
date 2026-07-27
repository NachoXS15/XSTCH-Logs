import { fetchClothes } from '@/app/lib/data-server'
import ClothesClient from './ClothesClient'

export default async function ClothesPage() {
    const clothes = await fetchClothes()
    return <ClothesClient clothes={clothes} />
}
