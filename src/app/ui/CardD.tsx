import Link from "next/link";
type CardType = {
    title: string
    desc: string
    link: string
}


export default function CardD({title, desc, link}: CardType) {
    return (
        <div className='h-52 bg-slate-100 flex flex-col justify-between rounded p-5'>
            <div>
                <h2 className='text-slate-800 font-bold text-xl'>{title}</h2>
                <p className='text-slate-500'>{desc}</p>
            </div>
            <Link href={link} className='rounded-md bg-black w-fit px-3 py-1 text-white hover:bg-white hover:text-black transition border'>Ver Más</Link>
        </div>
    )
}
