import Link from 'next/link'
import { UserRound, Ruler, Droplet, Phone, ShieldAlert, HeartPulse, Pill, Scale } from 'lucide-react'
import { profileType, bodyMeasurementType } from '@/app/lib/definitions'

function calcAge(birthDate?: string | null): number | null {
    if (!birthDate) return null
    const b = new Date(birthDate)
    if (Number.isNaN(b.getTime())) return null
    const today = new Date()
    let age = today.getFullYear() - b.getFullYear()
    const m = today.getMonth() - b.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--
    return age
}

function InfoRow({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Icon size={15} className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <span className="min-w-0 break-words">{children}</span>
        </div>
    )
}

export default function ProfileAside({
    profile, lastWeight,
}: {
    profile: profileType | null
    lastWeight?: number | null
}) {
    const age = calcAge(profile?.birth_date)

    return (
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-10 flex flex-col gap-4">
            <div className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-sm">
                    {profile?.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <UserRound size={52} className="text-slate-400 dark:text-slate-500" />
                    )}
                </div>

                {profile?.full_name ? (
                    <>
                        <div>
                            <h2 className="text-lg font-bold text-black dark:text-white leading-tight">{profile.full_name}</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {age != null && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium">
                                    {age} años
                                </span>
                            )}
                            {profile.height_cm != null && (
                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium">
                                    <Ruler size={11} /> {profile.height_cm} cm
                                </span>
                            )}
                            {profile.blood_type && (
                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium">
                                    <Droplet size={11} /> {profile.blood_type}
                                </span>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Todavía no cargaste tu perfil</p>
                )}

                <Link
                    href="/dashboard/profile"
                    className="w-full mt-1 border border-slate-300 dark:border-slate-600 text-black dark:text-white py-1.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                    {profile?.full_name ? 'Editar perfil' : 'Completar perfil'}
                </Link>
            </div>

            {profile?.full_name && (
                <div className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-3">
                    {(profile.emergency_contact_name || profile.emergency_contact_phone) && (
                        <InfoRow icon={Phone}>
                            {[profile.emergency_contact_name, profile.emergency_contact_phone].filter(Boolean).join(' · ')}
                        </InfoRow>
                    )}
                    {profile.allergies && <InfoRow icon={ShieldAlert}>{profile.allergies}</InfoRow>}
                    {profile.chronic_conditions && <InfoRow icon={HeartPulse}>{profile.chronic_conditions}</InfoRow>}
                    {profile.medications && <InfoRow icon={Pill}>{profile.medications}</InfoRow>}
                    {lastWeight != null && <InfoRow icon={Scale}>Último peso: {lastWeight} kg</InfoRow>}
                    {!profile.emergency_contact_name && !profile.emergency_contact_phone && !profile.allergies && !profile.chronic_conditions && !profile.medications && lastWeight == null && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">Sin datos de salud cargados</p>
                    )}
                </div>
            )}
        </aside>
    )
}
