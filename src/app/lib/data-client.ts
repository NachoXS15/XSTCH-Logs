import { supabaseClient } from '../utils/supabase/client';
import {clientType} from './definitions';


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

export {postClient};