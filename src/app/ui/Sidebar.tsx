'use client'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogOut, Computer, MenuIcon, Sun, ChevronRight, House, BookMarked, Star } from 'lucide-react'
export default function Sidebar() {
  const [toggled, setToggled] = useState(false)
  const pathname = usePathname()

  const links = [
    { id: 1, content: "Inicio", link: "/dashboard", icon: House },
    { id: 2, content: "Clientes", link: "/dashboard/clients", icon: Computer },
    { id: 3, content: "Proyectos", link: "/dashboard/projects", icon: BookMarked },
    { id: 4, content: "Alumnos", link: "/dashboard/students", icon: Star},
  ]


  return (
    <aside className={`bg-slate-100 overflow-hidden shadow-sm transition-colors z-50 ${toggled ? "w-96 lg:w-2/12" : "w-20"} px-5 flex flex-col justify-between py-10`}>
      <div className="w-full flex flex-col gap-8">
        <div className={`flex items-center ${toggled ? "flex-row" : "flex-col-reverse gap-5"} justify-between`}>
          <Image src="/assets/xs-black.png" alt="logo" width={80} height={80} />
          <button onClick={() => setToggled(!toggled)}>{toggled ? <MenuIcon /> : <ChevronRight />}</button>
        </div>
        <nav className="w-full flex items-center flex-col gap-4">
          {
            links.map(link => {
              const LinkIcon = link.icon

              return (
                <Link key={link.id} href={link.link} className={`${toggled ? "w-full px-5" : "w-fit px-3"} h-12 flex items-center gap-2 bg-slate-200 font-medium py-0.5 rounded-md text-md transition hover:scale-105 ${pathname === link.link ? "bg-slate-400" : ""}`}>
                  <span><LinkIcon /></span>
                  <span className={`${toggled ? "inline" : "hidden"}`}>{link.content}</span>
                </Link>
              )
            }
            )}
        </nav>
      </div>
      <div>
        <Link href="/" className={`${toggled ? "w-full px-5" : "w-fit px-3"} mb-3 h-12 flex items-center gap-2 bg-slate-200 font-medium py-0.5 rounded-md text-md transition hover:scale-105`}>
          <button><Sun /></button>
          <span className={`${toggled ? "inline" : "hidden"}`}>Modo Claro</span>
        </Link>
        <Link href="/" className={`${toggled ? "w-full px-5" : "w-fit px-3"} h-12 flex items-center gap-2 bg-slate-200 font-medium py-0.5 rounded-md text-md transition hover:scale-105`}>
          <button><LogOut /></button>
          <span className={`${toggled ? "inline" : "hidden"}`}>Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  )
}
