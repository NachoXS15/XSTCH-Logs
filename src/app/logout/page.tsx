import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export default async function page() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser();
    if (data.user) {
        supabase.auth.signOut();
        console.log("sesion cerrada");
        redirect("/login");
    }else{
        redirect("/login");
    }
    return(
        <div className="bg-white">Cerrando sesion</div>
    )
}
