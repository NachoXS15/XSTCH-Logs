'use server'
import { createClient } from "@/app/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteStudent(id: number | undefined){
    const supabase = await createClient();

    if (!id) {
        console.log("no id");
        return;
    }else{
        console.log(id);
    }

    const { error } = await supabase
    .from('students')
    .delete()
    .eq("id", id)
    
    if (error) {
        console.log("Error: ", error);
    }else{
        console.log("eliminado");
    }

    revalidatePath('/dashboard/students')
    redirect('/dashboard/students')
}
