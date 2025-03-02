import { createClient } from "@/app/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function page() {

//   const students = await fetchStudents();
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <section className='w-full z-40 xl:w-10/12 overflow-hidden px-5 py-10 flex items-center justify-start flex-col'>
      <div className="w-full flex flex-col py-5 md:flex-row justify-between items-center">
        <div className="text-left w-full border-b border-slate-200 mb-4 md:border-0 md:mb-0">
          <h3 className="text-lg font-semibold ml-3 text-slate-800">Alumnos</h3>
          <p className="text-slate-500 mb-5 ml-3">Alumnos para clases particulares</p>
        </div>
        <div className="w-full md:w-fit ml-3 flex gap-4 items-center justify-between md:justify-start">
          <Link href="/dashboard/students/addStudent" className="w-fit text-nowrap text-md text-slate-500 hover:scale-105 transition">Agregar Alumno</Link>
          <div className="w-full max-w-sm min-w-[200px] relative">
            <form className="relative">
              <input
                className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Buscar Alumnos"
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
      <div className="flex flex-col w-full h-full overflow-x-hidden text-gray-700 bg-white shadow-md rounded-lg">
        <div className="overflow-x-auto">
          {/* <Table /> */}
        </div>
      </div>
    </section>
  )
}