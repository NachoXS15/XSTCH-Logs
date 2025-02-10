'use server'
import { createClient } from "@/app/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteClient(id: string | undefined){
    const supabase = await createClient();

    if (!id) {
        console.log("no id");
        return;
    }else{
        console.log(id);
    }

    const { error } = await supabase
    .from('clients')
    .delete()
    .eq("id", id)
    
    if (error) {
        console.log("Error: ", error);
    }

    revalidatePath('/dashboard/clients')
    redirect('/dashboard/clients')
}