"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/app/contexts/AuthContext";
import { Button } from "@/src/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { Separator } from "@/src/app/components/ui/separator";
import { Input } from "@/src/app/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import { ScrollArea } from "@/src/app/components/ui/scroll-area";
import { mesasAPI, clientesAPI, pedidosAPI, produtosAPI, categoriasAPI } from "@/src/app/lib/api";
import { toast } from "sonner";
import { 
  Loader2, 
  LogOut, 
  UtensilsCrossed, 
  Users, 
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  Minus,
  ShoppingCart,
  X,
  ChevronRight,
  Package,
  DollarSign
} from "lucide-react";

interface Mesa {
  id: string;
  numero: number;
  numero_mesa: number;
  capacidade: number;
  status: string;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Pedido {
  id: string;
  num_pedido: number;
  mesa_id: string;
  data_hora: string;
  valor: number;
  status_preparo?: string; // Status de preparação/entrega: aguardando, em_preparo, pronto, entregue
  pagamento: string; // "pago" (default)
  garcom_id?: string;
  itens?: ItemPedido[];
}

interface ItemPedido {
  id: string;
  num_item: number;
  quantidade: number;
  produto_id: string;
  produto?: {
    id: string;
    nome: string;
    preco_unitario: number;
  };
}

interface Produto {
  id: string;
  nome: string;
  marca: string;
  detalhes?: string;
  preco_unitario: number;
  qtd_estoque: number;
  quantidade: number;
  unidade_medida: string;
  categoria_id: string;
  imagem?: string;
  categoria?: {
    id: string;
    descricao: string;
  };
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface Categoria {
  id: string;
  descricao: string;
}

export default function PedidoMesaPage() {
  const router = useRouter();
  const { user, updateUser, isCliente } = useAuth();
  const [mesa, setMesa] = useState<Mesa | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [criandoPedido, setCriandoPedido] = useState(false);
  
  // Estados do cardápio
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCardapio, setLoadingCardapio] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todos");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [ordenacao, setOrdenacao] = useState<"nome" | "preco_asc" | "preco_desc">("nome");

  useEffect(() => {
    if (!isCliente) {
      console.log('⚠️ Usuário não é cliente');
      router.push("/");
      return;
    }

    if (!user?.mesa_id) {
      console.log('⚠️ Cliente sem mesa, redirecionando...');
      router.push("/cliente/select-mesa");
      return;
    }

    loadMesaData();
    loadCardapioData();
  }, [user?.mesa_id, isCliente, router]);

  const loadCardapioData = async () => {
    try {
      setLoadingCardapio(true);
      console.log('📦 Carregando produtos e categorias...');

      const [produtosData, categoriasData] = await Promise.all([
        produtosAPI.list({ include: 'categoria' }),
        categoriasAPI.list()
      ]);

      console.log('✅ Produtos carregados:', (produtosData as Produto[]).length);
      console.log('✅ Categorias carregadas:', (categoriasData as Categoria[]).length);

      setProdutos(produtosData as Produto[]);
      setCategorias(categoriasData as Categoria[]);
    } catch (error) {
      console.error('❌ Erro ao carregar cardápio:', error);
      toast.error('Erro ao carregar cardápio');
    } finally {
      setLoadingCardapio(false);
    }
  };

