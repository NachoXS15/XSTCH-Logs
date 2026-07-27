import Sidebar from "@/app/ui/Sidebar";
import MobileHeader from "@/app/ui/MobileHeader";
import React from "react";

export default async function layout({children}: {children: React.ReactNode}) {

  return (
    <main className="w-full min-h-screen overflow-x-hidden flex flex-col-reverse md:flex-row md:justify-start justify-between bg-white dark:bg-gray-950 text-black font-[family-name:var(--font-poppins)]">
        <Sidebar />
        <main className="w-full md:pl-24 md:mt-0 flex flex-col items-start justify-start">
            <MobileHeader />
            {children}
        </main>
    </main>
  )
}
