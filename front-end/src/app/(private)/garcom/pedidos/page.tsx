"use client";
import { useState, useEffect } from "react";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Card, CardContent, CardHeader } from "@/src/app/components/ui/card";
import { Search, Eye, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { pedidosAPI } from "@/src/app/lib/api";

interface Pedido {
  id: string;
  num_pedido: number;
  mesa_id: string;
  data_hora: string;
  valor: number;
  status_preparo?: string; // Status de preparação/entrega: aguardando, em_preparo, pronto, entregue
  pagamento: string; // "pago" (default)
  garcom_id?: string;
  mesa?: {
    id: string;
    numero: number;
    numero_mesa: number;
    capacidade: number;
    status: string;
    total: number;
  };
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

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      console.log('📦 Carregando pedidos...');
      const data = await pedidosAPI.list({ include: 'mesa,itens.produto' }) as Pedido[];
      console.log('✅ Pedidos carregados:', data.length);
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Erro ao carregar pedidos:", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await pedidosAPI.update(id, { status_preparo: newStatus });
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status_preparo: newStatus } : p));
      console.log(`✅ Status do pedido atualizado para: ${newStatus}`);
    } catch (error) {
      console.error("❌ Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aguardando':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'em_preparo':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pronto':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'entregue':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aguardando':
        return <Clock className="h-4 w-4" />;
      case 'em_preparo':
        return <Package className="h-4 w-4" />;
      case 'pronto':
        return <CheckCircle className="h-4 w-4" />;
      case 'entregue':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelado':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aguardando':
        return 'Aguardando';
      case 'em_preparo':
        return 'Em Preparo';
      case 'pronto':
        return 'Pronto';
      case 'entregue':
        return 'Entregue';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredPedidos = pedidos
    .filter((pedido) => {
      const matchSearch = 
        pedido.num_pedido.toString().includes(searchTerm) ||
        pedido.mesa?.numero_mesa.toString().includes(searchTerm) ||
        pedido.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === "todos" || (pedido.status_preparo || 'aguardando').toLowerCase() === statusFilter;
      
      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime());

  const stats = {
    total: pedidos.length,
    aguardando: pedidos.filter(p => (p.status_preparo || 'aguardando').toLowerCase() === 'aguardando').length,
    emPreparo: pedidos.filter(p => (p.status_preparo || 'aguardando').toLowerCase() === 'em_preparo').length,
    prontos: pedidos.filter(p => (p.status_preparo || 'aguardando').toLowerCase() === 'pronto').length,
    valorTotal: pedidos.reduce((sum, p) => sum + p.valor, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total de Pedidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.aguardando}</div>
            <p className="text-xs text-muted-foreground">Aguardando</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{stats.emPreparo}</div>
            <p className="text-xs text-muted-foreground">Em Preparo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{stats.prontos}</div>
            <p className="text-xs text-muted-foreground">Prontos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">{formatCurrency(stats.valorTotal)}</div>
            <p className="text-xs text-muted-foreground">Valor Total Pedidos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, mesa ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="px-4 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos os Status</option>
              <option value="aguardando">Aguardando</option>
              <option value="em_preparo">Em Preparo</option>
              <option value="pronto">Prontos</option>
              <option value="entregue">Entregues</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPedidos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || statusFilter !== "todos" 
                  ? "Nenhum pedido encontrado" 
                  : "Nenhum pedido cadastrado"}
              </div>
            ) : (
              filteredPedidos.map((pedido) => (
                <Card key={pedido.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xl font-bold">
                            Pedido #{pedido.num_pedido}
                          </span>
                          {pedido.mesa && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                              Mesa {pedido.mesa.numero_mesa}
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {formatDateTime(pedido.data_hora)}
                        </div>

                        {/* Itens do Pedido */}
                        {pedido.itens && pedido.itens.length > 0 && (
                          <div className="space-y-2 border-t pt-3">
                            <p className="text-sm font-semibold text-muted-foreground">Itens do pedido:</p>
                            <div className="space-y-1">
                              {pedido.itens.map((item) => (
                                <div key={item.id} className="flex justify-between items-start text-sm pl-2">
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {item.quantidade}x {item.produto?.nome || 'Produto'}
                                    </p>
                                    {item.produto?.marca && (
                                      <p className="text-xs text-muted-foreground">
                                        {item.produto.marca}
                                      </p>
                                    )}
                                  </div>
                                  <p className="font-medium text-muted-foreground ml-2">
                                    R$ {((item.produto?.preco_unitario || 0) * item.quantidade).toFixed(2)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center gap-3 pt-2 border-t">
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(pedido.status_preparo || 'aguardando')}`}>
                              {getStatusIcon(pedido.status_preparo || 'aguardando')}
                              {getStatusLabel(pedido.status_preparo || 'aguardando')}
                            </span>
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(pedido.valor)}
                            </span>
                            <span className="text-xs text-green-600 dark:text-green-400 font-semibold ml-2">
                              ✓ Pago
                            </span>
                          </div>
                          {pedido.mesa && pedido.mesa.total > 0 && (
                            <div className="flex items-center gap-2 text-sm bg-primary/5 px-3 py-2 rounded-lg">
                              <span className="text-muted-foreground">Total acumulado da Mesa {pedido.mesa.numero_mesa}:</span>
                              <span className="font-bold text-primary">{formatCurrency(pedido.mesa.total)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:min-w-[180px]">
                        <select
                          className="px-3 py-2 border-2 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer"
                          value={pedido.status_preparo || 'aguardando'}
                          onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                        >
                          <option value="aguardando">Aguardando</option>
                          <option value="em_preparo">Em Preparo</option>
                          <option value="pronto">Pronto</option>
                          <option value="entregue">Entregue</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredPedidos.length} de {pedidos.length} pedido(s)
      </div>
    </div>
  );
}