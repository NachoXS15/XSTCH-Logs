import { supabaseClient } from '../utils/supabase/client';
import {clientType, jobsType, studentType, expenseType, savingsProjectType, clothesType, outfitType, profileType, bodyMeasurementType, exerciseType, routineType, routineExerciseType, vehicleType, vehicleProblemType} from './definitions';


const postClient = async ({
    client_name,
    price,
    status,
    egreso,
    obvs,
    payment,
    place,
    service,
}: clientType) => {
    try {
        const { data, error } = await supabaseClient
            .from("clients")
            .insert([
                {
                    client_name,
                    price,
                    place,
                    service,
                    egreso,
                    payment,
                    status,
                    obvs,
                },
            ])
            .select();
            console.log({ data, error });
        if (error) {
            throw error;
        }

        console.log("Cliente insertado:", data);
        return data;
    } catch (error) {
        console.error("Error al insertar cliente:", error);
        throw error;
    }
};


const postStudent = async ({
    student_name,
    materia,
    type,
    price,
    payment,
    condition,
    grade,
    date,
}: studentType) => {
    try {
        const { data, error } = await supabaseClient
            .from("students")
            .insert([
                {
                    student_name,
                    materia,
                    type,
                    price,
                    payment,
                    condition,
                    grade,
                    date,
                },
            ])
            .select();
            console.log({ data, error });
        if (error) {
            throw error;
        }

        console.log("Alumno insertado:", data);
        return data;
    } catch (error) {
        console.error("Error al insertar alumno:", error);
        throw error;
    }
};

const postJob = async ({
    client_name,
    price,
    active,
    account,
    date,
    obvs,
    pay_method,
    partner,
    partner_name
}: jobsType) => {
    try {
        const { data, error } = await supabaseClient
            .from("jobs")
            .insert([
                {
                    client_name,
                    price,
                    active,
                    account,
                    date,
                    obvs,
                    pay_method,
                    partner,
                    partner_name
                },
            ])
            .select();
            console.log({ data, error });
        if (error) {
            throw error;
        }

        console.log("Trabajo insertado:", data);
        return data;
    } catch (error) {
        console.error("Error al insertar Trabajo:", error);
        throw error;
    }
};

const logSupabaseError = (label: string, error: unknown) => {
    if (error && typeof error === 'object' && 'message' in error) {
        console.error(`${label} — code: ${'code' in error ? error.code : '?'}, message: ${(error as { message: string }).message}`)
    } else {
        console.error(label, error)
    }
}

const postExpense = async ({ name, amount, category, active, pay_day }: expenseType) => {
    const { data, error } = await supabaseClient
        .from("expenses")
        .insert([{ name, amount, category, active, pay_day: pay_day ?? null }])
        .select();
    console.log({ data, error });
    if (error) {
        logSupabaseError("Error al insertar gasto:", error);
        throw error;
    }
    return data;
}

const deleteExpense = async (id: string) => {
    const { error } = await supabaseClient.from("expenses").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al eliminar gasto:", error);
        throw error;
    }
}

const toggleExpense = async (id: string, active: boolean) => {
    const { error } = await supabaseClient.from("expenses").update({ active }).eq("id", id);
    if (error) {
        logSupabaseError("Error al actualizar gasto:", error);
        throw error;
    }
}

const postSavingsProject = async ({ name, goal_amount, current_amount, description, deadline }: savingsProjectType) => {
    const { data, error } = await supabaseClient
        .from("savings_projects")
        .insert([{ name, goal_amount, current_amount, description, deadline: deadline || null }])
        .select();
    console.log({ data, error });
    if (error) {
        logSupabaseError("Error al insertar proyecto:", error);
        throw error;
    }
    return data;
}

const deleteSavingsProject = async (id: string) => {
    const { error } = await supabaseClient.from("savings_projects").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al eliminar proyecto:", error);
        throw error;
    }
}

const updateSavingsAmount = async (id: string, current_amount: number) => {
    const { error } = await supabaseClient.from("savings_projects").update({ current_amount }).eq("id", id);
    if (error) {
        logSupabaseError("Error al actualizar ahorro:", error);
        throw error;
    }
}

const updateExpense = async (id: string, fields: Pick<expenseType, 'name' | 'amount' | 'category' | 'pay_day'>) => {
    const { error } = await supabaseClient.from("expenses").update(fields).eq("id", id);
    if (error) {
        logSupabaseError("Error al editar gasto:", error);
        throw error;
    }
}

const addProjectContribution = async (project_id: string, amount: number, note: string, new_current: number) => {
    const { data, error } = await supabaseClient
        .from("project_contributions")
        .insert([{ project_id, amount, note: note || null }])
        .select()
    if (error) { logSupabaseError("Error al agregar ingreso:", error); throw error }
    const { error: e2 } = await supabaseClient.from("savings_projects").update({ current_amount: new_current }).eq("id", project_id)
    if (e2) { logSupabaseError("Error al actualizar monto:", e2); throw e2 }
    return data
}

