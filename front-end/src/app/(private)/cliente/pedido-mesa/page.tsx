"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/app/contexts/AuthContext";
import { Button } from "@/src/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { Separator } from "@/src/app/components/ui/separator";
import { Input } from "@/src/app/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/src/app/components/ui/tabs";
import { ScrollArea } from "@/src/app/components/ui/scroll-area";
import {
  mesasAPI,
  pedidosAPI,
  produtosAPI,
  categoriasAPI,
} from "@/src/app/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  LogOut,
  UtensilsCrossed,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  Minus,
  ShoppingCart,
  X,
  ChevronRight,
  Package,
  DollarSign,
} from "lucide-react";

// --- Interfaces ---
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
  status_preparo?: string;
  pagamento: string;
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
    marca: string;
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

  // Estados da Mesa e Pedidos
  const [mesa, setMesa] = useState<Mesa | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [criandoPedido, setCriandoPedido] = useState(false);

  // Estados do Cardápio
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCardapio, setLoadingCardapio] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todos");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [ordenacao, setOrdenacao] = useState<"nome" | "preco_asc" | "preco_desc">("nome");

  // --- Efeitos ---

  useEffect(() => {
    if (!isCliente) {
      router.push("/");
      return;
    }
    if (!user?.mesa_id) {
      router.push("/cliente/select-mesa");
      return;
    }
    loadMesaData();
    loadCardapioData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.mesa_id, isCliente, router]);

  // --- Funções de Carregamento ---

  const loadCardapioData = async () => {
    try {
      setLoadingCardapio(true);
      const [produtosData, categoriasData] = await Promise.all([
        produtosAPI.list({ include: "categoria" }),
        categoriasAPI.list(),
      ]);
      setProdutos((Array.isArray(produtosData) ? produtosData : []) as Produto[]);
      setCategorias((Array.isArray(categoriasData) ? categoriasData : []) as Categoria[]);
    } catch (error) {
      console.error("Erro ao carregar cardápio:", error);
      toast.error("Erro ao carregar cardápio");
    } finally {
      setLoadingCardapio(false);
    }
  };

  const loadMesaData = async () => {
    if (!user?.mesa_id) return;
    try {
      setLoading(true);
      const mesaData = (await mesasAPI.get(user.mesa_id)) as Mesa;
      setMesa(mesaData);

      try {
        const todosPedidos = (await pedidosAPI.list({
          include: "itens.produto",
        })) as Pedido[];
        
        const pedidosDaMesa = todosPedidos.filter(
          (p) => p.mesa_id === user.mesa_id
        );
        
        pedidosDaMesa.sort(
          (a, b) =>
            new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime()
        );
        
        setPedidos(pedidosDaMesa);

        // Sincronização de total (se houver divergência)
        const totalPedidos = pedidosDaMesa.reduce(
          (sum, p) => sum + p.valor,
          0
        );
        if (
          pedidosDaMesa.length > 0 &&
          Math.abs(mesaData.total - totalPedidos) > 0.01
        ) {
          setMesa((prev) => (prev ? { ...prev, total: totalPedidos } : null));
        }
      } catch (err) {
        console.error(err);
        setPedidos([]);
      }
    } catch (error) {
      console.error("Erro ao carregar mesa:", error);
      toast.error("Erro ao carregar informações da mesa");
      updateUser({ mesa_id: undefined });
      router.push("/cliente/select-mesa");
    } finally {
      setLoading(false);
    }
  };

  // --- Funções de Ação ---

  const handleConfirmarPedido = async (itens: ItemCarrinho[]) => {
    if (!user?.mesa_id) return;
    setCriandoPedido(true);
    try {
      const total = itens.reduce(
        (sum, item) => sum + item.produto.preco_unitario * item.quantidade,
        0
      );
      // Gera número aleatório para simulação
      const numPedido =
        (Date.now() % 1000000) + Math.floor(Math.random() * 1000);

      const dadosPedido = {
        num_pedido: numPedido,
        mesa_id: user.mesa_id,
        valor: parseFloat(total.toFixed(2)),
        itens: {
          create: itens.map((item, index) => ({
            num_item: index + 1,
            quantidade: item.quantidade,
            produto_id: item.produto.id,
          })),
        },
      };

      await pedidosAPI.create(dadosPedido);
      toast.success("Pedido realizado com sucesso!", {
        description: `${itens.length} item(ns) - Total: R$ ${total.toFixed(2)}`,
      });
      setCarrinho([]);
      await loadMesaData();
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Erro ao realizar pedido", {
        description: error?.response?.data?.message || "Tente novamente",
      });
    } finally {
      setCriandoPedido(false);
    }
  };

  const handleConfirmarPedidoCarrinho = async () => {
    if (carrinho.length === 0) {
      toast.error("Adicione itens ao carrinho");
      return;
    }
    await handleConfirmarPedido(carrinho);
  };

  const handleLeaveMesa = async () => {
    if (!user?.mesa_id || !mesa) return;

    const pedidosNaoPagos = pedidos.filter((p) => p.pagamento !== "pago");
    if (pedidosNaoPagos.length > 0) {
      toast.error("Não é possível sair da mesa", {
        description: `Você tem ${pedidosNaoPagos.length} pedido(s) pendente(s).`,
      });
      return;
    }

    if (
      !window.confirm(`Tem certeza que deseja sair da Mesa ${mesa.numero_mesa}?`)
    )
      return;

    setLeaving(true);
    try {
      await mesasAPI.sairDaMesa(user.mesa_id);
      toast.success("Você saiu da mesa com sucesso!");
      updateUser({ mesa_id: undefined });
      router.push("/cliente/select-mesa");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao sair da mesa");
      setLeaving(false);
    }
  };

  // --- Helpers de Carrinho e Filtros ---

  const produtosFiltrados = produtos
    .filter((produto) => {
      const matchSearch =
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.detalhes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.marca?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategoria =
        selectedCategoria === "todos" ||
        produto.categoria_id === selectedCategoria;
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
          toast.error(`Estoque máximo atingido: ${produto.qtd_estoque}`);
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
    toast.success(`${produto.nome} adicionado!`);
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
    toast.info("Carrinho limpo");
  };

  const calcularTotal = () =>
    carrinho.reduce(
      (total, item) => total + item.produto.preco_unitario * item.quantidade,
      0
    );

  const getQuantidadeNoCarrinho = (produtoId: string) =>
    carrinho.find((i) => i.produto.id === produtoId)?.quantidade || 0;

  // --- Formatação e UI ---

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "livre":
        return "bg-green-500 hover:bg-green-600 border-green-600";
      case "ocupada":
        return "bg-orange-500 hover:bg-orange-600 border-orange-600";
      case "reservada":
        return "bg-yellow-500 hover:bg-yellow-600 border-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!mesa) return null;

  return (
    <div className="min-h-screen bg-transparent p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* --- HEADER DA MESA --- */}
        <Card className="glass-panel border-orange-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4 flex-1 min-w-[250px]">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <UtensilsCrossed className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Mesa {mesa.numero_mesa}
                    </CardTitle>
                    <Badge
                      className={`${getStatusColor(
                        mesa.status
                      )} text-white shadow-sm`}
                    >
                      {mesa.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex flex-col gap-1 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Capacidade: {mesa.capacidade} pessoas
                    </span>
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeaveMesa}
                disabled={leaving}
                className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                {leaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Sair da Mesa
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* --- CARDÁPIO DIGITAL --- */}
        <Card className="glass-panel border-orange-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl mb-2 text-foreground">
                  <UtensilsCrossed className="h-6 w-6 text-primary" />
                  Cardápio Digital
                </CardTitle>
                <CardDescription>
                  Explore nossos produtos e adicione ao carrinho
                </CardDescription>
              </div>
              {carrinho.length > 0 && (
                <div className="flex items-center gap-3 bg-white/50 rounded-xl px-4 py-2.5 shadow-sm border border-orange-200 backdrop-blur-sm">
                  <Badge
                    variant="secondary"
                    className="text-base px-3 py-1.5 bg-orange-100 text-orange-800 hover:bg-orange-200"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {carrinho.reduce(
                      (total, item) => total + item.quantidade,
                      0
                    )}{" "}
                    itens
                  </Badge>
                  <div className="h-6 w-px bg-orange-200"></div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-medium">
                      Total
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {calcularTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 sm:pl-12 h-10 sm:h-11 bg-white/50 border-orange-200 focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground/70"
                  />
                </div>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value as any)}
                  className="px-3 py-2 border border-orange-200 rounded-lg bg-white/50 text-sm sm:text-base font-medium w-full sm:w-auto sm:min-w-[160px] h-10 sm:h-11 cursor-pointer hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                >
                  <option value="nome">📝 Nome A-Z</option>
                  <option value="preco_asc">💰 Menor Preço</option>
                  <option value="preco_desc">💎 Maior Preço</option>
                </select>
              </div>

              <Tabs
                value={selectedCategoria}
                onValueChange={setSelectedCategoria}
                className="w-full"
              >
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                  <TabsList className="inline-flex w-auto h-auto p-1 bg-white/40 rounded-xl border border-orange-100">
                    <TabsTrigger
                      value="todos"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
                    >
                      <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Todos</span>
                    </TabsTrigger>
                    {categorias.map((categoria) => (
                      <TabsTrigger
                        key={categoria.id}
                        value={categoria.id}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
                      >
                        <span>{categoria.descricao}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>
              </Tabs>
            </div>

            {/* Lista de Produtos */}
            <ScrollArea className="h-[600px]">
              {loadingCardapio ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : produtosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <UtensilsCrossed className="w-12 h-12 text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground">
                    Nenhum produto encontrado
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
                  {produtosFiltrados.map((produto) => {
                    const quantidadeNoCarrinho = getQuantidadeNoCarrinho(
                      produto.id
                    );

                    return (
                      <Card
                        key={produto.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-orange-200 bg-white/80 backdrop-blur-sm group flex flex-col"
                      >
                        <div className="relative aspect-[4/3] bg-orange-50 overflow-hidden">
                          {produto.imagem ? (
                            <img
                              src={produto.imagem}
                              alt={produto.nome}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-orange-300">
                              <UtensilsCrossed className="w-12 h-12 mb-2 opacity-50" />
                            </div>
                          )}
                          {produto.categoria && (
                            <Badge className="absolute top-2 left-2 bg-white/90 text-orange-800 shadow-sm text-xs font-bold border-0">
                              {produto.categoria.descricao}
                            </Badge>
                          )}
                          {quantidadeNoCarrinho > 0 && (
                            <div className="absolute bottom-2 right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-white">
                              {quantidadeNoCarrinho}
                            </div>
                          )}
                        </div>

                        <CardHeader className="p-4 pb-2 space-y-1 flex-1">
                          <CardTitle className="text-base line-clamp-1 font-bold">
                            {produto.nome}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-xs h-8">
                            {produto.detalhes || produto.marca}
                          </CardDescription>
                        </CardHeader>

                        <CardFooter className="p-4 pt-2 flex flex-col gap-3 border-t border-orange-100 bg-orange-50/30">
                          <div className="flex items-end justify-between w-full">
                            <div className="text-xl font-bold text-primary">
                              {formatCurrency(produto.preco_unitario)}
                            </div>
                            <span className="text-xs text-muted-foreground border border-orange-200 rounded px-1">
                              {produto.unidade_medida}
                            </span>
                          </div>

                          {quantidadeNoCarrinho === 0 ? (
                            <Button
                              size="sm"
                              onClick={() => adicionarAoCarrinho(produto)}
                              className="w-full bg-white border border-orange-200 text-orange-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm font-semibold"
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
                                className="flex-1 border-orange-200"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <div className="font-bold text-primary w-6 text-center">
                                {quantidadeNoCarrinho}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => adicionarAoCarrinho(produto)}
                                className="flex-1 bg-primary text-white hover:bg-primary/90"
                                disabled={
                                  quantidadeNoCarrinho >= produto.qtd_estoque
                                }
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

          {/* Footer Flutuante do Carrinho */}
          {carrinho.length > 0 && (
            <div className="fixed bottom-4 left-4 right-4 z-50 md:absolute md:bottom-auto md:left-auto md:right-auto md:relative">
              <Card className="bg-white/95 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Total do Pedido
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(calcularTotal())}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {carrinho.reduce((a, b) => a + b.quantidade, 0)} itens
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={limparCarrinho}
                      size="icon"
                      className="border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleConfirmarPedidoCarrinho}
                      disabled={criandoPedido}
                      className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-6"
                    >
                      {criandoPedido ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Confirmar <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Card>

        {/* --- HISTÓRICO DE PEDIDOS --- */}
        <Card className="glass-panel border-orange-200 mb-20 md:mb-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Pedidos Realizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pedidos.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                Você ainda não fez pedidos nesta sessão.
              </div>
            ) : (
              <div className="space-y-3">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-white/60 border border-orange-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-primary">
                          Pedido #{pedido.num_pedido}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(pedido.data_hora)}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-white/80">
                        {pedido.status_preparo || "Aguardando"}
                      </Badge>
                    </div>
                    {pedido.itens?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm py-1 border-b border-dashed border-orange-100 last:border-0"
                      >
                        <span className="text-foreground/80">
                          {item.quantidade}x {item.produto?.nome}
                        </span>
                        <span className="font-medium text-foreground">
                          R${" "}
                          {(
                            item.quantidade *
                            (item.produto?.preco_unitario || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-orange-200 flex justify-between items-center">
                      <span className="text-sm font-bold text-foreground">
                        Total
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(pedido.valor)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}