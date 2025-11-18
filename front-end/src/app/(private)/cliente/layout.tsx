"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/app/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { clientesAPI } from "@/src/app/lib/api";


interface ClienteData {
  id: string;
  mesa_id?: string;
}

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading, isCliente, updateUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Aguardar autenticação carregar
      if (authLoading) {
        return;
      }

      // Verificar se é cliente
      if (!isCliente) {
        console.log('⚠️ Usuário não é cliente, redirecionando para sign-in');
        router.push("/sign-in");
        return;
      }

      if (!user) {
        console.log('⚠️ Usuário não encontrado');
        setChecking(false);
        return;
      }

      try {
        console.log('🔍 Verificando vinculação de mesa do cliente...');
        
        // Buscar dados atualizados do cliente no back-end
        const clienteData = await clientesAPI.get(user.id) as ClienteData;
        console.log('📊 Dados do cliente:', clienteData);

        // Atualizar contexto com dados mais recentes
        if (clienteData.mesa_id !== user.mesa_id) {
          console.log('🔄 Atualizando mesa_id no contexto:', clienteData.mesa_id);
          updateUser({ mesa_id: clienteData.mesa_id });
        }

        // Lógica de redirecionamento
        if (clienteData.mesa_id) {
          // Cliente TEM mesa vinculada
          if (pathname === "/cliente/select-mesa") {
            console.log('✅ Cliente tem mesa, redirecionando de select-mesa para pedido-mesa');
            router.push("/cliente/pedido-mesa");
          } else {
            console.log('✅ Cliente tem mesa e já está na página correta');
          }
        } else {
          // Cliente NÃO TEM mesa vinculada
          if (pathname === "/cliente/pedido-mesa") {
            console.log('⚠️ Cliente sem mesa, redirecionando de pedido-mesa para select-mesa');
            router.push("/cliente/select-mesa");
          } else if (pathname === "/cliente") {
            console.log('⚠️ Cliente sem mesa, redirecionando para select-mesa');
            router.push("/cliente/select-mesa");
          } else {
            console.log('✅ Cliente sem mesa e já está na página correta');
          }
        }
      } catch (error) {
        console.error('❌ Erro ao verificar dados do cliente:', error);
        // Em caso de erro, redirecionar para select-mesa
        if (pathname !== "/cliente/select-mesa") {
          router.push("/cliente/select-mesa");
        }
      } finally {
        setChecking(false);
      }
    };

    checkAndRedirect();
  }, [user?.id, authLoading, isCliente, pathname, router, updateUser]);

  // Mostrar loading enquanto verifica
  if (authLoading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>
    
  {children}

  </>;
}