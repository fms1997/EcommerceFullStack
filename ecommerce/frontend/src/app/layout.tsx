import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/prodivers/query-provider";
 
export const metadata: Metadata = {
  title: "Ecommerce",
  description: "Ecommerce con Next.js y ASP.NET Core",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}