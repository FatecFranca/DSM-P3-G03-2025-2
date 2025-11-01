"use client";
import { useState } from 'react';
import { Categoria } from '@/src/app/types';
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
const mockCategorias: Categoria[] = [
  { id: '1', descricao: 'Bebidas' },
  { id: '2', descricao: 'Lanches' },
  { id: '3', descricao: 'Sobremesas' },
  { id: '4', descricao: 'Pratos Principais' },
  { id: '5', descricao: 'Entradas' },
];

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>(mockCategorias);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Categoria>>({
    descricao: '',
  });

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<Categoria>[] = [
    { header: 'ID', accessor: 'id', className: 'w-[100px]' },
    { header: 'Descrição', accessor: 'descricao' },
  ];

  const handleEdit = (categoria: Categoria) => {
    setFormData(categoria);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreate = () => {
    setFormData({ descricao: '' });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleDelete = (categoria: Categoria) => {
    if (confirm(`Deseja realmente excluir a categoria "${categoria.descricao}"?`)) {
      setCategorias(categorias.filter((c) => c.id !== categoria.id));
      toast.success('Categoria excluída com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && formData.id) {
      setCategorias(categorias.map((c) => (c.id === formData.id ? formData as Categoria : c)));
      toast.success('Categoria atualizada com sucesso!');
    } else {
      const newCategoria: Categoria = {
        ...formData,
        id: Date.now().toString(),
      } as Categoria;
      setCategorias([...categorias, newCategoria]);
      toast.success('Categoria criada com sucesso!');
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias de produtos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredCategorias}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyExtractor={(row) => row.id}
      />

      {/* Dialog de Criação/Edição */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Nova'} Categoria</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edite as informações' : 'Adicione uma nova categoria'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Bebidas, Lanches, Sobremesas..."
                required
              />
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
