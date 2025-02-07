import Image from "next/image";
import { login } from "./actions";
import logo from '../assets/xs-black.png'
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (!error || data?.user) {
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen grid grid-cols-1 m-auto text-black justify-center font-[family-name:var(--font-poppins)]">
      <section className="flex items-center bg-gray-100 justify-center h-full">
        <div className="w-11/12 md:w-5/6 xl:w-2/5 h-3/4 md:h-3/4 relative border shadow-xl rounded-lg flex items-center justify-center flex-col">
          <Image src={logo} alt="logo" width={50} height={50} className="absolute top-5 left-5" />
          <div className="flex flex-col items-center">
            <h2 className="mb-2 text-center font-bold text-2xl md:text-4xl">Acceso</h2>
            <hr className="border w-20 border-black" />
          </div>
          <form action="" className="w-full px-5 md:px-10 flex items-center justify-center flex-col">
            <div className="w-full flex items-start flex-col my-3">
              <label htmlFor="mail" className="text-md md:text-xl">Email</label>
              <input type="email" name="email" id="mail" className="w-full border-2 h-10 px-2.5 rounded border-black" />
            </div>
            <div className="w-full flex items-start flex-col my-3">
              <label htmlFor="pass" className="text-md md:text-xl">Contraseña</label>
              <input type="password" name="password" id="pass" className="w-full px-2.5 border-2 h-10 rounded border-black" />
            </div>
            {/* <div className="w-full flex items-center justify-center gap-2.5">
              <input type="checkbox" id="check" />
              <label htmlFor="check" className="text-md md:text-xl">Mantener sesión iniciada</label>
            </div> */}
            <button formAction={login} className="bg-black px-5 py-2 mt-10 rounded-full text-white text-md md:text-xl">Iniciar Sesión</button>
          </form>
        </div>
      </section>
    </div>
  );
}
