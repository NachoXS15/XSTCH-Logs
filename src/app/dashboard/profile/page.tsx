import { fetchProfile, fetchBodyMeasurements } from '@/app/lib/data-server'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
    const [profile, measurements] = await Promise.all([
        fetchProfile(),
        fetchBodyMeasurements(),
    ])
    return <ProfileClient profile={profile} measurements={measurements} />
}
