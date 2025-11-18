import { Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 glass-header"> 
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* MUDANÇA AQUI */}
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-600">
            PedidoRapido
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="hover:bg-primary/10 text-muted-foreground hover:text-primary"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{getInitials(user.nome)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-panel border-orange-200/30">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium text-primary">{user.nome}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-amber-600 font-medium capitalize mt-1">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-orange-200/30" />
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary cursor-pointer">
                  <a href="/admin/perfil" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-orange-200/30" />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}