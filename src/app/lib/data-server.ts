import { createClient } from '../utils/supabase/server';
import {clientType, studentType} from './definitions';

//clients
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

const deleteClient = async(id:string) => {
    try {
        const supabase = await createClient();
        const {error} = await supabase.from("client").delete().eq("id", id);
        if (error) throw error;
        console.log("Cliente eliminado");
    } catch (error) {
        console.log("Error al eliminar", error);
        
    }
}

//------------
//students
const fetchStudents = async(): Promise <studentType[]> => {
    try {
        const supabase = await createClient();
        const { data: clients } = await supabase.from('students').select('*').order("date", {ascending: false});
        return clients as studentType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}


export {fetchClients, fetchClientByID, deleteClient, fetchStudents};