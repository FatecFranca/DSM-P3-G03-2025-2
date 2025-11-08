"use client";
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Package,
  Users,
  UserCog,
  Tag,
  TruckIcon,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  adminOnly?: boolean;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/admin/dashboard', adminOnly: true },
    { name: 'Mesas', icon: <UtensilsCrossed className="h-5 w-5" />, href: '/admin/mesas', adminOnly: true },
    { name: 'Pedidos', icon: <ShoppingCart className="h-5 w-5" />, href: '/admin/pedidos', adminOnly: true },
    { name: 'Produtos', icon: <Package className="h-5 w-5" />, href: '/admin/produtos', adminOnly: true },
    { name: 'Categorias', icon: <Tag className="h-5 w-5" />, href: '/admin/categorias', adminOnly: true },
    { name: 'Fornecedores', icon: <TruckIcon className="h-5 w-5" />, href: '/admin/fornecedores', adminOnly: true },
    { name: 'Clientes', icon: <Users className="h-5 w-5" />, href: '/admin/clientes', adminOnly: true },
    { name: 'Garçons', icon: <UserCog className="h-5 w-5" />, href: '/admin/garcons', adminOnly: true },
    { name: 'Relatórios', icon: <BarChart3 className="h-5 w-5" />, href: '/admin/relatorios', adminOnly: true },
    { name: 'Mesas', icon: <UtensilsCrossed className="h-5 w-5" />, href: '/garcom/mesas' },
    { name: 'Pedidos', icon: <ShoppingCart className="h-5 w-5" />, href: '/garcom/pedidos'},
  ];

  const filteredItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-3">
          <nav className="space-y-1">
            {filteredItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                  pathname === item.href
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
