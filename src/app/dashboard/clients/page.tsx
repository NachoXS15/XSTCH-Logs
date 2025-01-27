import { fetchClients } from "@/app/lib/data";
import Table from "@/app/ui/Table";

export default async function page() {

  const clients = await fetchClients();
  console.log(clients);
  

  return (
    <section className='w-full xl:w-3/4 px-5 py-10 flex items-center justify-start flex-col'>
      <div className="text-left w-full">
        <h3 className="text-lg font-semibold ml-3 text-slate-800">Clientes</h3>
        <p className="text-slate-500 mb-5 ml-3">Registro de Clientes pertenecientes a XSTCH</p>
      </div>
      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <Table clients={clients} />
      </div>
    </section>
  )
}