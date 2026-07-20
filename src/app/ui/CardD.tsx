import Link from "next/link";
type CardType = {
    title: string
    desc: string
    link: string
}


export default function CardD({title, desc, link}: CardType) {
    return (
        <div className='h-40 bg-slate-100 dark:bg-slate-800 flex flex-col justify-between rounded p-4'>
            <div>
                <h2 className='text-slate-800 dark:text-white font-semibold text-md md:text-xl'>{title}</h2>
                <p className='text-slate-500 dark:text-slate-400 text-xs md:text-base  mt-1'>{desc}</p>
            </div>
            <Link href={link} className='rounded-md text-xs md:text-md bg-black dark:bg-transparent w-fit px-3 py-1 text-white hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-slate-900 transition border'>Ver Más</Link>
        </div>
    )
}
