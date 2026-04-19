"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/modules/auth/services/auth-service";
import { useAuth } from "@/app/auth/context/auth-context";

export default function RegisterPage() {
  const { setSession } = useAuth();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await register(fullName, email, password);
      setSession({
        token: response.accessToken,
        expiresAtUtc: response.expiresAtUtc,
        user: response.user,
      });

      router.replace("/catalogo");
    } catch {
      setError("No se pudo crear la cuenta. Verificá los datos e intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md space-y-6 px-6 py-10">
      <h1 className="text-3xl font-bold">Crear cuenta</h1>

      <form className="space-y-4 rounded-xl border p-4" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label htmlFor="fullName" className="text-sm font-medium">Nombre completo</label>
          <input id="fullName" name="fullName" required className="w-full rounded-md border px-3 py-2" />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required className="w-full rounded-md border px-3 py-2" />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
          <input id="password" name="password" type="password" minLength={6} required className="w-full rounded-md border px-3 py-2" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60">
          {isSubmitting ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        ¿Ya tenés cuenta? <Link href="/login" className="text-blue-600 underline">Iniciar sesión</Link>
      </p>
    </main>
  );
}
