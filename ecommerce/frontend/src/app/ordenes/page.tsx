"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { RequireAuth } from "@/modules/auth/components/require-auth";
import { getMyOrders } from "@/modules/services/checkout-service";

export default function OrdersHistoryPage() {
  const ordersQuery = useQuery({
    queryKey: ["orders-history"],
    queryFn: getMyOrders,
  });

  return (
    <RequireAuth>
      <main className="mx-auto min-h-screen w-full max-w-4xl space-y-6 px-6 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Mis compras</h1>
          <p className="text-sm text-gray-600">Historial de órdenes realizadas con tu cuenta.</p>
        </header>

        {ordersQuery.isLoading ? (
          <p>Cargando historial...</p>
        ) : ordersQuery.isError ? (
          <p className="text-sm text-red-600">No pudimos cargar tus órdenes.</p>
        ) : ordersQuery.data && ordersQuery.data.length > 0 ? (
          <section className="space-y-3 rounded-xl border p-4">
            {ordersQuery.data.map((order) => (
              <article key={order.orderId} className="flex flex-col gap-3 border-b pb-3 last:border-0 last:pb-0 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">Orden #{order.orderId}</p>
                  <p className="text-sm text-gray-600">{new Date(order.createdAtUtc).toLocaleString("es-AR")}</p>
                  <p className="text-sm text-gray-600">Estado: {order.status}</p>
                  <p className="text-sm text-gray-600">Ítems: {order.itemCount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                  <Link href={`/orden/${order.orderId}`} className="rounded-md border px-3 py-2 text-sm">
                    Ver detalle
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="rounded-xl border border-dashed p-6 text-center">
            <p className="text-gray-600">Todavía no tenés compras registradas.</p>
            <Link href="/catalogo" className="mt-3 inline-block rounded-md bg-black px-4 py-2 text-sm text-white">
              Ir al catálogo
            </Link>
          </section>
        )}
      </main>
    </RequireAuth>
  );
}
