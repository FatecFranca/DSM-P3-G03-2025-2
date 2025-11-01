"use client";

import { useState } from 'react';
import { Mesa, MesaStatus } from '@/src/app/types';
import { MesaCard } from '@/src/app/components/MesaCard';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/app/components/ui/select';
import { Plus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/app/components/ui/dialog';
import { Label } from '@/src/app/components/ui/label';
import { toast } from 'sonner';

// Mock data
const mockMesas: Mesa[] = [
  { id: '1', numero: 1, capacidade: 4, status: 'Disponível' },
  { id: '2', numero: 2, capacidade: 2, status: 'Ocupada' },
  { id: '3', numero: 3, capacidade: 6, status: 'Reservada', data_reserva: new Date().toISOString() },
  { id: '4', numero: 4, capacidade: 4, status: 'Em atendimento' },
  { id: '5', numero: 5, capacidade: 8, status: 'Disponível' },
  { id: '6', numero: 6, capacidade: 2, status: 'Fechada' },
  { id: '7', numero: 7, capacidade: 4, status: 'Disponível' },
  { id: '8', numero: 8, capacidade: 6, status: 'Ocupada' },
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

  const filteredMesas = mesas.filter((mesa) => {
    const matchesSearch = mesa.numero.toString().includes(searchTerm);
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
    const newMesa: Mesa = {
      id: Date.now().toString(),
      numero: parseInt(formData.numero),
      capacidade: parseInt(formData.capacidade),
      status: formData.status,
    };
    setMesas([...mesas, newMesa]);
    setShowForm(false);
    toast.success('Mesa criada com sucesso!');
  };

  const handleStatusChange = (mesa: Mesa, newStatus: MesaStatus) => {
    setMesas(mesas.map(m => m.id === mesa.id ? { ...m, status: newStatus } : m));
    toast.success(`Status da mesa ${mesa.numero} alterado para ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Mesas</h1>
          <p className="text-muted-foreground">
            Gerencie as mesas do restaurante
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Mesa
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número da mesa..."
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMesas.map((mesa) => (
          <MesaCard key={mesa.id} mesa={mesa} onView={handleView} />
        ))}
      </div>

      {/* Dialog de Visualização */}
      <Dialog open={!!selectedMesa} onOpenChange={() => setSelectedMesa(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mesa {selectedMesa?.numero}</DialogTitle>
            <DialogDescription>
              Detalhes e gerenciamento da mesa
            </DialogDescription>
          </DialogHeader>
          {selectedMesa && (
            <div className="space-y-4">
              <div>
                <Label>Status Atual</Label>
                <Select
                  value={selectedMesa.status}
                  onValueChange={(value) => handleStatusChange(selectedMesa, value as MesaStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Reservada">Reservada</SelectItem>
                    <SelectItem value="Ocupada">Ocupada</SelectItem>
                    <SelectItem value="Em atendimento">Em atendimento</SelectItem>
                    <SelectItem value="Fechada">Fechada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Capacidade</Label>
                <p>{selectedMesa.capacidade} pessoas</p>
              </div>
              {selectedMesa.data_reserva && (
                <div>
                  <Label>Data da Reserva</Label>
                  <p>{new Date(selectedMesa.data_reserva).toLocaleString('pt-BR')}</p>
                </div>
              )}
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
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as MesaStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Reservada">Reservada</SelectItem>
                  <SelectItem value="Ocupada">Ocupada</SelectItem>
                  <SelectItem value="Em atendimento">Em atendimento</SelectItem>
                  <SelectItem value="Fechada">Fechada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Criar</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
