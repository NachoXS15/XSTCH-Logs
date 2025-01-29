import { createClient } from '../utils/supabase/server';
import {clientType} from './definitions';

const fetchClients = async(): Promise <clientType[]> => {
    try {
        const supabase = await createClient();
        const { data: clients } = await supabase.from('clients').select('*').order("egreso", {ascending: false});
        return clients as clientType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

const fetchClientByID = async(id: string): Promise <clientType | null> => {
    try {
        const supabase = await createClient();
        const { data: client, error} = await supabase.from('clients').select('*').eq('id', id).single();
        if (error) throw error;
        return client as clientType
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

export {fetchClients, fetchClientByID};