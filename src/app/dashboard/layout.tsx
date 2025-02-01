import Sidebar from "@/app/ui/Sidebar";
import React from "react";

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <main className="w-full min-h-screen overflow-x-hidden flex flex-col-reverse md:flex-row md:justify-start justify-between bg-white text-black font-[family-name:var(--font-poppins)]">
        <Sidebar />
        <main className="w-full flex items-start justify-center">
            {children}
        </main>
    </main>
        
  )
}
