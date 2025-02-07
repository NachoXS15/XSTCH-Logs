import { fetchStudentByID } from "@/app/lib/data-server"
import { editStudent } from "./actions";
import { InferGetServerSidePropsType } from 'next';
import { getServerSideProps } from "next/dist/build/templates/pages";
import Materias from "@/app/utils/materias";

export default async function Page({ params }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { id } = await params    
    const student = await fetchStudentByID(id);

    return (
        <section className="w-full md:w-5/6 xl:w-4/6 px-5 py-10 flex items-center justify-start flex-col">
            <div className="text-left w-full">
                <h3 className="text-lg font-semibold ml-3 text-slate-800">Editar o actualizar alumno</h3>
                <p className="text-slate-500 mb-5 ml-3">Alumnos para clases particulares</p>
            </div>
            <form className="w-full md:px-5 flex flex-col gap-5">
                <div className="w-full flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Nombre</label>
                        <input type="text" id="nombre" name="nombre" defaultValue={student?.student_name} className="bg-slate-200 rounded h-10 py-2 pl-4" placeholder="Ej: Angel Reynoso" />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        <label htmlFor="service">Materia</label>
                        <select id="service" name="materia" defaultValue={student?.materia} className="bg-slate-200 rounded h-10 py-2 px-4">
                            <option disabled defaultChecked>Seleccionar</option>
                            {Materias.map((materia, i) => (
                                <option key={i} value={materia}>{materia}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Precio</label>
                        <input type="number" id="price" name="price" defaultValue={student?.price} className="bg-slate-200 rounded h-10 py-2 pl-4" placeholder="Ej: 12000" />
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Tipo</label>
                        <select id="type" name="type" defaultValue={student?.type} className="bg-slate-200 rounded h-10 py-2 pl-4">
                            <option value="Catedra Completa">Catedra Completa</option>
                            <option value="Tema Particular">Tema Particular</option>
                            <option value="Ayuda Ilegal">Ayuda Ilegal</option>
                            <option value="Solo Final">Solo Final</option>
                            <option value="Parcial">Parcial</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="service">Mesa</label>
                        <input type="text" id="date" name="date" defaultValue={student?.date} className="bg-slate-200 rounded h-10 py-2 px-4" placeholder="Ej: Marzo 2025" />
                    </div>
                </div>
                <input type="hidden" value={id} name="id" />
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Condicion</label>
                        <select className="bg-slate-200 rounded h-10 py-2 pl-4" defaultValue={student?.condition} name="condition">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Promoción">Promoción</option>
                            <option value="Regular">Regular</option>
                            <option value="Libre">Libre</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Pago</label>
                        <select className="bg-slate-200 rounded h-10 py-2 pl-4" defaultValue={student?.payment} name="payment">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Pagado">Pagado</option>
                            <option value="Señado">Señado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="No Cobrado">Pendiente</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 flex flex-col">
                        <label htmlFor="nombre" className="font-medium">Nota</label>
                        <select className="bg-slate-200 rounded h-10 py-2 pl-4" defaultValue={student?.grade} name="grade">
                            <option value="" disabled defaultChecked>Seleccionar</option>
                            <option value="Aprobado">Aprobado</option>
                            <option value="Ausente">Ausente</option>
                            <option value="Reprobado">Reprobado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Abandonó">Abandonó</option>
                        </select>
                    </div>
                </div>
                {/* <div className="flex gap-2 flex-col">
                    <label htmlFor="obvs">Observaciones</label>
                    <textarea name="obvs" id="obvs" className="w-full h-24 p-4 bg-slate-200 resize-none" placeholder="Ej: Temperaturas altas"></textarea>
                </div> */}
                <div className="w-full flex gap-4">
                    <button type="submit" formAction={editStudent} className="w-1/2 transition border bg-green-500 text-white py-3 rounded hover:bg-white hover:text-green-500">Cargar Registro</button>
                    <button type="reset" className="w-1/2 transition border border-red-500 text-red-500 py-3 rounded hover:bg-red-500 hover:text-white">Limpiar</button>
                </div>
            </form>
        </section>
    )
}
