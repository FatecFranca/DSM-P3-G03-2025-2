"use client";

import { useState, useEffect } from 'react';
import { Pedido, ItemPedido, Produto, Mesa, Garcom, PedidoStatus } from '@/src/app/types';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Badge } from '@/src/app/components/ui/badge';
import { Separator } from '@/src/app/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/app/components/ui/select';
import { Label } from '@/src/app/components/ui/label';
import { StatusBadge } from '@/src/app/components/StatusBadge';
import { MetricCard } from '@/src/app/components/MetricCard';
import { 
  Plus, 
  Search, 
  Clock, 
  Users, 
  ChefHat, 
  DollarSign, 
  Eye, 
  Trash2, 
  ShoppingCart,
  Calendar,
  Timer,
  User as UserIcon,
  Package,
  Edit,
  Check,
  X,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/app/components/ui/dialog';
import { toast } from 'sonner';
import {
  Alert,
  AlertDescription,
} from '@/src/app/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/app/components/ui/tabs';

// Mock data expandido com interfaces corretas
// ✅ Mock data corrigido com propriedades obrigatórias
const mockPedidos: Pedido[] = [
  {
    id: '1',
    num_pedido: 'PED001',
    data_hora: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
    mesa_id: '1',
    mesa: { id: '1', numero: 1, capacidade: 4, status: 'Ocupada', created_at: '', updated_at: '' },
    garcom_id: '1',
    garcom: { 
      id: '1', 
      nome: 'João Silva', 
      cpf: '123.456.789-00',
      email: 'joao@restaurantsys.com',
      celular: '(11) 99999-1111',
      turno: 'Manhã',
      ativo: true
    },
    status: 'Em andamento',
    total: 125.50,
    itens: [
      { 
        id: '1',
        num_item: 1,
        pedido_id: '1', 
        produto_id: '1', 
        quantidade: 2,
        subtotal: 59.90,
        observacoes: 'Bem passado'
      },
      { 
        id: '2',
        num_item: 2,
        pedido_id: '1', 
        produto_id: '2', 
        quantidade: 3,
        subtotal: 75.00,
        observacoes: ''
      },
    ],
  },
  {
    id: '2',
    num_pedido: 'PED002',
    data_hora: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min atrás
    mesa_id: '3',
    mesa: { id: '3', numero: 3, capacidade: 6, status: 'Ocupada', created_at: '', updated_at: '' },
    garcom_id: '2',
    garcom: { 
      id: '2', 
      nome: 'Maria Santos', 
      cpf: '987.654.321-00',
      email: 'maria@restaurantsys.com',
      celular: '(11) 99999-2222',
      turno: 'Tarde',
      ativo: true
    },
    status: 'Pendente',
    total: 89.90,
    itens: [
      { 
        id: '3',
        num_item: 1,
        pedido_id: '2', 
        produto_id: '3', 
        quantidade: 2,
        subtotal: 30.00
      },
      { 
        id: '4',
        num_item: 2,
        pedido_id: '2', 
        produto_id: '1', 
        quantidade: 2,
        subtotal: 59.90
      },
    ],
  },
  {
    id: '3',
    num_pedido: 'PED003',
    data_hora: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min atrás
    mesa_id: '2',
    mesa: { id: '2', numero: 2, capacidade: 2, status: 'Ocupada', created_at: '', updated_at: '' },
    garcom_id: '1',
    garcom: { 
      id: '1', 
      nome: 'João Silva', 
      cpf: '123.456.789-00',
      email: 'joao@restaurantsys.com',
      celular: '(11) 99999-1111',
      turno: 'Manhã',
      ativo: true
    },
    status: 'Concluído',
    total: 45.00,
    itens: [
      { 
        id: '5',
        num_item: 1,
        pedido_id: '3', 
        produto_id: '2', 
        quantidade: 1,
        subtotal: 25.00
      },
      { 
        id: '6',
        num_item: 2,
        pedido_id: '3', 
        produto_id: '4', 
        quantidade: 2,
        subtotal: 20.00
      },
    ],
  },
  {
    id: '4',
    num_pedido: 'PED004',
    data_hora: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1h atrás
    mesa_id: '4',
    mesa: { id: '4', numero: 4, capacidade: 4, status: 'Disponível', created_at: '', updated_at: '' },
    garcom_id: '2',
    garcom: { 
      id: '2', 
      nome: 'Maria Santos', 
      cpf: '987.654.321-00',
      email: 'maria@restaurantsys.com',
      celular: '(11) 99999-2222',
      turno: 'Tarde',
      ativo: true
    },
    status: 'Concluído',
    total: 178.50,
    itens: [
      { 
        id: '7',
        num_item: 1,
        pedido_id: '4', 
        produto_id: '1', 
        quantidade: 3,
        subtotal: 89.85
      },
      { 
        id: '8',
        num_item: 2,
        pedido_id: '4', 
        produto_id: '3', 
        quantidade: 4,
        subtotal: 60.00
      },
      { 
        id: '9',
        num_item: 3,
        pedido_id: '4', 
        produto_id: '4', 
        quantidade: 3,
        subtotal: 28.65
      },
    ],
  },
];

const mockProdutos: Produto[] = [
  { 
    id: '1', 
    nome: 'Hambúrguer Artesanal', 
    marca: 'Casa',
    detalhes: 'Hambúrguer 180g com bacon e queijo',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 29.95, 
    qtd_estoque: 50,
    categoria_id: '1',
    fornecedor_ids: ['1']
  },
  { 
    id: '2', 
    nome: 'Pizza Margherita', 
    marca: 'Casa',
    detalhes: 'Pizza tradicional italiana com molho de tomate e manjericão',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 25.00, 
    qtd_estoque: 30,
    categoria_id: '2',
    fornecedor_ids: ['1']
  },
  { 
    id: '3', 
    nome: 'Batata Frita Grande', 
    marca: 'Casa',
    detalhes: 'Porção generosa de batatas fritas crocantes',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 15.00, 
    qtd_estoque: 100,
    categoria_id: '1',
    fornecedor_ids: ['2']
  },
  { 
    id: '4', 
    nome: 'Refrigerante Lata', 
    marca: 'Coca-Cola',
    detalhes: 'Bebida gelada 350ml',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 8.00, 
    qtd_estoque: 200,
    categoria_id: '3',
    fornecedor_ids: ['3']
  },
];

const mockMesas: Mesa[] = [
  { id: '1', numero: 1, capacidade: 4, status: 'Ocupada', created_at: '', updated_at: '' },
  { id: '2', numero: 2, capacidade: 2, status: 'Ocupada', created_at: '', updated_at: '' },
  { id: '3', numero: 3, capacidade: 6, status: 'Ocupada', created_at: '', updated_at: '' },
  { id: '4', numero: 4, capacidade: 4, status: 'Disponível', created_at: '', updated_at: '' },
  { id: '5', numero: 5, capacidade: 8, status: 'Disponível', created_at: '', updated_at: '' },
];

const mockGarcons: Garcom[] = [
  { 
    id: '1', 
    nome: 'João Silva', 
    cpf: '123.456.789-00',
    email: 'joao@restaurantsys.com',
    celular: '(11) 99999-1111',
    turno: 'Manhã',
    ativo: true
  },
  { 
    id: '2', 
    nome: 'Maria Santos', 
    cpf: '987.654.321-00',
    email: 'maria@restaurantsys.com',
    celular: '(11) 99999-2222',
    turno: 'Tarde',
    ativo: true
  },
];

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [showForm, setShowForm] = useState(false);
  // ✅ Removido garcom_id do formData
  const [formData, setFormData] = useState({
    mesa_id: '',
    observacoes: '',
    itens: [] as { produto_id: string; quantidade: number; observacoes?: string }[],
  });
  const [currentItem, setCurrentItem] = useState({ 
    produto_id: '', 
    quantidade: '1', 
    observacoes: '' 
  });

  // Atualizar pedidos a cada minuto para simular tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => ({
          ...pedido,
          // Simulando atualização timestamp se necessário
        }))
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch = 
      pedido.num_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `mesa ${pedido.mesa_id}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pedido.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Função para calcular tempo decorrido
  const getTempoDecorrido = (dataHora: string) => {
    const diff = Date.now() - new Date(dataHora).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    }
    return `${minutes}min`;
  };

  // ✅ Função para obter cor do status (CORRIGIDA)
  const getStatusColor = (status: PedidoStatus | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Em andamento': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Concluído': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // ✅ Função para obter ícone do status (CORRIGIDA)
  const getStatusIcon = (status: PedidoStatus | undefined) => {
    if (!status) return <AlertCircle className="h-4 w-4" />;
    
    switch (status) {
      case 'Pendente': return <Clock className="h-4 w-4" />;
      case 'Em andamento': return <ChefHat className="h-4 w-4" />;
      case 'Concluído': return <Check className="h-4 w-4" />;
      case 'Cancelado': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleView = (pedido: Pedido) => {
    setSelectedPedido(pedido);
  };

  const handleCreate = () => {
    // ✅ Removido garcom_id do reset do formData
    setFormData({ mesa_id: '', observacoes: '', itens: [] });
    setCurrentItem({ produto_id: '', quantidade: '1', observacoes: '' });
    setShowForm(true);
  };

  const handleAddItem = () => {
    if (currentItem.produto_id && parseInt(currentItem.quantidade) > 0) {
      setFormData({
        ...formData,
        itens: [...formData.itens, { 
          produto_id: currentItem.produto_id, 
          quantidade: parseInt(currentItem.quantidade),
          observacoes: currentItem.observacoes
        }],
      });
      setCurrentItem({ produto_id: '', quantidade: '1', observacoes: '' });
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      itens: formData.itens.filter((_, i) => i !== index),
    });
  };

  const calculateTotal = () => {
    return formData.itens.reduce((total, item) => {
      const produto = mockProdutos.find(p => p.id === item.produto_id);
      return total + (produto?.preco_unitario || 0) * item.quantidade;
    }, 0);
  };

  // ✅ Função handleSubmit sem garçom
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.itens.length === 0) {
      toast.error('Adicione pelo menos um item ao pedido');
      return;
    }

    // Buscar apenas mesa selecionada
    const mesaSelecionada = mockMesas.find(m => m.id === formData.mesa_id);

    const newPedido: Pedido = {
      id: Date.now().toString(),
      num_pedido: `PED${String(pedidos.length + 1).padStart(3, '0')}`,
      data_hora: new Date().toISOString(),
      mesa_id: formData.mesa_id,
      mesa: mesaSelecionada!, // ✅ Propriedade obrigatória
      garcom_id: '', // ✅ Campo vazio para garçom
      garcom: undefined, // ✅ Sem garçom atribuído
      status: 'Pendente',
      total: calculateTotal(),
      itens: formData.itens.map((item, index) => {
        const produto = mockProdutos.find(p => p.id === item.produto_id);
        return {
          id: `${Date.now()}-${index}`,
          num_item: index + 1,
          pedido_id: Date.now().toString(),
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          subtotal: (produto?.preco_unitario || 0) * item.quantidade,
          observacoes: item.observacoes,
        };
      }),
    };
    
    setPedidos([newPedido, ...pedidos]);
    setShowForm(false);
    toast.success(`Pedido ${newPedido.num_pedido} criado com sucesso!`);
  };

  const updatePedidoStatus = (pedidoId: string, novoStatus: PedidoStatus) => {
    setPedidos(prevPedidos =>
      prevPedidos.map(pedido =>
        pedido.id === pedidoId
          ? { ...pedido, status: novoStatus }
          : pedido
      )
    );
    toast.success(`Status atualizado para: ${novoStatus}`);
  };

  // ✅ Estatísticas (CORRIGIDAS com verificação de status)
  const stats = {
    total: pedidos.length,
    pendente: pedidos.filter(p => p.status === 'Pendente').length,
    andamento: pedidos.filter(p => p.status === 'Em andamento').length,
    concluido: pedidos.filter(p => p.status === 'Concluído').length,
    cancelado: pedidos.filter(p => p.status === 'Cancelado').length,
    totalVendas: pedidos.reduce((sum, p) => sum + (p.total || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Pedidos</h1>
          <p className="text-muted-foreground">
            Monitore e gerencie todos os pedidos em tempo real
          </p>
        </div>
        <Button onClick={handleCreate} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Pedidos"
          value={stats.total.toString()}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Pendentes"
          value={stats.pendente.toString()}
          icon={Clock}
        />
        <MetricCard
          title="Em Andamento"
          value={stats.andamento.toString()}
          icon={ChefHat}
        />
        <MetricCard
          title="Vendas Hoje"
          value={`R$ ${stats.totalVendas.toFixed(2)}`}
          icon={DollarSign}
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número do pedido ou mesa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Em andamento">Em andamento</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Pedidos em Cards */}
      {filteredPedidos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Nenhum pedido encontrado</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar seus filtros de busca.'
                : 'Comece criando um novo pedido.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Pedido
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPedidos.map((pedido) => {
            // ✅ Usar propriedades diretas da interface
            const mesa = pedido.mesa;
            const garcom = pedido.garcom;
            
            return (
              <Card 
                key={pedido.id} 
                className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => handleView(pedido)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pedido.num_pedido}</CardTitle>
                    <Badge className={`${getStatusColor(pedido.status)} border`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(pedido.status)}
                        {pedido.status || 'Indefinido'}
                      </div>
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Mesa {mesa?.numero}
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {getTempoDecorrido(pedido.data_hora)}
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* ✅ Exibir garçom apenas se existir */}
                  {garcom && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                      <span>{garcom.nome} ({garcom.turno})</span>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Itens:</span>
                      <span className="font-medium">{pedido.itens?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold text-lg">R$ {(pedido.total || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions rápidas baseadas no status */}
                  <div className="flex gap-2 pt-2" onClick={e => e.stopPropagation()}>
                    {pedido.status === 'Pendente' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updatePedidoStatus(pedido.id, 'Em andamento')}
                        className="flex-1"
                      >
                        <ChefHat className="h-3 w-3 mr-1" />
                        Iniciar
                      </Button>
                    )}
                    {pedido.status === 'Em andamento' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updatePedidoStatus(pedido.id, 'Concluído')}
                        className="flex-1"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Finalizar
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleView(pedido)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog de Visualização */}
      <Dialog open={!!selectedPedido} onOpenChange={() => setSelectedPedido(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Pedido {selectedPedido?.num_pedido}
              {selectedPedido && (
                <Badge className={`${getStatusColor(selectedPedido.status)} border`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(selectedPedido.status)}
                    {selectedPedido.status || 'Indefinido'}
                  </div>
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Detalhes completos do pedido
            </DialogDescription>
          </DialogHeader>
          
          {selectedPedido && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Mesa</Label>
                  <p className="font-medium">Mesa {selectedPedido.mesa?.numero}</p>
                </div>
                {/* ✅ Exibir garçom apenas se existir */}
                {selectedPedido.garcom && (
                  <div>
                    <Label className="text-muted-foreground">Garçom</Label>
                    <p className="font-medium">{selectedPedido.garcom.nome}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Data/Hora</Label>
                  <p className="font-medium">{new Date(selectedPedido.data_hora).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tempo Decorrido</Label>
                  <p className="font-medium">{getTempoDecorrido(selectedPedido.data_hora)}</p>
                </div>
              </div>

              <Separator />
              
              {/* Itens do Pedido */}
              <div>
                <Label className="text-lg font-semibold">Itens do Pedido</Label>
                <div className="mt-3 space-y-3">
                  {selectedPedido.itens?.map((item) => {
                    const produto = mockProdutos.find(p => p.id === item.produto_id);
                    return (
                      <Card key={item.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{produto?.nome || 'Produto desconhecido'}</h4>
                            {produto?.detalhes && (
                              <p className="text-sm text-muted-foreground">{produto.detalhes}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span>Quantidade: <strong>{item.quantidade}</strong></span>
                              <span>Unitário: <strong>R$ {produto?.preco_unitario?.toFixed(2)}</strong></span>
                            </div>
                            {item.observacoes && (
                              <div className="mt-2 text-xs bg-blue-50 text-blue-700 p-2 rounded">
                                💬 {item.observacoes}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">R$ {item.subtotal?.toFixed(2)}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Total e Ações */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total do Pedido:</span>
                  <span>R$ {(selectedPedido.total || 0).toFixed(2)}</span>
                </div>

                {/* ✅ Ações de Status (CORRIGIDAS) */}
                {selectedPedido.status && selectedPedido.status !== 'Concluído' && selectedPedido.status !== 'Cancelado' && (
                  <div className="flex gap-2">
                    {selectedPedido.status === 'Pendente' && (
                      <Button 
                        onClick={() => {
                          updatePedidoStatus(selectedPedido.id, 'Em andamento');
                          setSelectedPedido(null);
                        }}
                        className="flex-1"
                      >
                        <ChefHat className="h-4 w-4 mr-2" />
                        Iniciar Preparação
                      </Button>
                    )}
                    {selectedPedido.status === 'Em andamento' && (
                      <Button 
                        onClick={() => {
                          updatePedidoStatus(selectedPedido.id, 'Concluído');
                          setSelectedPedido(null);
                        }}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Marcar como Concluído
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => {
                        updatePedidoStatus(selectedPedido.id, 'Cancelado');
                        setSelectedPedido(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogDescription>
              Crie um novo pedido para o restaurante
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ✅ Informações Básicas - Removido campo de garçom */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="mesa">Mesa *</Label>
                <Select
                  value={formData.mesa_id}
                  onValueChange={(value) => setFormData({ ...formData, mesa_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMesas.map((mesa) => (
                      <SelectItem key={mesa.id} value={mesa.id}>
                        Mesa {mesa.numero} ({mesa.capacidade} pessoas)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Adição de Itens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Adicionar Itens ao Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[2fr_auto_1fr_auto] gap-2">
                  <Select
                    value={currentItem.produto_id}
                    onValueChange={(value) => setCurrentItem({ ...currentItem, produto_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProdutos.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id}>
                          {produto.nome} - R$ {produto.preco_unitario.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={currentItem.quantidade}
                    onChange={(e) => setCurrentItem({ ...currentItem, quantidade: e.target.value })}
                    className="w-20"
                    placeholder="Qtd"
                  />
                  <Input
                    placeholder="Observações..."
                    value={currentItem.observacoes}
                    onChange={(e) => setCurrentItem({ ...currentItem, observacoes: e.target.value })}
                  />
                  <Button type="button" onClick={handleAddItem} disabled={!currentItem.produto_id}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.itens.length > 0 && (
                  <div className="space-y-2">
                    <Label>Itens Adicionados:</Label>
                    {formData.itens.map((item, index) => {
                      const produto = mockProdutos.find(p => p.id === item.produto_id);
                      return (
                        <Card key={index} className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{produto?.nome}</span>
                                <Badge variant="outline">x{item.quantidade}</Badge>
                              </div>
                              {item.observacoes && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  💬 {item.observacoes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">
                                R$ {((produto?.preco_unitario || 0) * item.quantidade).toFixed(2)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                    
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-lg font-semibold">Total do Pedido:</span>
                      <span className="text-xl font-bold">R$ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {formData.itens.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Adicione pelo menos um item para criar o pedido.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={formData.itens.length === 0 || !formData.mesa_id}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Criar Pedido (R$ {calculateTotal().toFixed(2)})
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)} 
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}