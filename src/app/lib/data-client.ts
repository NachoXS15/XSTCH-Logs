import { supabaseClient } from '../utils/supabase/client';
import {clientType, jobsType, studentType} from './definitions';


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

export {postClient, postStudent, postJob};