const deleteProjectContribution = async (id: string, project_id: string, new_current: number) => {
    const { error } = await supabaseClient.from("project_contributions").delete().eq("id", id)
    if (error) { logSupabaseError("Error al eliminar ingreso:", error); throw error }
    const { error: e2 } = await supabaseClient.from("savings_projects").update({ current_amount: new_current }).eq("id", project_id)
    if (e2) { logSupabaseError("Error al actualizar monto:", e2); throw e2 }
}

const addProjectExpense = async (project_id: string, name: string, amount: number, note: string, new_current: number) => {
    const { data, error } = await supabaseClient
        .from("project_expenses")
        .insert([{ project_id, name, amount, note: note || null }])
        .select()
    if (error) { logSupabaseError("Error al agregar egreso:", error); throw error }
    const { error: e2 } = await supabaseClient.from("savings_projects").update({ current_amount: new_current }).eq("id", project_id)
    if (e2) { logSupabaseError("Error al actualizar monto:", e2); throw e2 }
    return data
}

const deleteProjectExpense = async (id: string, project_id: string, new_current: number) => {
    const { error } = await supabaseClient.from("project_expenses").delete().eq("id", id)
    if (error) { logSupabaseError("Error al eliminar egreso:", error); throw error }
    const { error: e2 } = await supabaseClient.from("savings_projects").update({ current_amount: new_current }).eq("id", project_id)
    if (e2) { logSupabaseError("Error al actualizar monto:", e2); throw e2 }
}

const updateProject = async (id: string, fields: { name?: string; goal_amount?: number; description?: string; deadline?: string | null }) => {
    const { error } = await supabaseClient.from("savings_projects").update(fields).eq("id", id)
    if (error) { logSupabaseError("Error al actualizar proyecto:", error); throw error }
}

const postCloth = async ({ name, category, condition }: clothesType) => {
    const { data, error } = await supabaseClient
        .from("clothes")
        .insert([{ name, category, condition }])
        .select();
    if (error) {
        logSupabaseError("Error al insertar prenda:", error);
        throw error;
    }
    return data;
}

const deleteCloth = async (id: string) => {
    const { error } = await supabaseClient.from("clothes").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al eliminar prenda:", error);
        throw error;
    }
}

const updateCloth = async (id: string, fields: Partial<Pick<clothesType, 'name' | 'category' | 'condition'>>) => {
    const { error } = await supabaseClient.from("clothes").update(fields).eq("id", id);
    if (error) {
        logSupabaseError("Error al actualizar prenda:", error);
        throw error;
    }
}

const postOutfit = async ({ name, top_id, bottom_id, shoes_id }: outfitType) => {
    const { data, error } = await supabaseClient
        .from("outfits")
        .insert([{ name, top_id, bottom_id, shoes_id }])
        .select();
    if (error) {
        logSupabaseError("Error al insertar conjunto:", error);
        throw error;
    }
    return data;
}

const deleteOutfit = async (id: string) => {
    const { error } = await supabaseClient.from("outfits").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al eliminar conjunto:", error);
        throw error;
    }
}

const updateOutfit = async (id: string, fields: Partial<Pick<outfitType, 'name' | 'top_id' | 'bottom_id' | 'shoes_id'>>) => {
    const { error } = await supabaseClient.from("outfits").update(fields).eq("id", id);
    if (error) {
        logSupabaseError("Error al actualizar conjunto:", error);
        throw error;
    }
}

// ---- Perfil personal ----
const upsertProfile = async (id: string | undefined, fields: Omit<profileType, 'id' | 'updated_at'>) => {
    const payload = { ...fields, updated_at: new Date().toISOString() }
    if (id) {
        const { error } = await supabaseClient.from("profile").update(payload).eq("id", id);
        if (error) {
            logSupabaseError("Error al actualizar perfil:", error);
            throw error;
        }
        return
    }
    const { data, error } = await supabaseClient.from("profile").insert([payload]).select();
    if (error) {
        logSupabaseError("Error al crear perfil:", error);
        throw error;
    }
    return data;
}

const postBodyMeasurement = async ({ date, weight_kg, notes }: bodyMeasurementType) => {
    const { data, error } = await supabaseClient
        .from("body_measurements")
        .insert([{ date, weight_kg, notes: notes || null }])
        .select();
    if (error) {
        logSupabaseError("Error al registrar peso:", error);
        throw error;
    }
    return data;
}

const uploadProfilePhoto = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `profile.${ext}`
    const { error } = await supabaseClient.storage
        .from('avatars')
        .upload(path, file, { upsert: true, cacheControl: '3600' })
    if (error) {
        logSupabaseError("Error al subir la foto:", error)
        throw error
    }
    const { data } = supabaseClient.storage.from('avatars').getPublicUrl(path)
    return `${data.publicUrl}?t=${Date.now()}`
}

const deleteBodyMeasurement = async (id: string) => {
    const { error } = await supabaseClient.from("body_measurements").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al eliminar registro de peso:", error);
        throw error;
    }
}

