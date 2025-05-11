import React from 'react'
import Links from '../utils/dashboardLinks'
import CardD from '../ui/CardD'
import { createClient } from '../utils/supabase/server'
import { redirect } from 'next/navigation'
export default async function page() {

  const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      redirect('/login')
    }

  return (
    <div className='w-full xl:w-5/6  px-5 py-10 flex items-center justify-start flex-col'>
      <div className="w-full flex justify-between items-center">
        <div className="text-left w-full">
            <h3 className="text-lg font-semibold ml-3 text-slate-800">¡Bienvenido, Nacho!</h3>
            <p className="text-slate-500 mb-5 ml-3">¿Qué necesitas revisar o registrar hoy?</p>
          </div>
        </div>
        <div className='w-full border-t py-10 border-slate-300 gap-3 md:gap-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {Links.map(((link, i) => (
            <CardD key={i} title={link.title} desc={link.desc} link={link.link} />
          )))}
        </div>
    </div>
  )
}
