import Link from "next/link";
export default function HomePage() {
  return (
     <main className="min-h-screen px-6 py-14">
      <section className="mx-auto max-w-4xl space-y-5 text-center">
        <h1 className="text-4xl font-bold">Ecommerce</h1>
       {/* <p className="text-gray-600">Fase 2: módulo de catálogo con categorías, filtros y paginación.</p>
        <Link href="/catalogo" className="inline-block rounded-md bg-black px-5 py-3 text-white">
          Ir al catálogo
        </Link>
      </div> */}
       <p className="text-gray-600">Fase 3: carrito de compras y checkout básico conectados al backend.</p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/catalogo" className="inline-block rounded-md bg-black px-5 py-3 text-white">
            Ir al catálogo
          </Link>
          <Link href="/carrito" className="inline-block rounded-md border px-5 py-3">
            Ver carrito
          </Link>
        </div>
      </section>
    </main>
  );
}