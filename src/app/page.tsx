import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center m-auto bg-gray-100 dark:bg-slate-950 text-black dark:text-white font-[family-name:var(--font-poppins)]">
      <Link href="/login" className="bg-black transition dark:bg-transparent rounded px-2 py-1 border border-black dark:border-white text-white dark:hover:text-slate-950 dark:hover:bg-white hover:text-black hover:bg-white">Iniciar</Link>
    </div>
  );
}
