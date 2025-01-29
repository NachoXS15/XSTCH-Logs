'use server'
import { clientType } from "@/app/lib/definitions";
import { createClient } from "@/app/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function editClient(formData: FormData){
    const supabase = createClient();

    const id = formData.get("id") as string
    const data: clientType = {
        client_name: formData.get("nombre") as string,
        price: formData.get("price") as unknown as number,
        service: formData.get("service") as string,
        egreso: formData.get("date") as string,
        status: formData.get("status") as string,
        payment: formData.get("payment") as string,
        place: formData.get("place") as string,
        obvs: formData.get("obvs") as string
    }

    
    const { error } = await (await supabase)
    .from('clients')
    .update({
        client_name: data.client_name,
        price: data.price,
        service: data.service,
        egreso: data.egreso,
        status: data.status,
        payment: data.payment,
        place: data.place,
        obvs: data.obvs
     })
     .eq("id", id)
    .select()


      if (error) {
        redirect('/error')
      }
    
      revalidatePath('/', 'layout')
      redirect('/dashboard')

}
