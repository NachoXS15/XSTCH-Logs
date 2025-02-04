'use server'
import { studentType } from "@/app/lib/definitions";
import { createClient } from "@/app/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function editStudent(formData: FormData){
    const supabase = await createClient();

    const id = formData.get("id") as string
    const data: studentType = {
      student_name: formData.get("nombre") as string,
      price: Number(formData.get("price")),
      materia: formData.get("materia") as string,
      type: formData.get("type") as string,
      date: formData.get("date") as string,
      condition: formData.get("condition") as string,
      payment: formData.get("payment") as string,
      grade: formData.get("grade") as string,
      //obvs: formData.get("obvs") as string
    }
    
    
    if (!id) {
      console.error("id invalido");
      return;
    }

    const { error } = await supabase
    .from('students')
    .update({...data})
    .eq("id", id.trim())
    .select()

    if (error) {
      console.error("error:", error.message)
      redirect('/error')
    }

    revalidatePath('/dashboard/students')
    redirect('/dashboard/students')
}
