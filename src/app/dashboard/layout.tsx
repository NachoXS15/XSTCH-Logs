import Sidebar from "@/components/Sidebar";
import React from "react";

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <main className="w-full min-h-screen flex bg-white text-black font-[family-name:var(--font-poppins)]">
        <Sidebar />
        <section className="w-full flex items-start justify-center">
            {children}
        </section>
    </main>
        
  )
}
