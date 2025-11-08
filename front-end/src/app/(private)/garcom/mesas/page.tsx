"use client";

import { useState, useEffect } from 'react';
import { Mesa, MesaStatus } from '@/src/app/types';
import { MesaCard } from '@/src/app/components/MesaCard';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/app/components/ui/select';
import { Badge } from '@/src/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Plus, Search, Users, Clock, CheckCircle2, AlertCircle, XCircle, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/app/components/ui/dialog';
import { Label } from '@/src/app/components/ui/label';
import { toast } from 'sonner';

// Mock data com dados mais realistas
const mockMesas: Mesa[] = [
  { 
    id: '1', 
    numero: 1, 
    capacidade: 4, 
    status: 'Disponível',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '2', 
    numero: 2, 
    capacidade: 2, 
    status: 'Ocupada',
    clientes: 'João Silva',
    tempo_ocupacao: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min atrás
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: '3', 
    numero: 3, 
    capacidade: 6, 
    status: 'Reservada', 
    data_reserva: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2h no futuro
    clientes: 'Maria Santos',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '4', 
    numero: 4, 
    capacidade: 4, 
    status: 'Em atendimento',
    clientes: 'Pedro Costa',
    tempo_ocupacao: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '5', 
    numero: 5, 
    capacidade: 8, 
    status: 'Disponível',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '6', 
    numero: 6, 
    capacidade: 2, 
    status: 'Fechada',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '7', 
    numero: 7, 
    capacidade: 4, 
    status: 'Disponível',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date().toISOString()
  },
  { 
    id: '8', 
    numero: 8, 
    capacidade: 6, 
    status: 'Ocupada',
    clientes: 'Ana Oliveira',
    tempo_ocupacao: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min atrás
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date().toISOString()
  },
];

