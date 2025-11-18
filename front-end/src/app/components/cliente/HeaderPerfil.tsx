"use client"; // Necessário para o onClick e useRouter

import { useRouter } from 'next/navigation';
import { UtensilsCrossed, User, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/src/app/components/ui/button'; // Assumindo que você usa shadcn/ui

// Definindo os tipos para as props do componente
interface UserProps {
  nome?: string;
  // Adicione outras propriedades do usuário aqui se necessário
}

interface HeaderProps {
  user?: UserProps | null;
  handleLogout: () => void;
}

/**
 * Header principal da aplicação
 * @param {HeaderProps} props
 * @param {UserProps | null} props.user - Objeto do usuário (ex: { nome: 'João' })
 * @param {() => void} props.handleLogout - Função a ser chamada no clique de "Sair"
 */
export default function Header({ user, handleLogout }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Lado Esquerdo: Voltar e Título */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Voltar para a página anterior"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Logo e Título */}
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Seleção de Mesa</h2>
            <p className="text-xs text-muted-foreground">Escolha sua mesa</p>
          </div>
        </div>

        {/* Lado Direito: Usuário e Logout */}
        <div className="flex items-center gap-3">
          {/* Informações do Usuário */}
          <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
            <User className="w-4 h-4 text-muted-foreground" />
            
            {/* Voltamos a usar a tag <a> para compatibilidade.
              Em um projeto Next.js real, você pode trocar para <Link href="/cliente/perfil">.
            */}
            <a 
              href="/cliente/perfil"
              className="text-sm font-medium truncate max-w-[150px] cursor-pointer hover:underline"
            >
              {user?.nome}
            </a>
          </div>

          {/* Botão de Logout */}
          <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
        </div>
      </div>
    </div>
  );
}