"use client";

import { useAuth } from "@/app/auth/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const callbackPath = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${callbackPath}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  return <>{children}</>;
}
