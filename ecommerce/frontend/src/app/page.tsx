import Link from "next/link";
export default function HomePage() {
  return (
     <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-5">
        <h1 className="text-4xl font-bold">Ecommerce</h1>
       <p className="text-gray-600">Fase 2: módulo de catálogo con categorías, filtros y paginación.</p>
        <Link href="/catalogo" className="inline-block rounded-md bg-black px-5 py-3 text-white">
          Ir al catálogo
        </Link>
      </div>
    </main>
  );
}