  const loadMesaData = async () => {
    if (!user?.mesa_id) return;

    try {
      setLoading(true);
      console.log('📍 Carregando dados da mesa:', user.mesa_id);

      const mesaData = await mesasAPI.get(user.mesa_id) as Mesa;
      console.log('✅ Mesa carregada:', mesaData);
      console.log('📊 Status da mesa:', mesaData.status);
      console.log('💰 Total da mesa (do banco):', mesaData.total);
      setMesa(mesaData);

      try {
        const todosPedidos = await pedidosAPI.list({ include: 'itens.produto' }) as Pedido[];
        const pedidosDaMesa = todosPedidos.filter((p) => p.mesa_id === user.mesa_id);
        // Ordenar por data mais recente
        pedidosDaMesa.sort((a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime());
        setPedidos(pedidosDaMesa);
        
        // Calcular total dos pedidos para validação
        const totalPedidos = pedidosDaMesa.reduce((sum, p) => sum + p.valor, 0);
        console.log('✅ Pedidos carregados:', pedidosDaMesa.length);
        console.log('💰 Soma dos valores dos pedidos:', totalPedidos.toFixed(2));
        console.log('⚠️ Diferença entre mesa.total e soma:', (mesaData.total - totalPedidos).toFixed(2));
        
        // Se houver diferença significativa, atualizar mesa com total calculado
        if (pedidosDaMesa.length > 0 && Math.abs(mesaData.total - totalPedidos) > 0.01) {
          console.log('🔄 Sincronizando total da mesa...');
          setMesa(prev => prev ? { ...prev, total: totalPedidos } : null);
        }
      } catch (err) {
        console.log('ℹ️ Nenhum pedido encontrado ou erro ao carregar');
        setPedidos([]);
      }

    } catch (error) {
      console.error("❌ Erro ao carregar mesa:", error);
      toast.error("Erro ao carregar informações da mesa");
      
      updateUser({ mesa_id: undefined });
      router.push("/cliente/select-mesa");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarPedido = async (itens: ItemCarrinho[]) => {
    if (!user?.mesa_id) return;

    setCriandoPedido(true);

    try {
      console.log('🛒 Criando pedido com itens:', itens);

      const total = itens.reduce((sum, item) => sum + (item.produto.preco_unitario * item.quantidade), 0);

      // Gerar número único para o pedido (timestamp + random
      const numPedido = Date.now() % 1000000 + Math.floor(Math.random() * 1000);

      // Criar pedido conforme schema do Prisma
      // Pagamento imediato - pedido é pago na criação
      // Status_preparo representa preparação/entrega: aguardando, em_preparo, pronto, entregue
      const dadosPedido = {
        num_pedido: numPedido,
        mesa_id: user.mesa_id,
        valor: parseFloat(total.toFixed(2)), // Float, não string
        itens: {
          create: itens.map((item, index) => ({
            num_item: index + 1,
            quantidade: item.quantidade,
            produto_id: item.produto.id,
          }))
        }
      };

      console.log('📤 Enviando pedido:', dadosPedido);

      const novoPedido = await pedidosAPI.create(dadosPedido);

      console.log('✅ Pedido criado:', novoPedido);
      
      toast.success('Pedido realizado com sucesso!', {
        description: `${itens.length} ${itens.length === 1 ? 'item' : 'itens'} - Total: R$ ${total.toFixed(2)}`
      });

      // Limpar carrinho e recarregar dados
      setCarrinho([]);
      await loadMesaData();

    } catch (error: any) {
      console.error('❌ Erro ao criar pedido:', error);
      toast.error('Erro ao realizar pedido', {
        description: error?.response?.data?.message || error?.message || 'Tente novamente'
      });
    } finally {
      setCriandoPedido(false);
    }
  };

  // Funções do cardápio
  const produtosFiltrados = produtos
    .filter((produto) => {
      const matchSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.detalhes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.marca?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategoria = selectedCategoria === "todos" || produto.categoria_id === selectedCategoria;
      const disponivel = produto.qtd_estoque > 0;
      return matchSearch && matchCategoria && disponivel;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case "preco_asc":
          return a.preco_unitario - b.preco_unitario;
        case "preco_desc":
          return b.preco_unitario - a.preco_unitario;
        case "nome":
        default:
          return a.nome.localeCompare(b.nome);
      }
    });

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.produto.id === produto.id);
      
      if (itemExistente) {
        if (itemExistente.quantidade >= produto.qtd_estoque) {
          toast.error(`Quantidade máxima disponível: ${produto.qtd_estoque}`);
          return prev;
        }
        return prev.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      
      return [...prev, { produto, quantidade: 1 }];
    });
    
    toast.success(`${produto.nome} adicionado ao carrinho`);
  };

