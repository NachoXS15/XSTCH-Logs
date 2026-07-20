import { supabaseClient } from '../utils/supabase/client';
import {clientType, jobsType, studentType, expenseType, savingsProjectType} from './definitions';


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

const postExpense = async ({ name, amount, category, active }: expenseType) => {
    const { data, error } = await supabaseClient
        .from("expenses")
        .insert([{ name, amount, category, active }])
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

const updateExpense = async (id: string, fields: Pick<expenseType, 'name' | 'amount' | 'category'>) => {
    const { error } = await supabaseClient.from("expenses").update(fields).eq("id", id);
    if (error) {
        logSupabaseError("Error al editar gasto:", error);
        throw error;
    }
}

export {postClient, postStudent, postJob, postExpense, deleteExpense, toggleExpense, updateExpense, postSavingsProject, deleteSavingsProject, updateSavingsAmount};