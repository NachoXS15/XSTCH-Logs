import Image from "next/image"
import Link from "next/link"
export default function Sidebar() {
  return (
    <aside className="hidden px-10 bg-gray-100 md:flex flex-col justify-between py-10">
        <div className="flex flex-col gap-8">
            <Image src="/assets/xs-black.png" alt="logo" width={80} height={80} />
            <nav className="flex flex-col gap-4">
                <Link href="/dashboard" className="w-fit bg-slate-200 font-medium px-5 py-0.5 text-start rounded-md text-xl transition hover:scale-105">Inicio</Link>
                <Link href="/dashboard/clients" className="w-fit bg-slate-200 font-medium px-5 py-0.5 text-start rounded-md text-xl transition hover:scale-105">Clientes</Link>
                <Link href="/dashboard/projects" className="w-fit bg-slate-200 font-medium px-5 py-0.5 text-start rounded-md text-xl transition hover:scale-105">Proyectos</Link>
                <Link href="/dashboard/students" className="w-fit bg-slate-200 font-medium px-5 py-0.5 text-start rounded-md text-xl transition hover:scale-105">Alumnos</Link>
            </nav>
        </div>
        <div>
            <Link href="/" className="text-md hover:scale-110 transition">Cerrar sesión</Link>
        </div>
    </aside>
  )
}
