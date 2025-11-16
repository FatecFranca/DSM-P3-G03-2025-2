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
  const { user, isAuthenticated, loading } = useAuth();
  
  // Redireciona se não estiver autenticado (após carregar)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🚫 Não autenticado, redirecionando para /sign-in')
      router.push('/sign-in');
    }
  }, [loading, isAuthenticated, router]);
  
  // Verifica o tipo de rota
  const isAdminRoute = pathname?.startsWith('/admin');
  const isClienteRoute = pathname?.startsWith('/cliente');
  const isGarcomRoute = pathname?.startsWith('/garcom');
  
  // Proteção de rota - verifica se o usuário tem permissão
  useEffect(() => {
    if (!loading && user) {
      if (isAdminRoute && user.role !== 'admin') {
        console.log('🚫 Usuário não é admin, redirecionando')
        router.push('/cliente/select-mesa');
      } else if (isGarcomRoute && user.role !== 'garcom') {
        console.log('🚫 Usuário não é garçom, redirecionando')
        router.push('/cliente/select-mesa');
      }
    }
  }, [loading, user, isAdminRoute, isGarcomRoute, router]);
  
  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
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
