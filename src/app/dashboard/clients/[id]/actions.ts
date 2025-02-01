'use server'
import { clientType } from "@/app/lib/definitions";
import { createClient } from "@/app/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function editClient(formData: FormData){
    const supabase = await createClient();

    const id = formData.get("id") as string
    const data: clientType = {
      client_name: formData.get("nombre") as string,
      price: Number(formData.get("price")),
      service: formData.get("service") as string,
      egreso: formData.get("date") as string,
      status: formData.get("status") as string,
      payment: formData.get("payment") as string,
      place: formData.get("place") as string,
      obvs: formData.get("obvs") as string
    }
    
    
    if (!id) {
      console.error("id invalido");
      return;
    }

    const { error } = await supabase
    .from('clients')
    .update({...data})
    .eq("id", id.trim())
    .select()

    if (error) {
      console.error("Error en Supabase:", error.message)
      redirect('/error')
    }

    revalidatePath('/dashboard/clients')
    redirect('/dashboard/clients')

}
