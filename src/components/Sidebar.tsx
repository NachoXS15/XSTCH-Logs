import Image from "next/image"
import Link from "next/link"
export default function Sidebar() {
  return (
    <aside className="xl:w-3/12 lg:w-4/12 pl-10 bg-gray-100 flex flex-col justify-between py-10">
        <div className="flex flex-col gap-8">
            <Image src="/assets/xs-black.png" alt="logo" width={80} height={80} />
            <nav className="flex flex-col gap-4">
                <Link href="" className="w-fit bg-slate-200 px-5 py-0.5 text-start rounded-md text-xl transition hover:scale-105">Inicio</Link>
                <Link href="" className="w-fit bg-slate-200 px-5 py-0.5 text-start rounded-md text-xl transition hover:scale-105">Clientes</Link>
                <Link href="" className="w-fit bg-slate-200 px-5 py-0.5 text-start rounded-md text-xl transition hover:scale-105">Servicios</Link>
            </nav>
        </div>
        <div>
            <Link href="/" className="hover:scale-110 transition">Cerrar sesión</Link>
        </div>
    </aside>
  )
}
