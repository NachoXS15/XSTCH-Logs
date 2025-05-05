'use server'
import { jobsType } from "@/app/lib/definitions";
import { createClient } from "@/app/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function editJob(formData: FormData){
    const supabase = await createClient();

    const id = formData.get("id") as string
    const partner = formData.get("partner") == "Solo" ? false : true
    const data: jobsType = {
      client_name: formData.get("nombre") as string,
      price: Number(formData.get("price")),
      date: formData.get("date") as string,
      active: formData.get("active") as string,
      account: formData.get("account") as string,
      obvs: formData.get("obvs") as string,
      pay_method: formData.get("method") as string,
      partner: partner,
      partner_name: formData.get("partner_name") as string
    }
    
    
    if (!id) {
      console.error("id invalido");
      return;
    }

    const { error } = await supabase
    .from('jobs')
    .update({...data})
    .eq("id", id.trim())
    .select()

    if (error) {
      console.error("error:", error.message)
      redirect('/error')
    }

    revalidatePath('/dashboard/jobs')
    redirect('/dashboard/jobs')
}
