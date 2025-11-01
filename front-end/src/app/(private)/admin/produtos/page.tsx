"use client";

import { useState } from 'react';
import { Produto, UnidadeMedida } from '@/src/app/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/app/components/ui/select';
import { Textarea } from '@/src/app/components/ui/textarea';
import { toast } from 'sonner';

// Mock data
const mockProdutos: Produto[] = [
  {
    id: '1',
    nome: 'Refrigerante Coca-Cola',
    marca: 'Coca-Cola',
    detalhes: 'Lata 350ml',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 8.00,
    qtd_estoque: 50,
    categoria_id: '1',
    fornecedor_ids: ['1'],
  },
  {
    id: '2',
    nome: 'Hambúrguer Artesanal',
    marca: 'Casa',
    detalhes: 'Hambúrguer 200g com queijo, alface e tomate',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 25.00,
    qtd_estoque: 30,
    categoria_id: '2',
    fornecedor_ids: ['2'],
  },
  {
    id: '3',
    nome: 'Batata Frita',
    marca: 'Casa',
    quantidade: 500,
    unidade_medida: 'KG',
    preco_unitario: 15.00,
    qtd_estoque: 20,
    categoria_id: '2',
    fornecedor_ids: ['2'],
  },
];

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(mockProdutos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Produto>>({
    nome: '',
    marca: '',
    detalhes: '',
    quantidade: 1,
    unidade_medida: 'UN',
    preco_unitario: 0,
    qtd_estoque: 0,
    categoria_id: '',
    fornecedor_ids: [],
  });

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<Produto>[] = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Marca', accessor: 'marca' },
    { header: 'Estoque', accessor: (row) => `${row.qtd_estoque} ${row.unidade_medida}` },
    {
      header: 'Preço',
      accessor: (row) => `R$ ${row.preco_unitario.toFixed(2)}`,
    },
  ];

  const handleView = (produto: Produto) => {
    setSelectedProduto(produto);
  };

  const handleEdit = (produto: Produto) => {
    setFormData(produto);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreate = () => {
    setFormData({
      nome: '',
      marca: '',
      detalhes: '',
      quantidade: 1,
      unidade_medida: 'UN',
      preco_unitario: 0,
      qtd_estoque: 0,
      categoria_id: '',
      fornecedor_ids: [],
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleDelete = (produto: Produto) => {
    if (confirm(`Deseja realmente excluir ${produto.nome}?`)) {
      setProdutos(produtos.filter((p) => p.id !== produto.id));
      toast.success('Produto excluído com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && formData.id) {
      setProdutos(produtos.map((p) => (p.id === formData.id ? formData as Produto : p)));
      toast.success('Produto atualizado com sucesso!');
    } else {
      const newProduto: Produto = {
        ...formData,
        id: Date.now().toString(),
      } as Produto;
      setProdutos([...produtos, newProduto]);
      toast.success('Produto criado com sucesso!');
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie o catálogo de produtos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredProdutos}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyExtractor={(row) => row.id}
      />

      {/* Dialog de Visualização */}
      <Dialog open={!!selectedProduto} onOpenChange={() => setSelectedProduto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduto?.nome}</DialogTitle>
            <DialogDescription>Detalhes do produto</DialogDescription>
          </DialogHeader>
          {selectedProduto && (
            <div className="space-y-3">
              <div>
                <Label>Marca</Label>
                <p>{selectedProduto.marca}</p>
              </div>
              {selectedProduto.detalhes && (
                <div>
                  <Label>Detalhes</Label>
                  <p>{selectedProduto.detalhes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantidade</Label>
                  <p>{selectedProduto.quantidade} {selectedProduto.unidade_medida}</p>
                </div>
                <div>
                  <Label>Preço Unitário</Label>
                  <p>R$ {selectedProduto.preco_unitario.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <Label>Estoque</Label>
                <p>{selectedProduto.qtd_estoque} {selectedProduto.unidade_medida}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação/Edição */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Novo'} Produto</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edite as informações' : 'Adicione um novo produto'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="marca">Marca *</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="detalhes">Detalhes</Label>
              <Textarea
                id="detalhes"
                value={formData.detalhes}
                onChange={(e) => setFormData({ ...formData, detalhes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  step="0.01"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unidade">Unidade de Medida *</Label>
                <Select
                  value={formData.unidade_medida}
                  onValueChange={(value) => setFormData({ ...formData, unidade_medida: value as UnidadeMedida })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UN">Unidade (UN)</SelectItem>
                    <SelectItem value="KG">Quilograma (KG)</SelectItem>
                    <SelectItem value="L">Litro (L)</SelectItem>
                    <SelectItem value="CX">Caixa (CX)</SelectItem>
                    <SelectItem value="PC">Peça (PC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preco">Preço Unitário *</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco_unitario}
                  onChange={(e) => setFormData({ ...formData, preco_unitario: parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estoque">Quantidade em Estoque *</Label>
                <Input
                  id="estoque"
                  type="number"
                  value={formData.qtd_estoque}
                  onChange={(e) => setFormData({ ...formData, qtd_estoque: parseInt(e.target.value) })}
                  required
                />
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
