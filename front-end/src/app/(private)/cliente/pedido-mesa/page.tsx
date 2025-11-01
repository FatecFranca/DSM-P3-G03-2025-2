"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/src/app/contexts/AuthContext';
import { Button } from '@/src/app/components/ui/button';
import { Badge } from '@/src/app/components/ui/badge';
import { Card, CardContent } from '@/src/app/components/ui/card';
import { ScrollArea } from '@/src/app/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/src/app/components/ui/sheet';
import { CategoriaChip } from '@/src/app/components/cliente/CategoriaChip';
import { ProdutoCard } from '@/src/app/components/cliente/ProdutoCard';
import { PedidoAtivo } from '@/src/app/components/cliente/PedidoAtivo';
import { EmptyState } from '@/src/app/components/cliente/EmptyState';
import { MesaHeader } from '@/src/app/components/cliente/MesaHeader';
import { 
  ShoppingCart, 
  UtensilsCrossed, 
  Coffee, 
  Pizza, 
  IceCream,
  Search,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Produto, Categoria, Pedido } from '@/src/app/types';
import { Input } from '@/src/app/components/ui/input';
import { useTheme } from '@/src/app/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/src/app/components/ui/avatar';
import { toast } from 'sonner';

// Mock data
const mockCategorias: Categoria[] = [
  { id: '1', descricao: 'Entradas' },
  { id: '2', descricao: 'Pratos Principais' },
  { id: '3', descricao: 'Bebidas' },
  { id: '4', descricao: 'Sobremesas' },
];

const mockProdutos: Produto[] = [
  {
    id: '1',
    nome: 'Bruschetta',
    marca: 'Casa',
    detalhes: 'Pão italiano com tomate, manjericão e azeite',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 18.90,
    qtd_estoque: 15,
    categoria_id: '1',
    fornecedor_ids: ['1'],
  },
  {
    id: '2',
    nome: 'Filé Mignon ao Molho Madeira',
    marca: 'Casa',
    detalhes: '250g de filé mignon com batatas e legumes',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 65.00,
    qtd_estoque: 8,
    categoria_id: '2',
    fornecedor_ids: ['2'],
  },
  {
    id: '3',
    nome: 'Refrigerante Coca-Cola',
    marca: 'Coca-Cola',
    detalhes: 'Lata 350ml gelada',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 8.00,
    qtd_estoque: 50,
    categoria_id: '3',
    fornecedor_ids: ['1'],
  },
  {
    id: '4',
    nome: 'Tiramisu',
    marca: 'Casa',
    detalhes: 'Sobremesa italiana com café e mascarpone',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 22.00,
    qtd_estoque: 12,
    categoria_id: '4',
    fornecedor_ids: ['1'],
  },
  {
    id: '5',
    nome: 'Salmão Grelhado',
    marca: 'Casa',
    detalhes: 'Salmão fresco com molho de ervas e arroz',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 58.00,
    qtd_estoque: 10,
    categoria_id: '2',
    fornecedor_ids: ['2'],
  },
  {
    id: '6',
    nome: 'Suco Natural',
    marca: 'Casa',
    detalhes: 'Laranja, limão ou morango - 500ml',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 12.00,
    qtd_estoque: 20,
    categoria_id: '3',
    fornecedor_ids: ['1'],
  },
];

interface CartItem {
  produto: Produto;
  quantidade: number;
}

