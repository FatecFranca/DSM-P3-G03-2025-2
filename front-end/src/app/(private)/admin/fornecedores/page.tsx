"use client";
import { useState, useEffect } from "react";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Card, CardContent, CardHeader } from "@/src/app/components/ui/card";
import { Plus, Search, Pencil, Trash2, Building2, Phone, Mail } from "lucide-react";
import { fornecedoresAPI } from "@/src/app/lib/api";
import { Fornecedor } from "@/src/app/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/app/components/ui/dialog";
import { Label } from "@/src/app/components/ui/label";

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(null);
  const [formData, setFormData] = useState({
    razao_social: "",
    nome_fantasia: "",
    cnpj: "",
    email: "",
    logradouro: "",
    num_casa: "",
    complemento: "",
    bairro: "",
    municipio: "",
    uf: "",
    cep: "",
    celular: "",
    produto_ids: [] as string[],
  });

  useEffect(() => {
    loadFornecedores();
  }, []);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      const data = await fornecedoresAPI.list();
      setFornecedores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      setFornecedores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este fornecedor?")) return;

    try {
      await fornecedoresAPI.delete(id);
      setFornecedores(fornecedores.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      alert("Erro ao deletar fornecedor");
    }
  };

  const handleOpenModal = (fornecedor?: Fornecedor) => {
    if (fornecedor) {
      setEditingFornecedor(fornecedor);
      setFormData({
        razao_social: fornecedor.razao_social,
        nome_fantasia: fornecedor.nome_fantasia || "",
        cnpj: fornecedor.cnpj,
        email: fornecedor.email,
        logradouro: fornecedor.logradouro,
        num_casa: fornecedor.num_casa,
        complemento: fornecedor.complemento || "",
        bairro: fornecedor.bairro,
        municipio: fornecedor.municipio,
        uf: fornecedor.uf,
        cep: fornecedor.cep,
        celular: fornecedor.celular,
        produto_ids: fornecedor.produto_ids || [],
      });
    } else {
      setEditingFornecedor(null);
      setFormData({
        razao_social: "",
        nome_fantasia: "",
        cnpj: "",
        email: "",
        logradouro: "",
        num_casa: "",
        complemento: "",
        bairro: "",
        municipio: "",
        uf: "",
        cep: "",
        celular: "",
        produto_ids: [],
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingFornecedor) {
        await fornecedoresAPI.update(editingFornecedor.id, formData);
      } else {
        await fornecedoresAPI.create(formData);
      }
      setModalOpen(false);
      loadFornecedores();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar fornecedor");
    }
  };

  const filteredFornecedores = fornecedores.filter((fornecedor) =>
    fornecedor.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj?.includes(searchTerm) ||
    fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando fornecedores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie os fornecedores</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CNPJ ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFornecedores.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum fornecedor encontrado" : "Nenhum fornecedor cadastrado"}
              </div>
            ) : (
              filteredFornecedores.map((fornecedor) => (
                <Card key={fornecedor.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-semibold text-lg">{fornecedor.razao_social}</h3>
                            {fornecedor.nome_fantasia && (
                              <p className="text-sm text-muted-foreground">{fornecedor.nome_fantasia}</p>
                            )}
                          </div>
                          
                          <div className="grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <span>CNPJ: {fornecedor.cnpj}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{fornecedor.celular}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{fornecedor.email}</span>
                            </div>
                            
                            <div className="text-sm">
                              <span className="font-medium">Endereço: </span>
                              {fornecedor.logradouro}, {fornecedor.num_casa}
                              {fornecedor.complemento && ` - ${fornecedor.complemento}`}
                              <br />
                              {fornecedor.bairro} - {fornecedor.municipio}/{fornecedor.uf}
                              <br />
                              CEP: {fornecedor.cep}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(fornecedor)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(fornecedor.id)}
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
        Total: {filteredFornecedores.length} fornecedor(es)
      </div>

      {/* Modal Criar/Editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razao_social">Razão Social*</Label>
                  <Input
                    id="razao_social"
                    value={formData.razao_social}
                    onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                  <Input
                    id="nome_fantasia"
                    value={formData.nome_fantasia}
                    onChange={(e) => setFormData({ ...formData, nome_fantasia: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ*</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
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

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="logradouro">Logradouro*</Label>
                  <Input
                    id="logradouro"
                    value={formData.logradouro}
                    onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num_casa">Número*</Label>
                  <Input
                    id="num_casa"
                    value={formData.num_casa}
                    onChange={(e) => setFormData({ ...formData, num_casa: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={formData.complemento}
                    onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro*</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="municipio">Município*</Label>
                  <Input
                    id="municipio"
                    value={formData.municipio}
                    onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uf">UF*</Label>
                  <Input
                    id="uf"
                    value={formData.uf}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                    maxLength={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP*</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    required
                  />
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
