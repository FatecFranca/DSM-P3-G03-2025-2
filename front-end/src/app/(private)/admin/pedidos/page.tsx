"use client";

import { useState } from 'react';
import { Pedido, ItemPedido, Produto } from '@/src/app/types';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Badge } from '@/src/app/components/ui/badge';
import { toast } from 'sonner';

// Mock data
const mockPedidos: Pedido[] = [
  {
    id: '1',
    num_pedido: 'PED001',
    data_hora: new Date().toISOString(),
    mesa_id: '1',
    garcom_id: '1',
    total: 125.50,
    itens: [
      { id: '1', num_item: 1, quantidade: 2, produto_id: '1', pedido_id: '1', subtotal: 50.00 },
      { id: '2', num_item: 2, quantidade: 3, produto_id: '2', pedido_id: '1', subtotal: 75.50 },
    ],
  },
  {
    id: '2',
    num_pedido: 'PED002',
    data_hora: new Date().toISOString(),
    mesa_id: '3',
    total: 89.90,
    itens: [],
  },
];

const mockProdutos: Produto[] = [
  { id: '1', nome: 'Refrigerante', marca: 'Coca-Cola', quantidade: 1, unidade_medida: 'UN', preco_unitario: 8.00, qtd_estoque: 50, categoria_id: '1', fornecedor_ids: [] },
  { id: '2', nome: 'Hambúrguer', marca: 'Casa', quantidade: 1, unidade_medida: 'UN', preco_unitario: 25.00, qtd_estoque: 30, categoria_id: '2', fornecedor_ids: [] },
  { id: '3', nome: 'Batata Frita', marca: 'Casa', quantidade: 1, unidade_medida: 'UN', preco_unitario: 15.00, qtd_estoque: 40, categoria_id: '2', fornecedor_ids: [] },
];

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mesa_id: '',
    garcom_id: '',
    itens: [] as { produto_id: string; quantidade: number }[],
  });
  const [currentItem, setCurrentItem] = useState({ produto_id: '', quantidade: '1' });

  const filteredPedidos = pedidos.filter((pedido) =>
    pedido.num_pedido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<Pedido>[] = [
    { header: 'Nº Pedido', accessor: 'num_pedido' },
    {
      header: 'Data/Hora',
      accessor: (row) => new Date(row.data_hora).toLocaleString('pt-BR'),
    },
    { header: 'Mesa', accessor: (row) => `Mesa ${row.mesa_id}` },
    {
      header: 'Total',
      accessor: (row) => `R$ ${row.total?.toFixed(2) || '0.00'}`,
    },
    {
      header: 'Status',
      accessor: () => <Badge>Aberto</Badge>,
    },
  ];

  const handleView = (pedido: Pedido) => {
    setSelectedPedido(pedido);
  };

  const handleCreate = () => {
    setFormData({ mesa_id: '', garcom_id: '', itens: [] });
    setCurrentItem({ produto_id: '', quantidade: '1' });
    setShowForm(true);
  };

  const handleAddItem = () => {
    if (currentItem.produto_id && parseInt(currentItem.quantidade) > 0) {
      setFormData({
        ...formData,
        itens: [...formData.itens, { 
          produto_id: currentItem.produto_id, 
          quantidade: parseInt(currentItem.quantidade) 
        }],
      });
      setCurrentItem({ produto_id: '', quantidade: '1' });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPedido: Pedido = {
      id: Date.now().toString(),
      num_pedido: `PED${String(pedidos.length + 1).padStart(3, '0')}`,
      data_hora: new Date().toISOString(),
      mesa_id: formData.mesa_id,
      garcom_id: formData.garcom_id,
      total: calculateTotal(),
      itens: formData.itens.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        num_item: index + 1,
        quantidade: item.quantidade,
        produto_id: item.produto_id,
        pedido_id: Date.now().toString(),
        subtotal: (mockProdutos.find(p => p.id === item.produto_id)?.preco_unitario || 0) * item.quantidade,
      })),
    };
    setPedidos([...pedidos, newPedido]);
    setShowForm(false);
    toast.success('Pedido criado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie os pedidos do restaurante
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar pedido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredPedidos}
        onView={handleView}
        keyExtractor={(row) => row.id}
      />

      {/* Dialog de Visualização */}
      <Dialog open={!!selectedPedido} onOpenChange={() => setSelectedPedido(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pedido {selectedPedido?.num_pedido}</DialogTitle>
            <DialogDescription>
              Detalhes do pedido
            </DialogDescription>
          </DialogHeader>
          {selectedPedido && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mesa</Label>
                  <p>Mesa {selectedPedido.mesa_id}</p>
                </div>
                <div>
                  <Label>Data/Hora</Label>
                  <p>{new Date(selectedPedido.data_hora).toLocaleString('pt-BR')}</p>
                </div>
              </div>
              
              <div>
                <Label>Itens do Pedido</Label>
                <div className="mt-2 space-y-2">
                  {selectedPedido.itens?.map((item) => {
                    const produto = mockProdutos.find(p => p.id === item.produto_id);
                    return (
                      <div key={item.id} className="flex justify-between rounded-md border p-3">
                        <div>
                          <p>{produto?.nome || 'Produto desconhecido'}</p>
                          <p className="text-muted-foreground">
                            Quantidade: {item.quantidade}
                          </p>
                        </div>
                        <p>R$ {item.subtotal?.toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <Label>Total</Label>
                <p>R$ {selectedPedido.total?.toFixed(2)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogDescription>
              Crie um novo pedido
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mesa">Mesa</Label>
                <Select
                  value={formData.mesa_id}
                  onValueChange={(value) => setFormData({ ...formData, mesa_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        Mesa {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="garcom">Garçom (opcional)</Label>
                <Select
                  value={formData.garcom_id}
                  onValueChange={(value) => setFormData({ ...formData, garcom_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o garçom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">João Silva</SelectItem>
                    <SelectItem value="2">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Adicionar Itens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2">
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
                  <Button type="button" onClick={handleAddItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.itens.length > 0 && (
                  <div className="space-y-2">
                    {formData.itens.map((item, index) => {
                      const produto = mockProdutos.find(p => p.id === item.produto_id);
                      return (
                        <div key={index} className="flex justify-between rounded-md border p-2">
                          <span>
                            {produto?.nome} x{item.quantidade}
                          </span>
                          <div className="flex items-center gap-2">
                            <span>R$ {((produto?.preco_unitario || 0) * item.quantidade).toFixed(2)}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-between border-t pt-2">
                      <strong>Total</strong>
                      <strong>R$ {calculateTotal().toFixed(2)}</strong>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={formData.itens.length === 0}>
                Criar Pedido
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
