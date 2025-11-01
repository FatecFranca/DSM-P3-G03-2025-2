"use client";

import { useState } from 'react';
import { Cliente } from '@/src/app/types';
import { DataTable, Column } from '@/src/app/components/DataTable';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
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
const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao@email.com',
    celular: '(11) 98765-4321',
    logradouro: 'Rua das Flores',
    num_imovel: '123',
    bairro: 'Centro',
    municipio: 'São Paulo',
    uf: 'SP',
    cep: '01234-567',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    email: 'maria@email.com',
    celular: '(11) 91234-5678',
    logradouro: 'Av. Paulista',
    num_imovel: '1000',
    complemento: 'Apto 501',
    bairro: 'Bela Vista',
    municipio: 'São Paulo',
    uf: 'SP',
    cep: '01310-100',
    data_nascimento: '1990-05-15',
  },
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Cliente>>({
    nome: '',
    cpf: '',
    email: '',
    celular: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    cep: '',
    data_nascimento: '',
  });

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<Cliente>[] = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'CPF', accessor: 'cpf' },
    { header: 'Email', accessor: 'email' },
    { header: 'Celular', accessor: 'celular' },
  ];

  const handleView = (cliente: Cliente) => {
    setSelectedCliente(cliente);
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData(cliente);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreate = () => {
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      celular: '',
      logradouro: '',
      num_imovel: '',
      complemento: '',
      bairro: '',
      municipio: '',
      uf: '',
      cep: '',
      data_nascimento: '',
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleDelete = (cliente: Cliente) => {
    if (confirm(`Deseja realmente excluir ${cliente.nome}?`)) {
      setClientes(clientes.filter((c) => c.id !== cliente.id));
      toast.success('Cliente excluído com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && formData.id) {
      setClientes(clientes.map((c) => (c.id === formData.id ? formData as Cliente : c)));
      toast.success('Cliente atualizado com sucesso!');
    } else {
      const newCliente: Cliente = {
        ...formData,
        id: Date.now().toString(),
      } as Cliente;
      setClientes([...clientes, newCliente]);
      toast.success('Cliente criado com sucesso!');
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro de clientes
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredClientes}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyExtractor={(row) => row.id}
      />

      {/* Dialog de Visualização */}
      <Dialog open={!!selectedCliente} onOpenChange={() => setSelectedCliente(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCliente?.nome}</DialogTitle>
            <DialogDescription>Detalhes do cliente</DialogDescription>
          </DialogHeader>
          {selectedCliente && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CPF</Label>
                  <p>{selectedCliente.cpf}</p>
                </div>
                {selectedCliente.data_nascimento && (
                  <div>
                    <Label>Data de Nascimento</Label>
                    <p>{new Date(selectedCliente.data_nascimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p>{selectedCliente.email}</p>
                </div>
                <div>
                  <Label>Celular</Label>
                  <p>{selectedCliente.celular}</p>
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <p>
                  {selectedCliente.logradouro}, {selectedCliente.num_imovel}
                  {selectedCliente.complemento && ` - ${selectedCliente.complemento}`}
                </p>
                <p>
                  {selectedCliente.bairro} - {selectedCliente.municipio}/{selectedCliente.uf}
                </p>
                <p>CEP: {selectedCliente.cep}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação/Edição */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Novo'} Cliente</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edite as informações' : 'Adicione um novo cliente'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="celular">Celular *</Label>
                <Input
                  id="celular"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3>Endereço</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    placeholder="00000-000"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="logradouro">Logradouro *</Label>
                  <Input
                    id="logradouro"
                    value={formData.logradouro}
                    onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="num_imovel">Número *</Label>
                  <Input
                    id="num_imovel"
                    value={formData.num_imovel}
                    onChange={(e) => setFormData({ ...formData, num_imovel: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.complemento}
                  onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="municipio">Município *</Label>
                  <Input
                    id="municipio"
                    value={formData.municipio}
                    onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="uf">UF *</Label>
                  <Input
                    id="uf"
                    value={formData.uf}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                    placeholder="SP"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {isEditing ? 'Salvar' : 'Criar'}
              </Button>
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
