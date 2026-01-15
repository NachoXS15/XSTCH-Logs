'use client'
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogOut, Computer, MenuIcon, Sun, ChevronRight, House, Star, Shovel, Calculator} from 'lucide-react'
import logo1 from '../assets/xs-black.png';
import logo2 from '../assets/xs-white.png';
import { useTheme } from "next-themes"
import ToggleTheme from "./ToggleTheme"
export default function Sidebar() {
    const [toggled, setToggled] = useState(false)
    const pathname = usePathname()
    const {theme, setTheme} = useTheme()
    const links = [
        { id: 1, content: "Inicio", link: "/dashboard", icon: House },
        { id: 2, content: "Registros", link: "/dashboard/clients", icon: Computer },
        { id: 3, content: "Alumnos", link: "/dashboard/students", icon: Star },
        { id: 4, content: "Trabajos", link: "/dashboard/jobs", icon: Shovel },
        { id: 5, content: "Calculadora", link: "/dashboard/calculator", icon: Calculator },
        // { id: 6, content: "Proyectos", link: "/dashboard/projects", icon: BookMarked },
    ]


    return (
        <>
            <aside className={`hidden md:block bg-slate-100 dark:bg-gray-900 h-screen fixed top-0 shadow-sm transition-all z-50 ${toggled ? "w-64 lg:w-2/12 px-5 flex" : "w-20 px-10"} py-10`}>
                <div className="flex flex-col items-center justify-between h-full">
                    <div className="w-full flex flex-col gap-8">
                        <div className={`flex items-center ${toggled ? "flex-row" : "flex-col-reverse gap-5"} justify-between`}>
                            <Image src={theme == "light" ? logo1 : logo2} alt="logo" className={`${toggled ? "w-20 h-20 object-contain" : "min-w-12 min-h-12 object-contain"}`} />
                            {/* <button className="hidden md:block" onClick={() => setToggled(!toggled)}>{toggled ? <MenuIcon /> : <ChevronRight />}</button> */}
                        </div>
                        <nav className="w-full flex items-center flex-col gap-4">
                            {
                                links.map(link => {
                                    const LinkIcon = link.icon

                                    return (
                                        <Link key={link.id} href={link.link} className={`${toggled ? "w-full px-5" : "w-fit px-3"} h-12 flex items-center gap-2 bg-slate-200 dark:bg-transparent dark:bg-gray-950 font-medium py-0.5 rounded-md text-md transition hover:scale-105 ${pathname === link.link ? "bg-slate-400" : ""}`}>
                                            <span><LinkIcon className="text-black dark:text-white bg-none"  strokeOpacity={10} /></span>
                                            <span className={`${toggled ? "inline" : "hidden"}`}>{link.content}</span>
                                        </Link>
                                    )
                                }
                                )}
                        </nav>
                    </div>
                    <div className="w-full flex items-center flex-col gap-4">
                        <ToggleTheme />
                        <Link href="/logout" className={`${toggled ? "w-full px-5" : "w-fit px-3"} h-12 flex items-center gap-2 bg-slate-200 dark:bg-transparent font-medium py-0.5 rounded-md text-md transition hover:scale-105`}>
                            <button><LogOut className="text-black dark:text-white bg-none" /></button>
                            <span className={`${toggled ? "inline" : "hidden"}`}>Cerrar sesión</span>
                        </Link>
                    </div>
                </div>
            </aside>
            <nav className="max-w-full block md:hidden w-full z-50 fixed overflow-visible bottom-0 bg-slate-100 dark:bg-slate-900 shadow-sm">
                <nav className="h-24 flex items-center px-5 justify-evenly gap-4">
                    {
                        links.slice(0, 3).map(link => {
                            const LinkIcon = link.icon
                            return (
                                <Link key={link.id} href={link.link} className={`px-3 py-8 h-12 flex items-center justify-center flex-col gap-2 bg-slate-200 dark:bg-transparent font-medium rounded-md text-md transition hover:scale-105 ${pathname === link.link ? "bg-slate-400" : ""}`}>
                                    <span><LinkIcon size={20} className="dark:text-white" /></span>
                                    <span className="text-xs dark:text-white">{link.content}</span>
                                </Link>
                            )
                        }
                        )}
                </nav>
            </nav>
            <div className="pb-24"></div>
        </>
    )
}