// ---- Gym ----
const postExercise = async ({ name, muscle_group, equipment, notes }: exerciseType) => {
    const { data, error } = await supabaseClient
        .from("exercises")
        .insert([{ name, muscle_group, equipment: equipment || null, notes: notes || null }])
        .select();
    if (error) {
        logSupabaseError("Error al insertar ejercicio:", error);
        throw error;
    }
    return data;
}

const updateExercise = async (id: string, fields: Partial<Pick<exerciseType, 'name' | 'muscle_group' | 'equipment' | 'notes'>>) => {
    const { error } = await supabaseClient.from("exercises").update(fields).eq("id", id);
    if (error) {
        logSupabaseError("Error al actualizar ejercicio:", error);
        throw error;
    }
}

const deleteExercise = async (id: string) => {
    const { error } = await supabaseClient.from("exercises").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al eliminar ejercicio:", error);
        throw error;
    }
}

const postRoutine = async ({ name, description, active }: routineType) => {
    const { data, error } = await supabaseClient
        .from("routines")
        .insert([{ name, description: description || null, active }])
        .select();
    if (error) {
        logSupabaseError("Error al crear rutina:", error);
        throw error;
    }
    return data;
}

const updateRoutine = async (id: string, fields: Partial<Pick<routineType, 'name' | 'description' | 'active'>>) => {
    const { error } = await supabaseClient.from("routines").update(fields).eq("id", id);
    if (error) {
        logSupabaseError("Error al actualizar rutina:", error);
        throw error;
    }
}

const deleteRoutine = async (id: string) => {
    const { error: e1 } = await supabaseClient.from("routine_exercises").delete().eq("routine_id", id);
    if (e1) {
        logSupabaseError("Error al limpiar ejercicios de la rutina:", e1);
        throw e1;
    }
    const { error } = await supabaseClient.from("routines").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al eliminar rutina:", error);
        throw error;
    }
}

const addRoutineExercise = async ({ routine_id, exercise_id, order, sets_target, reps_target, notes }: routineExerciseType) => {
    const { data, error } = await supabaseClient
        .from("routine_exercises")
        .insert([{ routine_id, exercise_id, order, sets_target: sets_target ?? null, reps_target: reps_target || null, notes: notes || null }])
        .select();
    if (error) {
        logSupabaseError("Error al agregar ejercicio a la rutina:", error);
        throw error;
    }
    return data;
}

const updateRoutineExercise = async (id: string, fields: Partial<Pick<routineExerciseType, 'order' | 'sets_target' | 'reps_target' | 'notes'>>) => {
    const { error } = await supabaseClient.from("routine_exercises").update(fields).eq("id", id);
    if (error) {
        logSupabaseError("Error al actualizar ejercicio de la rutina:", error);
        throw error;
    }
}

const removeRoutineExercise = async (id: string) => {
    const { error } = await supabaseClient.from("routine_exercises").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al quitar ejercicio de la rutina:", error);
        throw error;
    }
}

// ---- Vehículos ----
const postVehicle = async (vehicle: vehicleType) => {
    const { data, error } = await supabaseClient.from("vehicles").insert([vehicle]).select();
    if (error) {
        logSupabaseError("Error al insertar vehículo:", error);
        throw error;
    }
    return data;
}

const updateVehicle = async (id: string, fields: Partial<vehicleType>) => {
    const { error } = await supabaseClient.from("vehicles").update(fields).eq("id", id);
    if (error) {
        logSupabaseError("Error al actualizar vehículo:", error);
        throw error;
    }
}

const deleteVehicle = async (id: string) => {
    const { error } = await supabaseClient.from("vehicles").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al eliminar vehículo:", error);
        throw error;
    }
}

const postVehicleProblem = async (problem: vehicleProblemType) => {
    const { data, error } = await supabaseClient.from("vehicle_problems").insert([problem]).select();
    if (error) {
        logSupabaseError("Error al insertar problema:", error);
        throw error;
    }
    return data;
}

const updateVehicleProblem = async (id: string, fields: Partial<vehicleProblemType>) => {
    const { error } = await supabaseClient.from("vehicle_problems").update(fields).eq("id", id);
    if (error) {
        logSupabaseError("Error al actualizar problema:", error);
        throw error;
    }
}

const deleteVehicleProblem = async (id: string) => {
    const { error } = await supabaseClient.from("vehicle_problems").delete().eq("id", id);
    if (error) {
        logSupabaseError("Error al eliminar problema:", error);
        throw error;
    }
}

export {postClient, postStudent, postJob, postExpense, deleteExpense, toggleExpense, updateExpense, postSavingsProject, deleteSavingsProject, updateSavingsAmount, addProjectContribution, deleteProjectContribution, addProjectExpense, deleteProjectExpense, updateProject, postCloth, deleteCloth, updateCloth, postOutfit, deleteOutfit, updateOutfit, upsertProfile, uploadProfilePhoto, postBodyMeasurement, deleteBodyMeasurement, postExercise, updateExercise, deleteExercise, postRoutine, updateRoutine, deleteRoutine, addRoutineExercise, updateRoutineExercise, removeRoutineExercise, postVehicle, updateVehicle, deleteVehicle, postVehicleProblem, updateVehicleProblem, deleteVehicleProblem};
