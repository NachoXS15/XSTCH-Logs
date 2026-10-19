import { fetchExercises, fetchRoutines, fetchRoutineExercises } from '@/app/lib/data-server'
import TrainingClient from './TrainingClient'

export default async function TrainingPage() {
    const [exercises, routines, routineExercises] = await Promise.all([
        fetchExercises(),
        fetchRoutines(),
        fetchRoutineExercises(),
    ])
    return <TrainingClient exercises={exercises} routines={routines} routineExercises={routineExercises} />
}
