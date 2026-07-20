import { fetchJobs } from '@/app/lib/data-server'
import { fetchExpenses, fetchSavingsProjects } from '@/app/lib/data-server'
import BudgetsClient from './BudgetsClient'

export default async function BudgetsPage() {
    const [jobs, expenses, savingsProjects] = await Promise.all([
        fetchJobs(),
        fetchExpenses(),
        fetchSavingsProjects(),
    ])

    return (
        <BudgetsClient
            jobs={jobs}
            expenses={expenses}
            savingsProjects={savingsProjects}
        />
    )
}
