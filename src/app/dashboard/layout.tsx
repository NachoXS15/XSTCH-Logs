import { LogOut, Sun } from "lucide-react";
import Sidebar from "@/app/ui/Sidebar";
import React from "react";
import Link from "next/link";

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <main className="w-full min-h-screen overflow-x-hidden flex flex-col-reverse md:flex-row md:justify-start justify-between bg-white text-black font-[family-name:var(--font-poppins)]">
        <Sidebar />
        <main className="w-full md:pl-24 mt-6 md:mt-0 relative flex items-start justify-center">
            <div className="flex gap-5 md:hidden absolute right-5">
              <button><Sun /></button>
              <Link href="/"><LogOut /></Link>
            </div>
            {children}
        </main>
    </main>  
  )
}
