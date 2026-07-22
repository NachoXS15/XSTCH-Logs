import { fetchSavingsProjectById, fetchProjectContributions, fetchProjectExpenses, fetchJobs } from '@/app/lib/data-server'
import ProjectClient from './ProjectClient'
import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'
import { InferGetServerSidePropsType } from 'next'
import { getServerSideProps } from 'next/dist/build/templates/pages'

export default async function ProjectPage({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) redirect('/login')

    const { id } = await params

    const [project, contributions, projectExpenses, jobs] = await Promise.all([
        fetchSavingsProjectById(id),
        fetchProjectContributions(id),
        fetchProjectExpenses(id),
        fetchJobs(),
    ])

    if (!project) redirect('/dashboard/budgets')

    return (
        <ProjectClient
            project={project}
            contributions={contributions}
            projectExpenses={projectExpenses}
            jobs={jobs}
        />
    )
}
