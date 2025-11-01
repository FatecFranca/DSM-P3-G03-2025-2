"use client";

import { useState } from 'react';
import { Fornecedor } from '@/src/app/types';
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
const mockFornecedores: Fornecedor[] = [
  {
    id: '1',
    razao_social: 'Distribuidora ABC Ltda',
    nome_fantasia: 'ABC Bebidas',
    cnpj: '12.345.678/0001-90',
    email: 'contato@abc.com',
    celular: '(11) 3456-7890',
    logradouro: 'Av. Industrial',
    num_imovel: '500',
    bairro: 'Distrito Industrial',
    municipio: 'São Paulo',
    uf: 'SP',
    cep: '04567-890',
    produto_ids: [],
  },
  {
    id: '2',
    razao_social: 'Alimentos XYZ S.A.',
    nome_fantasia: 'XYZ Alimentos',
    cnpj: '98.765.432/0001-10',
    email: 'vendas@xyz.com',
    celular: '(11) 2345-6789',
    logradouro: 'Rua Comercial',
    num_imovel: '1200',
    complemento: 'Galpão 3',
    bairro: 'Centro',
    municipio: 'Guarulhos',
    uf: 'SP',
    cep: '07123-456',
    produto_ids: [],
  },
];

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(mockFornecedores);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Fornecedor>>({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    email: '',
    celular: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    cep: '',
    produto_ids: [],
  });

  const filteredFornecedores = fornecedores.filter((fornecedor) =>
    fornecedor.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fornecedor.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    fornecedor.cnpj.includes(searchTerm)
  );

  const columns: Column<Fornecedor>[] = [
    { header: 'Razão Social', accessor: 'razao_social' },
    { header: 'Nome Fantasia', accessor: (row) => row.nome_fantasia || '-' },
    { header: 'CNPJ', accessor: 'cnpj' },
    { header: 'Email', accessor: 'email' },
  ];

  const handleView = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor);
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setFormData(fornecedor);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreate = () => {
    setFormData({
      razao_social: '',
      nome_fantasia: '',
      cnpj: '',
      email: '',
      celular: '',
      logradouro: '',
      num_imovel: '',
      complemento: '',
      bairro: '',
      municipio: '',
      uf: '',
      cep: '',
      produto_ids: [],
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleDelete = (fornecedor: Fornecedor) => {
    if (confirm(`Deseja realmente excluir ${fornecedor.razao_social}?`)) {
      setFornecedores(fornecedores.filter((f) => f.id !== fornecedor.id));
      toast.success('Fornecedor excluído com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && formData.id) {
      setFornecedores(fornecedores.map((f) => (f.id === formData.id ? formData as Fornecedor : f)));
      toast.success('Fornecedor atualizado com sucesso!');
    } else {
      const newFornecedor: Fornecedor = {
        ...formData,
        id: Date.now().toString(),
      } as Fornecedor;
      setFornecedores([...fornecedores, newFornecedor]);
      toast.success('Fornecedor criado com sucesso!');
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie os fornecedores
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar fornecedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredFornecedores}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyExtractor={(row) => row.id}
      />

      {/* Dialog de Visualização */}
      <Dialog open={!!selectedFornecedor} onOpenChange={() => setSelectedFornecedor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedFornecedor?.razao_social}</DialogTitle>
            <DialogDescription>Detalhes do fornecedor</DialogDescription>
          </DialogHeader>
          {selectedFornecedor && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Razão Social</Label>
                  <p>{selectedFornecedor.razao_social}</p>
                </div>
                {selectedFornecedor.nome_fantasia && (
                  <div>
                    <Label>Nome Fantasia</Label>
                    <p>{selectedFornecedor.nome_fantasia}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>CNPJ</Label>
                <p>{selectedFornecedor.cnpj}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p>{selectedFornecedor.email}</p>
                </div>
                <div>
                  <Label>Celular</Label>
                  <p>{selectedFornecedor.celular}</p>
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <p>
                  {selectedFornecedor.logradouro}, {selectedFornecedor.num_imovel}
                  {selectedFornecedor.complemento && ` - ${selectedFornecedor.complemento}`}
                </p>
                <p>
                  {selectedFornecedor.bairro} - {selectedFornecedor.municipio}/{selectedFornecedor.uf}
                </p>
                <p>CEP: {selectedFornecedor.cep}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação/Edição */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Novo'} Fornecedor</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edite as informações' : 'Adicione um novo fornecedor'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="razao_social">Razão Social *</Label>
                <Input
                  id="razao_social"
                  value={formData.razao_social}
                  onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input
                  id="nome_fantasia"
                  value={formData.nome_fantasia}
                  onChange={(e) => setFormData({ ...formData, nome_fantasia: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="celular">Telefone *</Label>
                <Input
                  id="celular"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  placeholder="(00) 0000-0000"
                  required
                />
              </div>
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
