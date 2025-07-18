'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import Table from '@/app/ui/tables/TableClients';
import { clientType } from '../lib/definitions';

export default function SearchForm({ clients }: { clients: clientType[] }) {
    const [query, setQuery] = useState('');

    const filteredClients = useMemo(() => {
        return clients.filter((client) =>
            client.client_name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, clients]);

    return (
        <>
            <div className="w-full flex flex-col py-5 md:flex-row justify-between items-center">
                <div className="text-left w-full border-b border-slate-200 mb-4 md:border-0 md:mb-0">
                    <h3 className="text-lg font-semibold ml-3 text-slate-800">Registros</h3>
                    <p className="text-slate-500 mb-5 ml-3">Registro de Clientes pertenecientes a XSTCH</p>
                </div>
                <div className="w-full md:w-fit ml-3 flex gap-4 items-center justify-between md:justify-start">
                    <Link href="/dashboard/clients/addClient" className="w-fit text-nowrap text-md text-slate-500 hover:scale-105 transition">Agregar Registro</Link>
                    <div className="w-full max-w-sm min-w-[200px] relative">
                        <form onSubmit={(e) => e.preventDefault()} className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar registros"
                                className="bg-white w-full pr-11 h-10 pl-3 py-2 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded"
                            />
                            <button
                                className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded"
                                type="submit"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 text-slate-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                    {/* <Link href="/dashboard/clients" className={`${search != "" ? "text-nowrap text-md text-slate-500 hover:scale-105" : "hidden"}`}>Limpiar</Link> */}
                </div>
            </div>
            <div className="flex flex-col w-full h-[700px] overflow-x-hidden text-gray-700 bg-white shadow-md rounded-lg">
                <div className="overflow-x-auto">
                    <Table clients={filteredClients} />
                </div>
            </div>
        </>
    );
}
