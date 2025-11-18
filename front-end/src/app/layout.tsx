import type { Metadata } from "next";
// @ts-ignore
import "@/src/app/styles/globals.css";
import Providers from "@/src/app/(public)/providers";
import { BackgroundBlobs } from "@/src/app/components/BackgroundBlobs";
import { Toaster } from "@/src/app/components/ui/sonner";

export const metadata: Metadata = {
  // MUDANÇA AQUI
  title: "PedidoRapido - Gestão Inteligente",
  description: "Sistema de gerenciamento de mesas e pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Providers>
          <BackgroundBlobs />
          <main className="relative z-10">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}