  const removerDoCarrinho = (produtoId: string) => {
    setCarrinho((prev) => {
      const item = prev.find((i) => i.produto.id === produtoId);
      
      if (item && item.quantidade > 1) {
        return prev.map((i) =>
          i.produto.id === produtoId
            ? { ...i, quantidade: i.quantidade - 1 }
            : i
        );
      }
      
      return prev.filter((i) => i.produto.id !== produtoId);
    });
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    toast.info('Carrinho limpo');
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.produto.preco_unitario * item.quantidade), 0);
  };

  const handleConfirmarPedidoCarrinho = async () => {
    if (carrinho.length === 0) {
      toast.error('Adicione itens ao carrinho');
      return;
    }

    await handleConfirmarPedido(carrinho);
  };

  const getQuantidadeNoCarrinho = (produtoId: string) => {
    const item = carrinho.find((i) => i.produto.id === produtoId);
    return item ? item.quantidade : 0;
  };

  const handleLeaveMesa = async () => {
    if (!user?.mesa_id || !mesa) return;

    const totalPedidos = pedidos.length;
    const valorTotal = mesa.total;

    // Verificar se há pedidos não pagos
    const pedidosNaoPagos = pedidos.filter(p => p.pagamento !== 'pago');
    
    if (pedidosNaoPagos.length > 0) {
      toast.error('Não é possível sair da mesa', {
        description: `Você tem ${pedidosNaoPagos.length} pedido(s) pendente(s) de pagamento.`
      });
      return;
    }

    const mensagem = totalPedidos > 0
      ? `Tem certeza que deseja sair da Mesa ${mesa.numero_mesa}?\n\n` +
        `Você tem ${totalPedidos} pedido(s) pago(s) totalizando R$ ${valorTotal.toFixed(2)}.\n` +
        `Seus pedidos serão salvos no histórico.`
      : `Tem certeza que deseja sair da Mesa ${mesa.numero_mesa}?`;

    const confirm = window.confirm(mensagem);

    if (!confirm) return;

    setLeaving(true);

    try {
      console.log('🚪 Saindo da mesa...');

      // Chamar a rota de sair da mesa (usa token JWT automaticamente)
      const resultado = await mesasAPI.sairDaMesa(user.mesa_id) as any;
      console.log('✅ Resultado:', resultado);
      
      if (resultado.mesaLiberada) {
        toast.success("Mesa liberada com sucesso!", {
          description: `Seus ${totalPedidos} pedido(s) foram salvos no histórico. Mesa disponível para novos clientes.`
        });
      } else {
        toast.success("Você saiu da mesa com sucesso!", {
          description: `${resultado.clientesRestantes} cliente(s) ainda está(ão) na mesa.`
        });
      }

      // Atualizar estado do usuário
      updateUser({ mesa_id: undefined });

      // Redirecionar para seleção de mesa
      setTimeout(() => {
        router.push("/cliente/select-mesa");
      }, 500);

    } catch (error: any) {
      console.error("❌ Erro ao sair da mesa:", error);
      toast.error("Erro ao sair da mesa", {
        description: error?.response?.data?.message || "Tente novamente."
      });
      setLeaving(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-500 text-white";
    
    switch (status.toLowerCase()) {
      case "livre":
        return "bg-green-500 text-white";
      case "ocupada":
        return "bg-blue-500 text-white";
      case "reservada":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case "livre":
        return <CheckCircle className="h-4 w-4" />;
      case "ocupada":
        return <Clock className="h-4 w-4" />;
      case "reservada":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPreparacaoStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aguardando":
        return "bg-yellow-500 text-white";
      case "em_preparo":
        return "bg-blue-500 text-white";
      case "pronto":
        return "bg-green-500 text-white";
      case "entregue":
        return "bg-gray-500 text-white";
      case "cancelado":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPreparacaoStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "aguardando":
        return "Aguardando";
      case "em_preparo":
        return "Em Preparo";
      case "pronto":
        return "Pronto";
      case "entregue":
        return "Entregue";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando informações da mesa...</p>
        </div>
      </div>
    );
  }

  if (!mesa) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header com informações da mesa */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4 flex-1 min-w-[250px]">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-md">
                    <UtensilsCrossed className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-2xl">Mesa {mesa.numero_mesa}</CardTitle>
                      <Badge className={`${getStatusColor(mesa.status)} flex items-center gap-1`}>
                        {getStatusIcon(mesa.status)}
                        {mesa.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-col gap-1">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Capacidade: {mesa.capacidade} pessoas
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Mesa número {mesa.numero} no sistema
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLeaveMesa}
                  disabled={leaving}
                  className="shrink-0"
                >
                  {leaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saindo...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair da Mesa
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Informações detalhadas */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes da Mesa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Número da Mesa</span>
                  <span className="font-semibold">{mesa.numero_mesa}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ID do Sistema</span>
                  <span className="font-mono text-sm">{mesa.numero}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Capacidade</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {mesa.capacidade} pessoas
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status Atual</span>
                  <Badge className={getStatusColor(mesa.status)}>
                    {mesa.status}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Acumulado</span>
                  <span className="font-bold text-lg text-primary">
                    R$ {mesa.total.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sua Sessão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cliente</span>
                  <span className="font-semibold truncate max-w-[180px]">{user?.nome}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm truncate max-w-[180px]">{user?.email}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mesa Vinculada</span>
                  <span className="font-semibold">Mesa {mesa.numero_mesa}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total de Pedidos</span>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {pedidos.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção do Cardápio - INTEGRADO */}
          <Card className="border-primary/10 shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl mb-2">
                    <UtensilsCrossed className="h-6 w-6" />
                    Cardápio Digital
                  </CardTitle>
                  <CardDescription>
                    Explore nossos produtos e adicione ao carrinho
                  </CardDescription>
                </div>
                {carrinho.length > 0 && (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-background to-primary/5 rounded-xl px-4 py-2.5 shadow-md border-2 border-primary/20">
                    <Badge variant="secondary" className="text-base px-3 py-1.5">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {carrinho.reduce((total, item) => total + item.quantidade, 0)} itens
                    </Badge>
                    <div className="h-6 w-px bg-border"></div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-medium">Total</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        R$ {calcularTotal().toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Busca e Filtros */}
              <div className="space-y-4 mb-6">
                {/* Busca e Ordenação */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                    <Input
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 sm:pl-12 h-10 sm:h-11 text-sm sm:text-base"
                    />
                  </div>
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value as any)}
                    className="px-3 py-2 border rounded-lg bg-background text-sm sm:text-base font-medium w-full sm:w-auto sm:min-w-[160px] h-10 sm:h-11 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <option value="nome">📝 Nome A-Z</option>
                    <option value="preco_asc">💰 Menor Preço</option>
                    <option value="preco_desc">💎 Maior Preço</option>
                  </select>
                </div>

                {/* Tabs de Categorias */}
                <Tabs value={selectedCategoria} onValueChange={setSelectedCategoria} className="w-full">
                  <ScrollArea className="w-full whitespace-nowrap [&>div>div[style]]:!block">
                    <TabsList className="inline-flex w-auto h-auto p-1 bg-muted/50 rounded-lg">
                      <TabsTrigger 
                        value="todos" 
                        className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
                      >
                        <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Todos</span>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1">
                          {produtos.filter(p => p.qtd_estoque > 0).length}
                        </Badge>
                      </TabsTrigger>
                      {categorias.map((categoria) => {
                        const count = produtos.filter(p => p.categoria_id === categoria.id && p.qtd_estoque > 0).length;
                        return (
                          <TabsTrigger 
                            key={categoria.id} 
                            value={categoria.id} 
                            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
                          >
                            <span>{categoria.descricao}</span>
                            <Badge variant="secondary" className="text-xs px-1.5 py-0 ml-1">
                              {count}
                            </Badge>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </ScrollArea>
                </Tabs>

                {/* Info de Resultados */}
                {searchTerm && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                    <Search className="w-4 h-4 shrink-0" />
                    <span className="font-medium truncate">
                      {produtosFiltrados.length} produto(s) encontrado(s)
                    </span>
                  </div>
                )}
              </div>

              {/* Lista de Produtos */}
              <ScrollArea className="h-[600px] [&>div>div[style]]:!block">
                {loadingCardapio ? (
                  <div className="flex items-center justify-center h-full min-h-[300px]">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin mx-auto mb-3 text-primary" />
                      <p className="text-base sm:text-lg text-muted-foreground font-medium">Carregando produtos...</p>
                    </div>
                  </div>
                ) : produtosFiltrados.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-4 sm:p-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                      <UtensilsCrossed className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base max-w-md">
                      {searchTerm 
                        ? `Não encontramos produtos com "${searchTerm}"` 
                        : "Não há produtos disponíveis nesta categoria"}
                    </p>
                    {(searchTerm || selectedCategoria !== "todos") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategoria("todos");
                        }}
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
                    {produtosFiltrados.map((produto) => {
                      const quantidadeNoCarrinho = getQuantidadeNoCarrinho(produto.id);
                      
                      return (
                        <Card key={produto.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] border-2 hover:border-primary/30 flex flex-col bg-card">
                          {/* Imagem do Produto */}
                          <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted/30 overflow-hidden">
                            {produto.imagem ? (
                              <img
                                src={produto.imagem}
                                alt={produto.nome}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full bg-muted/40">
                                <UtensilsCrossed className="w-12 h-12 sm:w-14 sm:h-14 text-muted-foreground/40 mb-2" />
                                <p className="text-xs text-muted-foreground">Sem imagem</p>
                              </div>
                            )}
                            
                            {/* Badge Categoria */}
                            {produto.categoria && (
                              <Badge className="absolute top-2 left-2 backdrop-blur-sm bg-background/95 text-xs px-2 py-0.5 shadow-md">
                                {produto.categoria.descricao}
                              </Badge>
                            )}
                            
                            {/* Badge Estoque Baixo */}
                            {produto.qtd_estoque < 10 && produto.qtd_estoque > 0 && (
                              <Badge variant="destructive" className="absolute top-2 right-2 text-xs px-2 py-0.5 animate-pulse">
                                Só {produto.qtd_estoque}
                              </Badge>
                            )}
                            
                            {/* Badge Quantidade no Carrinho */}
                            {quantidadeNoCarrinho > 0 && (
                              <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-base shadow-lg ring-2 ring-primary/20">
                                {quantidadeNoCarrinho}
                              </div>
                            )}
                          </div>
                          
                          {/* Informações do Produto */}
                          <CardHeader className="p-3 sm:p-4 pb-2 space-y-1 flex-1">
                            <CardTitle className="text-sm sm:text-base lg:text-lg line-clamp-2 leading-tight font-bold">
                              {produto.nome}
                            </CardTitle>
                            <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                              {produto.marca}
                            </p>
                            {produto.detalhes && (
                              <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                                {produto.detalhes}
                              </CardDescription>
                            )}
                          </CardHeader>
                          
                          {/* Footer com Preço e Ações */}
                          <CardFooter className="flex flex-col gap-3 p-3 sm:p-4 pt-2 border-t bg-muted/20">
                            <div className="flex items-end justify-between w-full">
                              <div>
                                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 leading-none mb-1">
                                  R$ {produto.preco_unitario.toFixed(2)}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                                  <Badge variant="outline" className="text-xs font-semibold px-1.5">
                                    {produto.unidade_medida}
                                  </Badge>
                                  <span>• {produto.qtd_estoque} disp.</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Botões de Ação */}
                            {quantidadeNoCarrinho === 0 ? (
                              <Button
                                size="sm"
                                onClick={() => adicionarAoCarrinho(produto)}
                                className="w-full h-9 sm:h-10 text-xs sm:text-sm font-semibold"
                              >
                                <Plus className="w-4 h-4 mr-1.5" />
                                Adicionar
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2 w-full">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removerDoCarrinho(produto.id)}
                                  className="h-9 sm:h-10 flex-1 hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <div className="flex flex-col items-center justify-center bg-primary/10 border-2 border-primary/30 rounded-lg px-3 h-9 sm:h-10 min-w-[60px]">
                                  <span className="text-lg font-bold leading-none text-primary">
                                    {quantidadeNoCarrinho}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => adicionarAoCarrinho(produto)}
                                  className="h-9 sm:h-10 flex-1"
                                  disabled={quantidadeNoCarrinho >= produto.qtd_estoque}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>

            {/* Footer com Carrinho */}
            {carrinho.length > 0 && (
              <CardFooter className="border-t bg-muted/30 p-6">
                <div className="w-full space-y-4">
                  {/* Resumo do Carrinho */}
                  <div className="space-y-2 bg-background rounded-lg p-4 border-2 border-primary/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Itens no carrinho
                      </span>
                      <span className="font-bold">
                        {carrinho.reduce((sum, i) => sum + i.quantidade, 0)} unidades
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-base font-bold">Total do Pedido</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        R$ {calcularTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={limparCarrinho}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Limpar
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleConfirmarPedidoCarrinho}
                      disabled={criandoPedido}
                      className="flex-[2] relative overflow-hidden group shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-green-500/20 to-green-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      {criandoPedido ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin relative z-10" />
                          <span className="relative z-10">Processando...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2 relative z-10" />
                          <span className="relative z-10 font-bold">Confirmar Pedido</span>
                          <ChevronRight className="w-4 h-4 ml-1 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>

          {/* Histórico de Pedidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pedidos Recentes {pedidos.length > 0 && `(${pedidos.length})`}
              </CardTitle>
              <CardDescription>
                {pedidos.length > 0 
                  ? 'Acompanhe o histórico de pedidos da sua mesa'
                  : 'Nenhum pedido realizado ainda'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pedidos.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Você ainda não fez nenhum pedido
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Clique em "Ver Cardápio" para começar
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidos.map((pedido) => (
                    <Card key={pedido.id} className="border-l-4 border-l-primary hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header do Pedido */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-bold text-lg">Pedido #{pedido.num_pedido}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(pedido.data_hora)} às {formatTime(pedido.data_hora)}
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                                ✓ Pedido Pago
                              </p>
                            </div>
                            <Badge className={getPreparacaoStatusColor(pedido.status_preparo || 'aguardando')}>
                              {getPreparacaoStatusLabel(pedido.status_preparo || 'aguardando')}
                            </Badge>
                          </div>

                          {/* Itens do Pedido */}
                          {pedido.itens && pedido.itens.length > 0 && (
                            <>
                              <Separator />
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Itens do pedido:</p>
                                {pedido.itens.map((item) => (
                                  <div key={item.id} className="flex justify-between items-start text-sm pl-2">
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {item.quantidade}x {item.produto?.nome || 'Produto'}
                                      </p>
                                    </div>
                                    <p className="font-medium text-muted-foreground">
                                      R$ {((item.produto?.preco_unitario || 0) * item.quantidade).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {/* Total */}
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-base">Total do Pedido</span>
                            <span className="font-bold text-xl text-green-600">
                              R$ {pedido.valor.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo Financeiro da Mesa */}
          {pedidos.length > 0 && mesa && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <DollarSign className="h-5 w-5" />
                  Resumo Financeiro da Mesa {mesa.numero_mesa}
                </CardTitle>
                <CardDescription>
                  Total acumulado de todos os pedidos realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Total de Itens */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Total de Pedidos</span>
                    <span className="font-semibold text-lg">{pedidos.length}</span>
                  </div>
                  
                  <Separator />
                  
                  {/* Total de Itens Comprados */}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Itens Comprados</span>
                    <span className="font-semibold text-lg">
                      {pedidos.reduce((total, pedido) => 
                        total + (pedido.itens?.reduce((sum, item) => sum + item.quantidade, 0) || 0), 0
                      )}
                    </span>
                  </div>

                  <Separator />

                  {/* Valor Total Acumulado */}
                  <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Valor Total Acumulado</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Soma de todos os produtos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">
                        R$ {mesa.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">✓ Todos pagos</p>
                    </div>
                  </div>

                  {/* Detalhamento por Pedido */}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Detalhamento:</p>
                    {pedidos.map((pedido) => (
                      <div key={pedido.id} className="flex justify-between items-center text-sm py-1">
                        <span className="text-muted-foreground">Pedido #{pedido.num_pedido}</span>
                        <span className="font-medium">R$ {pedido.valor.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações adicionais */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Você está conectado à mesa</p>
                    <p className="text-muted-foreground">
                      Todos os pedidos feitos serão vinculados a esta mesa
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Atenção ao sair</p>
                    <p className="text-muted-foreground">
                      Ao sair da mesa, você precisará selecionar uma nova para continuar fazendo pedidos
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}