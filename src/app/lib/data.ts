import { createClient } from '../utils/supabase/server';
import clientType from './definitions';


const fetchClients = async(): Promise <clientType[]> => {
    try {
        const supabase = await createClient();
        const { data: clients} = await supabase.from('clients').select('*')
        return clients as clientType[]
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}

export {fetchClients};