import { fetchVehicles, fetchVehicleProblems } from '@/app/lib/data-server'
import VehiclesClient from './VehiclesClient'

export default async function VehiclesPage() {
    const [vehicles, problems] = await Promise.all([fetchVehicles(), fetchVehicleProblems()])
    return <VehiclesClient vehicles={vehicles} problems={problems} />
}
