import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center m-auto bg-gray-100 text-black font-[family-name:var(--font-poppins)]">
      <Link href="/login" className="bg-black rounded px-2 py-1 border border-black text-white hover:text-black hover:bg-white">Iniciar</Link>
    </div>
  );
}