export default function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>(mockMesas);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    capacidade: '',
    status: 'Disponível' as MesaStatus,
  });

  // Atualizar tempos de ocupação em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMesas(prevMesas => 
        prevMesas.map(mesa => ({
          ...mesa,
          updated_at: new Date().toISOString()
        }))
      );
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  const filteredMesas = mesas.filter((mesa) => {
    const matchesSearch = mesa.numero.toString().includes(searchTerm) ||
                         mesa.clientes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mesa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (mesa: Mesa) => {
    setSelectedMesa(mesa);
  };

  const handleCreate = () => {
    setFormData({ numero: '', capacidade: '', status: 'Disponível' });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se já existe mesa com esse número
    const existingMesa = mesas.find(m => m.numero === parseInt(formData.numero));
    if (existingMesa) {
      toast.error(`Já existe uma mesa com o número ${formData.numero}`);
      return;
    }

    const newMesa: Mesa = {
      id: Date.now().toString(),
      numero: parseInt(formData.numero),
      capacidade: parseInt(formData.capacidade),
      status: formData.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setMesas([...mesas, newMesa]);
    setShowForm(false);
    toast.success(`Mesa ${formData.numero} criada com sucesso!`);
  };

  // Função para calcular tempo de ocupação
  const getTempoOcupacao = (tempo_ocupacao: string) => {
    const diff = Date.now() - new Date(tempo_ocupacao).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    }
    return `${minutes}min`;
  };

  // Função para formatar data de reserva
  const formatDataReserva = (data: string) => {
    const date = new Date(data);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) {
      return 'Reserva vencida';
    } else if (hours === 0) {
      return `Em ${minutes}min`;
    } else {
      return `Em ${hours}h ${minutes}min`;
    }
  };

  const getStatusIcon = (status: MesaStatus) => {
    switch (status) {
      case 'Disponível':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Ocupada':
        return <Users className="h-4 w-4 text-red-500" />;
      case 'Reservada':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'Em atendimento':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Fechada':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: MesaStatus) => {
    switch (status) {
      case 'Disponível': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'Ocupada': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'Reservada': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'Em atendimento': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'Fechada': return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  // Estatísticas
  const stats = {
    total: mesas.length,
    disponivel: mesas.filter(m => m.status === 'Disponível').length,
    ocupada: mesas.filter(m => m.status === 'Ocupada').length,
    reservada: mesas.filter(m => m.status === 'Reservada').length,
    atendimento: mesas.filter(m => m.status === 'Em atendimento').length,
    fechada: mesas.filter(m => m.status === 'Fechada').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Mesas</h1>
          <p className="text-muted-foreground">
            Monitore e gerencie todas as mesas do estabelecimento
          </p>
        </div>
        <Button onClick={handleCreate} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nova Mesa
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Mesas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.disponivel}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupadas</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.ocupada}</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservadas</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.reservada}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atendimento</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.atendimento}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechadas</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.fechada}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número da mesa ou nome do cliente..."
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
            <SelectItem value="Disponível">Disponível</SelectItem>
            <SelectItem value="Reservada">Reservada</SelectItem>
            <SelectItem value="Ocupada">Ocupada</SelectItem>
            <SelectItem value="Em atendimento">Em atendimento</SelectItem>
            <SelectItem value="Fechada">Fechada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de Mesas */}
      {filteredMesas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Nenhuma mesa encontrada</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar seus filtros de busca.'
                : 'Comece adicionando mesas ao sistema.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeira Mesa
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMesas.map((mesa) => (
            <Card key={mesa.id} className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer" onClick={() => handleView(mesa)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Mesa {mesa.numero}</CardTitle>
                  <Badge className={`${getStatusColor(mesa.status)} border`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(mesa.status)}
                      {mesa.status}
                    </div>
                  </Badge>
                </div>
                <CardDescription>
                  Capacidade: {mesa.capacidade} {mesa.capacidade === 1 ? 'pessoa' : 'pessoas'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mesa.clientes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{mesa.clientes}</span>
                    </div>
                    {mesa.tempo_ocupacao && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Há {getTempoOcupacao(mesa.tempo_ocupacao)}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {mesa.data_reserva && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDataReserva(mesa.data_reserva)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Visualização - APENAS LEITURA */}
      <Dialog open={!!selectedMesa} onOpenChange={() => setSelectedMesa(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Mesa {selectedMesa?.numero}
              {selectedMesa && (
                <Badge className={`${getStatusColor(selectedMesa.status)} border`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(selectedMesa.status)}
                    {selectedMesa.status}
                  </div>
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas da mesa
            </DialogDescription>
          </DialogHeader>
          
          {selectedMesa && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Número</Label>
                  <p className="font-medium">{selectedMesa.numero}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Capacidade</Label>
                  <p className="font-medium">{selectedMesa.capacidade} pessoas</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Status Atual</Label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(selectedMesa.status)} border text-sm`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedMesa.status)}
                      {selectedMesa.status}
                    </div>
                  </Badge>
                </div>
              </div>

              {selectedMesa.clientes && (
                <div>
                  <Label className="text-muted-foreground">Cliente</Label>
                  <p className="font-medium">{selectedMesa.clientes}</p>
                </div>
              )}

              {selectedMesa.tempo_ocupacao && (
                <div>
                  <Label className="text-muted-foreground">Tempo de Ocupação</Label>
                  <p className="font-medium">{getTempoOcupacao(selectedMesa.tempo_ocupacao)}</p>
                </div>
              )}

              {selectedMesa.data_reserva && (
                <div>
                  <Label className="text-muted-foreground">Reserva</Label>
                  <p className="font-medium">
                    {new Date(selectedMesa.data_reserva).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDataReserva(selectedMesa.data_reserva)}
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground border-t pt-3">
                <div>Criada em: {new Date(selectedMesa.created_at).toLocaleString('pt-BR')}</div>
                <div>Atualizada em: {new Date(selectedMesa.updated_at).toLocaleString('pt-BR')}</div>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  ℹ️ <strong>Nota:</strong> O status da mesa é alterado automaticamente quando um cliente a ocupa ou libera. 
                  Para reservas e outras alterações, entre em contato com a gerência.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Mesa</DialogTitle>
            <DialogDescription>
              Adicione uma nova mesa ao sistema
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="numero">Número da Mesa</Label>
              <Input
                id="numero"
                type="number"
                min="1"
                placeholder="Ex: 1, 2, 3..."
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input
                id="capacidade"
                type="number"
                min="1"
                max="20"
                placeholder="Ex: 4 pessoas"
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status Inicial</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as MesaStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Fechada">Fechada (Manutenção)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Criar Mesa
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
