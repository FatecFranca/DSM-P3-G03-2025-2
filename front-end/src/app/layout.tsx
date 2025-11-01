import type { Metadata } from "next";
// @ts-ignore
import "@/src/app/styles/globals.css";
import  Providers  from "./providers";


export const metadata: Metadata = {
  title: "Sistema de Gerenciamento de Mesas",
  description: "Sistema de gerenciamento de mesas e pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}