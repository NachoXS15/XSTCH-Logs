import Sidebar from "@/components/Sidebar";
import React from "react";

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <main className="w-full min-h-screen grid grid-cols-2 bg-white text-black font-[family-name:var(--font-poppins)]">
        <Sidebar />
        <section>
            {children}
        </section>
    </main>
        
  )
}
