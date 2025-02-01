'use client'
import {Dot} from 'lucide-react'
import { useState } from "react"
import { TemarioProps } from '../lib/definitions'
export default function Temarios({name, temario}: TemarioProps) {
    const [accordion, setAccordion] = useState(true)

    const toggleAccordion = () => {
        setAccordion(!accordion)
    }

    return (
        <div className="border-y border-slate-200 ">
            <button onClick={toggleAccordion} className="w-full hover:bg-slate-200 rounded px-5 flex justify-between items-center py-5 text-slate-800">
                <span>{name}</span>
                <span id="icon-1" className="text-slate-800 transition-transform duration-300">
                    {accordion ? "+" : "-"}
                </span>
            </button>
            <div className={`${accordion ? "max-h-0" : "max-h-fit border-t border-slate-200"} px-5 overflow-hidden  transition-all duration-300 ease-in-out`}>
                <h2 className="font-semibold text-2xl flex mt-5 mb-3">Temas:</h2>
                    {
                        temario.map((tema, i) => (
                            <div key={i} className='w-full flex flex-col-reverse'>
                                <ul className="pb-2 pl-4 mt-2 text-sm text-slate-500">
                                    <h2 className='text-xl pl-3 text-slate-800 font-medium'>{tema.title}</h2>
                                    {tema.temas.map((tema, i) => (                                 
                                        <li className="pl-5 my-3 text-md flex items-center" key={i}><Dot />{tema}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    }
            </div>
        </div>
    )
}
