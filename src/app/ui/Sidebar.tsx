'use client'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
export default function Sidebar() {

  const pathname = usePathname()

  const links = [
    {id: 1, content: "Inicio", link: "/dashboard"},
    {id: 2, content: "Clientes", link: "/dashboard/clients"},
    {id: 3, content: "Proyectos", link: "/dashboard/projects"},
    {id: 4, content: "Alumnos", link: "/dashboard/students"},
  ]

  return (
    <aside className="hidden px-10 bg-slate-100 md:flex flex-col justify-between py-10">
        <div className="w-full flex flex-col gap-8">
            <Image src="/assets/xs-black.png" alt="logo" width={80} height={80} />
            <nav className="flex flex-col gap-4">
              {
                links.map(link => (
                  <Link key={link.id} href={link.link} className={`w-fit bg-slate-200 font-medium px-5 py-0.5 text-start rounded-md text-xl transition hover:scale-105 ${pathname === link.link ? "bg-slate-400" : ""}`}>{link.content}</Link>
                ))
              }
            </nav>
        </div>
        <div>
            <Link href="/" className="text-md hover:scale-110 transition">Cerrar sesión</Link>
        </div>
    </aside>
  )
}
