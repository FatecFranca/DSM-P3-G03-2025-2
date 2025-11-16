"use client";
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/app/components/ui/dialog';
import { Button } from '@/src/app/components/ui/button';
import { Badge } from '@/src/app/components/ui/badge';
import { Separator } from '@/src/app/components/ui/separator';
import {
  Users,
  ShoppingCart,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Package,
  DollarSign,
} from 'lucide-react';
import { api } from '@/src/app/lib/api';

interface MesaDetalhesModalProps {
  mesaId: string | null;
  open: boolean;
  onClose: () => void;
}

interface Cliente {
  id: string;
  nome: string;
  email?: string;
  celular?: string;
  cpf?: string;
  admin?: boolean;
  mesa_id?: string;
}

interface Produto {
  id: string;
  nome: string;
  marca: string;
  preco: number; // Mapeado de 'preco_unitario'
  preco_unitario: number;
  descricao?: string;
  disponivel: boolean;
}

interface ItemPedido {
  id: string;
  quantidade: number;
  preco: number;
  produto_id: string;
  produto?: Produto;
}

interface Pedido {
  id: string;
  cliente_id: string;
  mesa_id: string;
  status: string;
  valor_total: number;
  data_hora: string;
  cliente?: Cliente;
  itens?: ItemPedido[];
}

interface Mesa {
  id: string;
  numero: number;
  capacidade: number;
  status: string;
  updatedAt: string;
}

export function MesaDetalhesModal({ mesaId, open, onClose }: MesaDetalhesModalProps) {
  const [mesa, setMesa] = useState<Mesa | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && mesaId) {
      loadMesaDetalhes();
    }
  }, [open, mesaId]);

  const loadMesaDetalhes = async () => {
    if (!mesaId) return;

    try {
      setLoading(true);

      // Carregar dados da mesa
      const mesaData = await api.get<Mesa>(`/mesas/${mesaId}`);
      setMesa(mesaData);

      // Carregar todos os clientes
      const todosClientes = await api.get<Cliente[]>('/clientes');
      // Filtrar clientes que estão nesta mesa
      const clientesDaMesa = todosClientes.filter((c: Cliente) => c.mesa_id === mesaId);
      setClientes(clientesDaMesa);

      // Carregar todos os pedidos
      const todosPedidos = await api.get<Pedido[]>('/pedidos');
      // Filtrar pedidos desta mesa
      const pedidosDaMesa = todosPedidos.filter((p: Pedido) => p.mesa_id === mesaId);
      
      // Para cada pedido, carregar o cliente e itens
      const pedidosCompletos = await Promise.all(
        pedidosDaMesa.map(async (pedido: Pedido) => {
          try {
            // Buscar cliente do pedido
            const cliente = await api.get<Cliente>(`/clientes/${pedido.cliente_id}`).catch(() => null);
            
            // Buscar itens do pedido (assumindo que existe endpoint ou dados embutidos)
            const itens = pedido.itens || [];
            
            // Para cada item, buscar o produto
            const itensCompletos = await Promise.all(
              itens.map(async (item: ItemPedido) => {
                try {
                  const produto = await api.get<Produto>(`/produtos/${item.produto_id}`).catch(() => null);
                  return { ...item, produto: produto || undefined };
                } catch {
                  return item;
                }
              })
            );

            return {
              ...pedido,
              cliente: cliente || undefined,
              itens: itensCompletos
            };
          } catch {
            return pedido;
          }
        })
      );

      setPedidos(pedidosCompletos);
    } catch (error) {
      console.error('Erro ao carregar detalhes da mesa:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-500';
    
    switch (status.toLowerCase()) {
      case 'livre':
        return 'bg-green-500';
      case 'ocupada':
        return 'bg-red-500';
      case 'reservada':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusPedido = (status?: string) => {
    if (!status) return 'bg-gray-500';
    
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-500';
      case 'em_preparo':
        return 'bg-blue-500';
      case 'pronto':
        return 'bg-green-500';
      case 'entregue':
        return 'bg-gray-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calcularTotalPedidos = () => {
    return pedidos.reduce((total, pedido) => total + Number(pedido.valor_total || 0), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {loading ? (
              <span className="text-2xl">Carregando...</span>
            ) : mesa ? (
              <>
                <span className="text-2xl">Mesa {mesa.numero}</span>
                <Badge className={getStatusColor(mesa.status)}>
                  {mesa.status}
                </Badge>
              </>
            ) : (
              <span className="text-2xl">Detalhes da Mesa</span>
            )}
          </DialogTitle>
          <DialogDescription>
            Detalhes completos da mesa e pedidos
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Carregando...</div>
          </div>
        ) : !mesa ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Mesa não encontrada</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacidade</p>
                  <p className="font-semibold">{mesa.capacidade} pessoas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Última Atualização</p>
                  <p className="font-semibold">{formatDateTime(mesa.updatedAt)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Clientes Ocupando */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Clientes ({clientes.length})
              </h3>
              {clientes.length > 0 ? (
                <div className="grid gap-3">
                  {clientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold">{cliente.nome}</p>
                          {cliente.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {cliente.email}
                            </div>
                          )}
                          {cliente.celular && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {cliente.celular}
                            </div>
                          )}
                          {cliente.cpf && (
                            <p className="text-sm text-muted-foreground">
                              CPF: {cliente.cpf}
                            </p>
                          )}
                        </div>
                        {cliente.admin && (
                          <Badge variant="secondary">Admin</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum cliente ocupando esta mesa</p>
              )}
            </div>

            <Separator />

            {/* Pedidos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Pedidos ({pedidos.length})
                </h3>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(calcularTotalPedidos())}
                  </p>
                </div>
              </div>

              {pedidos.length > 0 ? (
                <div className="space-y-4">
                  {pedidos.map((pedido) => (
                    <div
                      key={pedido.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      {/* Cabeçalho do Pedido */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusPedido(pedido.status)}>
                            {pedido.status}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {formatDateTime(pedido.data_hora)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            {formatCurrency(Number(pedido.valor_total || 0))}
                          </p>
                        </div>
                      </div>

                      {/* Cliente do Pedido */}
                      {pedido.cliente && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{pedido.cliente.nome}</span>
                        </div>
                      )}

                      {/* Itens do Pedido */}
                      {pedido.itens && pedido.itens.length > 0 && (
                        <div className="space-y-2 mt-3 pt-3 border-t">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Itens ({pedido.itens.length})
                          </p>
                          <div className="space-y-2">
                            {pedido.itens.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm bg-accent/30 rounded p-2"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{item.quantidade}x</span>
                                  <span>{item.produto?.nome || 'Produto'}</span>
                                </div>
                                <span className="font-semibold">
                                  {formatCurrency(Number(item.preco || 0) * item.quantidade)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum pedido registrado para esta mesa</p>
              )}
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}