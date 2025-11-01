"use client";
import { useState } from 'react';
import { Garcom, Turno } from '@/src/app/types';
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
import { Switch } from '@/src/app/components/ui/switch';
import { Badge } from '@/src/app/components/ui/badge';
import { toast } from 'sonner';

// Mock data
const mockGarcons: Garcom[] = [
  {
    id: '1',
    nome: 'João Silva',
    cpf: '123.456.789-00',
    email: 'joao.garcom@email.com',
    celular: '(11) 98765-4321',
    turno: 'Manhã',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    email: 'maria.garcom@email.com',
    celular: '(11) 91234-5678',
    turno: 'Noite',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    cpf: '456.789.123-00',
    email: 'pedro.garcom@email.com',
    celular: '(11) 99876-5432',
    turno: 'Tarde',
    ativo: false,
  },
];

export default function GarconsPage() {
  const [garcons, setGarcons] = useState<Garcom[]>(mockGarcons);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGarcom, setSelectedGarcom] = useState<Garcom | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Garcom>>({
    nome: '',
    cpf: '',
    email: '',
    celular: '',
    turno: 'Manhã',
    ativo: true,
  });

  const filteredGarcons = garcons.filter((garcom) =>
    garcom.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    garcom.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<Garcom>[] = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Email', accessor: 'email' },
    { header: 'Celular', accessor: 'celular' },
    { header: 'Turno', accessor: 'turno' },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.ativo ? 'default' : 'secondary'}>
          {row.ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
  ];

  const handleView = (garcom: Garcom) => {
    setSelectedGarcom(garcom);
  };

  const handleEdit = (garcom: Garcom) => {
    setFormData(garcom);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreate = () => {
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      celular: '',
      turno: 'Manhã',
      ativo: true,
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleDelete = (garcom: Garcom) => {
    if (confirm(`Deseja realmente excluir ${garcom.nome}?`)) {
      setGarcons(garcons.filter((g) => g.id !== garcom.id));
      toast.success('Garçom excluído com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && formData.id) {
      setGarcons(garcons.map((g) => (g.id === formData.id ? formData as Garcom : g)));
      toast.success('Garçom atualizado com sucesso!');
    } else {
      const newGarcom: Garcom = {
        ...formData,
        id: Date.now().toString(),
      } as Garcom;
      setGarcons([...garcons, newGarcom]);
      toast.success('Garçom criado com sucesso!');
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Garçons</h1>
          <p className="text-muted-foreground">
            Gerencie os garçons do restaurante
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Garçom
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar garçom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredGarcons}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        keyExtractor={(row) => row.id}
      />

      {/* Dialog de Visualização */}
      <Dialog open={!!selectedGarcom} onOpenChange={() => setSelectedGarcom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedGarcom?.nome}</DialogTitle>
            <DialogDescription>Detalhes do garçom</DialogDescription>
          </DialogHeader>
          {selectedGarcom && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CPF</Label>
                  <p>{selectedGarcom.cpf}</p>
                </div>
                <div>
                  <Label>Turno</Label>
                  <p>{selectedGarcom.turno}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p>{selectedGarcom.email}</p>
                </div>
                <div>
                  <Label>Celular</Label>
                  <p>{selectedGarcom.celular}</p>
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <p>
                  <Badge variant={selectedGarcom.ativo ? 'default' : 'secondary'}>
                    {selectedGarcom.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação/Edição */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Novo'} Garçom</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edite as informações' : 'Adicione um novo garçom'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="turno">Turno *</Label>
                <Select
                  value={formData.turno}
                  onValueChange={(value) => setFormData({ ...formData, turno: value as Turno })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                    <SelectItem value="Noite">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Status</Label>
                <p className="text-muted-foreground">
                  {formData.ativo ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <Switch
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
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
