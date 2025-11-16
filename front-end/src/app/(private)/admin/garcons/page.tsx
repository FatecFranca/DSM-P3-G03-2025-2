"use client";
import { useState, useEffect } from "react";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Card, CardContent, CardHeader } from "@/src/app/components/ui/card";
import { Plus, Search, Pencil, Trash2, UserCheck, UserX, Mail, Phone } from "lucide-react";
import { garconsAPI } from "@/src/app/lib/api";
import { Garcom } from "@/src/app/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/app/components/ui/dialog";
import { Label } from "@/src/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/components/ui/select";

export default function GarconsPage() {
  const [garcons, setGarcons] = useState<Garcom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGarcom, setEditingGarcom] = useState<Garcom | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    celular: "",
    senha: "",
    turno: "manha",
    ativo: true,
  });

  useEffect(() => {
    loadGarcons();
  }, []);

  const loadGarcons = async () => {
    try {
      setLoading(true);
      const data = await garconsAPI.list();
      setGarcons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar garçons:", error);
      setGarcons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este garçom?")) return;

    try {
      await garconsAPI.delete(id);
      setGarcons(garcons.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Erro ao deletar garçom:", error);
      alert("Erro ao deletar garçom");
    }
  };

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    try {
      await garconsAPI.update(id, { ativo: !ativo });
      setGarcons(garcons.map(g => g.id === id ? { ...g, ativo: !ativo } : g));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do garçom");
    }
  };

  const handleOpenModal = (garcom?: Garcom) => {
    if (garcom) {
      setEditingGarcom(garcom);
      setFormData({
        nome: garcom.nome,
        cpf: garcom.cpf,
        email: garcom.email,
        celular: garcom.celular,
        senha: "",
        turno: garcom.turno,
        ativo: garcom.ativo,
      });
    } else {
      setEditingGarcom(null);
      setFormData({
        nome: "",
        cpf: "",
        email: "",
        celular: "",
        senha: "",
        turno: "manha",
        ativo: true,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSend = editingGarcom && !formData.senha
        ? { ...formData, senha: undefined } // Remove senha vazia ao editar
        : formData;

      if (editingGarcom) {
        await garconsAPI.update(editingGarcom.id, dataToSend);
      } else {
        await garconsAPI.create(dataToSend);
      }
      setModalOpen(false);
      loadGarcons();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar garçom");
    }
  };

  const filteredGarcons = garcons.filter((garcom) =>
    garcom.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    garcom.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: garcons.length,
    ativos: garcons.filter(g => g.ativo).length,
    inativos: garcons.filter(g => !g.ativo).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando garçons...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Garçons</h1>
          <p className="text-muted-foreground">Gerencie os garçons do restaurante</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Garçom
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total de Garçons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{stats.inativos}</div>
            <p className="text-xs text-muted-foreground">Inativos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGarcons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum garçom encontrado" : "Nenhum garçom cadastrado"}
              </div>
            ) : (
              filteredGarcons.map((garcom) => (
                <Card key={garcom.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${garcom.ativo ? 'bg-green-100' : 'bg-red-100'}`}>
                          {garcom.ativo ? (
                            <UserCheck className="h-6 w-6 text-green-600" />
                          ) : (
                            <UserX className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{garcom.nome}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              garcom.ativo 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {garcom.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          
                          <div className="grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{garcom.email}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{garcom.celular}</span>
                            </div>
                            
                            {garcom.cpf && (
                              <div className="text-xs">
                                <span>CPF: {garcom.cpf}</span>
                              </div>
                            )}
                            
                            {garcom.turno && (
                              <div className="text-xs">
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Turno: {garcom.turno}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant={garcom.ativo ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleToggleAtivo(garcom.id, garcom.ativo)}
                        >
                          {garcom.ativo ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(garcom)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(garcom.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Total: {filteredGarcons.length} garçon(s)
      </div>

      {/* Modal Criar/Editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGarcom ? "Editar Garçom" : "Novo Garçom"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo*</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF*</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    required
                    disabled={!!editingGarcom}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Telefone*</Label>
                  <Input
                    id="celular"
                    value={formData.celular}
                    onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!editingGarcom}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">
                  Senha{editingGarcom ? " (deixe em branco para manter)" : "*"}
                </Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  required={!editingGarcom}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="turno">Turno*</Label>
                  <Select
                    value={formData.turno}
                    onValueChange={(value) => setFormData({ ...formData, turno: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">Manhã</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="noite">Noite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ativo">Status*</Label>
                  <Select
                    value={formData.ativo ? "true" : "false"}
                    onValueChange={(value) => setFormData({ ...formData, ativo: value === "true" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Ativo</SelectItem>
                      <SelectItem value="false">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}