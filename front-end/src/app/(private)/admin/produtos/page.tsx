"use client";
import { useState, useEffect } from "react";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Card, CardContent, CardHeader } from "@/src/app/components/ui/card";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { produtosAPI, categoriasAPI } from "@/src/app/lib/api";
import { Produto, Categoria } from "@/src/app/types";
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

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    marca: "",
    detalhes: "",
    quantidade: 0,
    unidade_medida: "UN",
    preco_unitario: 0,
    qtd_estoque: 0,
    categoria_id: "",
    fornecedor_ids: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [produtosData, categoriasData] = await Promise.all([
        produtosAPI.list({ include: 'categoria' }),
        categoriasAPI.list(),
      ]);
      setProdutos(Array.isArray(produtosData) ? produtosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setProdutos([]);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      await produtosAPI.delete(id);
      setProdutos(produtos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto");
    }
  };

  const handleOpenModal = (produto?: Produto) => {
    if (produto) {
      setEditingProduto(produto);
      setFormData({
        nome: produto.nome,
        marca: produto.marca,
        detalhes: produto.detalhes || "",
        quantidade: produto.quantidade,
        unidade_medida: produto.unidade_medida,
        preco_unitario: produto.preco_unitario,
        qtd_estoque: produto.qtd_estoque,
        categoria_id: produto.categoria_id,
        fornecedor_ids: produto.fornecedor_ids || [],
      });
    } else {
      setEditingProduto(null);
      setFormData({
        nome: "",
        marca: "",
        detalhes: "",
        quantidade: 0,
        unidade_medida: "UN",
        preco_unitario: 0,
        qtd_estoque: 0,
        categoria_id: "",
        fornecedor_ids: [],
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduto) {
        await produtosAPI.update(editingProduto.id, formData);
      } else {
        await produtosAPI.create(formData);
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar produto");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.detalhes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o cardápio</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProdutos.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
              </div>
            ) : (
              filteredProdutos.map((produto) => (
                <Card key={produto.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(produto)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(produto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{produto.nome}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{produto.marca}</p>
                    {produto.detalhes && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {produto.detalhes}
                      </p>
                    )}
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-primary">
                        {formatCurrency(produto.preco_unitario)}
                      </p>
                      <p>
                        Estoque: {produto.qtd_estoque} {produto.unidade_medida}
                      </p>
                      {produto.categoria && (
                        <p className="text-muted-foreground">
                          {produto.categoria.descricao}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Total: {filteredProdutos.length} produto(s)
      </div>

      {/* Modal Criar/Editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduto ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome*</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca*</Label>
                  <Input
                    id="marca"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detalhes">Detalhes</Label>
                <Input
                  id="detalhes"
                  value={formData.detalhes}
                  onChange={(e) => setFormData({ ...formData, detalhes: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade*</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    step="0.01"
                    value={formData.quantidade}
                    onChange={(e) =>
                      setFormData({ ...formData, quantidade: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidade_medida">Unidade*</Label>
                  <Select
                    value={formData.unidade_medida}
                    onValueChange={(value) =>
                      setFormData({ ...formData, unidade_medida: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">UN</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="G">G</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="ML">ML</SelectItem>
                      <SelectItem value="CX">CX</SelectItem>
                      <SelectItem value="PC">PC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qtd_estoque">Estoque*</Label>
                  <Input
                    id="qtd_estoque"
                    type="number"
                    step="0.01"
                    value={formData.qtd_estoque}
                    onChange={(e) =>
                      setFormData({ ...formData, qtd_estoque: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco_unitario">Preço Unitário*</Label>
                  <Input
                    id="preco_unitario"
                    type="number"
                    step="0.01"
                    value={formData.preco_unitario}
                    onChange={(e) =>
                      setFormData({ ...formData, preco_unitario: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria_id">Categoria*</Label>
                  <Select
                    value={formData.categoria_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoria_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.descricao}
                        </SelectItem>
                      ))}
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
