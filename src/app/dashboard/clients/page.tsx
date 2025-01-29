import { fetchClients } from "@/app/lib/data-server";
import Table from "@/app/ui/Table";
import Link from "next/link";

export default async function page() {

  const clients = await fetchClients();
  console.log(clients);


  return (
    <section className='w-full xl:w-5/6 px-5 py-10 flex items-center justify-start flex-col'>
      <div className="w-full flex justify-between items-center">
        <div className="text-left w-full">
          <h3 className="text-lg font-semibold ml-3 text-slate-800">Clientes</h3>
          <p className="text-slate-500 mb-5 ml-3">Registro de Clientes pertenecientes a XSTCH</p>
        </div>
        <div className="ml-3 flex gap-4 items-center">
          <Link href="/dashboard/clients/addClient" className="w-fit text-nowrap text-md text-slate-500 hover:scale-105 transition">Agregar Cliente</Link>
          <div className="w-full max-w-sm min-w-[200px] relative">
            <form className="relative">
              <input
                className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Buscar clientes"
              />
              <button
                className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <Table clients={clients} />
      </div>
    </section>
  )
}