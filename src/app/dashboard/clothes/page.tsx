import { fetchClothes, fetchOutfits } from '@/app/lib/data-server'
import ClothesClient from './ClothesClient'

export default async function ClothesPage() {
    const [clothes, outfits] = await Promise.all([fetchClothes(), fetchOutfits()])
    return <ClothesClient clothes={clothes} outfits={outfits} />
}
