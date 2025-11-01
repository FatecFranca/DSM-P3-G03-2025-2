"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/src/app/contexts/AuthContext';
import { Header } from "@/src/app/components/Header";
import { Sidebar } from "@/src/app/components/Sidebar";
import { useEffect } from 'react';

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, router]);
  
  // Verifica o tipo de rota
  const isAdminRoute = pathname?.startsWith('/admin');
  const isClienteRoute = pathname?.startsWith('/cliente');
  const isGarcomRoute = pathname?.startsWith('/garcom');
  
  // Proteção de rota - verifica se o usuário tem permissão
  useEffect(() => {
    if (user) {
      if (isAdminRoute && user.role !== 'admin') {
        router.push('/cliente');
      } else if (isGarcomRoute && user.role !== 'garcom') {
        router.push('/cliente');
      }
    }
  }, [user, isAdminRoute, isGarcomRoute, router]);
  
  // Layout para Cliente
  if (isClienteRoute) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }
  
  // Layout para Admin e Garçom (com Header e Sidebar)
  if (isAdminRoute || isGarcomRoute) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 pt-16 p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
  // Fallback
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
