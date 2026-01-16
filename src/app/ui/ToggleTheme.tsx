'use client'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

export default function ToggleTheme() {

    const { theme, setTheme } = useTheme()
    const [toggled, setToggled] = useState(false)
    console.log(theme);
    
    return (
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className={`${toggled ? "w-full px-5" : "w-fit px-3"} h-12 flex items-center gap-2 bg-slate-200 dark:bg-transparent font-medium py-0.5 rounded-md text-md transition hover:scale-105`}>
            <span>{theme == "light" ? (<Sun className="text-black dark:text-white bg-none" />) : (<Moon className="text-black dark:text-white bg-none"  />)}</span>
            <span className={`${toggled ? "inline" : "hidden"}`}>Modo Claro</span>
        </button>
    )
}
