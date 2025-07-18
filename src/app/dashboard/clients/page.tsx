
import { fetchClients } from "@/app/lib/data-server";
import SearchForm from "@/app/ui/SearchFormClients";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {

  const clients = await fetchClients();
  // const filteredClients = clients.filter(client => client.client_name.toLowerCase().includes(search))

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <section className='w-full z-40 xl:w-10/12 overflow-hidden px-5 py-10 flex items-center justify-start flex-col'>
      <SearchForm clients={clients}/>
    </section>
  )
}