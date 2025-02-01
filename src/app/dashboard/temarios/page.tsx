import Temarios from "@/app/ui/Temarios";
import TemasCatedras from "@/app/utils/temario";

export default function page() {
    return (
        <section className='w-full z-40 xl:w-10/12 overflow-hidden px-5 py-10 flex items-center justify-start flex-col'>
            <div className="w-full flex flex-col py-5 md:flex-row justify-between items-center">
                <div className="text-left w-full">
                    <h3 className="text-lg font-semibold ml-3 text-slate-800">Temarios</h3>
                    <p className="text-slate-500 mb-5 ml-3">Plan de Contenidos de Cátedras</p>
                </div>
            </div>
            <div className="w-full border-t border-slate-400 px-5">
                {TemasCatedras.map((tema, i) => (
                    <Temarios key={i} name={tema.name} temario={tema.temario} />
                ))}
            </div>
        </section>
    )
}