export default function PedidoMesaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Pega dados da mesa da URL
  const mesaNumero = parseInt(searchParams.get('mesa') || '0');
  const capacidade = parseInt(searchParams.get('capacidade') || '4');
  const codigoMesa = searchParams.get('codigo') || '';

  const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pedidoAtivo, setPedidoAtivo] = useState<Pedido | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Redireciona se não tiver mesa selecionada
  useEffect(() => {
    if (!mesaNumero) {
      toast.error('Nenhuma mesa selecionada', {
        description: 'Selecione uma mesa para continuar',
      });
      router.push('/cliente/select-mesa');
    }
  }, [mesaNumero, router]);

  const categoriaIcons = {
    '1': UtensilsCrossed,
    '2': Pizza,
    '3': Coffee,
    '4': IceCream,
  };

  const filteredProdutos = mockProdutos.filter((produto) => {
    const matchesCategoria = selectedCategoria === 'all' || produto.categoria_id === selectedCategoria;
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.detalhes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategoria && matchesSearch;
  });

  const handleAddToCart = (produto: Produto, quantidadeDelta: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.produto.id === produto.id);
      
      if (existingItem) {
        const newQuantidade = existingItem.quantidade + quantidadeDelta;
        
        if (newQuantidade <= 0) {
          return prevCart.filter((item) => item.produto.id !== produto.id);
        }
        
        return prevCart.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: newQuantidade }
            : item
        );
      } else if (quantidadeDelta > 0) {
        return [...prevCart, { produto, quantidade: quantidadeDelta }];
      }
      
      return prevCart;
    });
  };

  const handleRemoveFromCart = (produtoId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.produto.id !== produtoId));
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.produto.preco_unitario * item.quantidade,
    0
  );

  const cartItemsCount = cart.reduce((count, item) => count + item.quantidade, 0);

  const handleFinalizarPedido = () => {
    if (cart.length === 0) return;

    const novoPedido: Pedido = {
      id: Date.now().toString(),
      num_pedido: `PED${String(Date.now()).slice(-6)}`,
      data_hora: new Date().toISOString(),
      mesa_id: mesaNumero.toString(),
      total: cartTotal,
      status: 'Pendente',
      itens: cart.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        num_item: index + 1,
        quantidade: item.quantidade,
        produto_id: item.produto.id,
        produto: item.produto,
        pedido_id: Date.now().toString(),
        subtotal: item.produto.preco_unitario * item.quantidade,
      })),
    };

    setPedidoAtivo(novoPedido);
    setCart([]);
    setIsCartOpen(false);
    toast.success('Pedido realizado com sucesso!', {
      description: `Pedido #${novoPedido.num_pedido} enviado para a cozinha`,
    });
  };

  const handleChamarGarcom = () => {
    toast.success('Garçom chamado com sucesso!', {
      description: 'Um garçom estará com você em instantes.',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!mesaNumero) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Menu Digital</h1>
              <p className="text-xs text-muted-foreground">Mesa {mesaNumero}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Alternar tema"
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
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback>{getInitials(user.nome)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.nome}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Botão do Carrinho */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Seu Pedido</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="space-y-4 py-4">
                      {cart.length === 0 ? (
                        <EmptyState
                          icon={ShoppingCart}
                          title="Carrinho vazio"
                          description="Adicione itens do cardápio para fazer seu pedido"
                        />
                      ) : (
                        cart.map((item) => (
                          <Card key={item.produto.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.produto.nome}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.quantidade}x R$ {item.produto.preco_unitario.toFixed(2)}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <span className="font-semibold">
                                    R$ {(item.produto.preco_unitario * item.quantidade).toFixed(2)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveFromCart(item.produto.id)}
                                    className="h-8 w-8 text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {cart.length > 0 && (
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">R$ {cartTotal.toFixed(2)}</span>
                      </div>
                      <Button
                        onClick={handleFinalizarPedido}
                        className="w-full"
                        size="lg"
                      >
                        Finalizar Pedido
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Mesa Header */}
        <MesaHeader 
          mesaNumero={mesaNumero}
          capacidade={capacidade}
          onChamarGarcom={handleChamarGarcom}
        />

        {/* Pedido Ativo */}
        {pedidoAtivo && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Pedido em Andamento</h2>
            <PedidoAtivo pedido={pedidoAtivo} />
          </div>
        )}

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar no cardápio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro de Categorias */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Categorias</h2>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              <CategoriaChip
                label="Todos"
                isActive={selectedCategoria === 'all'}
                onClick={() => setSelectedCategoria('all')}
              />
              {mockCategorias.map((categoria) => (
                <CategoriaChip
                  key={categoria.id}
                  label={categoria.descricao}
                  icon={categoriaIcons[categoria.id as keyof typeof categoriaIcons]}
                  isActive={selectedCategoria === categoria.id}
                  onClick={() => setSelectedCategoria(categoria.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Grid de Produtos */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Cardápio</h2>
          {filteredProdutos.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum produto encontrado"
              description="Tente buscar por outro termo ou categoria"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProdutos.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}