
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Card, CardContent, CardHeader } from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { Plus, Search, Users, Clock, DollarSign, ShoppingCart, Trash2, AlertTriangle } from "lucide-react";
import { mesasAPI, clientesAPI, pedidosAPI } from "@/src/app/lib/api";
import { MesaDetalhesModal } from "@/src/app/components/MesaDetalhesModal";
import { NovaMesaModal } from "@/src/app/components/NovaMesaModal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/app/components/ui/alert-dialog";

interface Mesa {
  id: string;
  numero: number;
  numero_mesa: number;
  capacidade: number;
  status: string;
  total: number;
  updatedAt: string;
}

interface Cliente {
  id: string;
  nome: string;
  email?: string;
  celular?: string;
  cpf?: string;
  admin?: boolean;
  mesa_id?: string;
}

interface Pedido {
  id: string;
  cliente_id: string;
  mesa_id: string;
  status: string;
  valor: number;
  data_hora: string;
}

interface MesaComDados extends Mesa {
  clientes: Cliente[];
  pedidos: Pedido[];
  totalPedidos: number;
  valorTotal: number;
}

export default function MesasPage() {
  const [mesasComDados, setMesasComDados] = useState<MesaComDados[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMesaId, setSelectedMesaId] = useState<string | null>(null);
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [modalNovaOpen, setModalNovaOpen] = useState(false);
  const [mesaToDelete, setMesaToDelete] = useState<MesaComDados | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMesas();
  }, []);

  const loadMesas = async () => {
    try {
      setLoading(true);

      // Carregar todas as mesas com seus totais atualizados
      const mesasData = await mesasAPI.list() as Mesa[];
      
      // Carregar todos os clientes
      const clientesData = await clientesAPI.list() as Cliente[];
      
      // Carregar todos os pedidos
      const pedidosData = await pedidosAPI.list() as Pedido[];

      console.log('📊 Dados carregados:', {
        mesas: mesasData.length,
        clientes: clientesData.length,
        pedidos: pedidosData.length
      });

      // Processar dados: associar clientes e pedidos a cada mesa
      const mesasProcessadas: MesaComDados[] = mesasData.map((mesa) => {
        // Clientes desta mesa
        const clientesDaMesa = clientesData.filter((c) => c.mesa_id === mesa.id);
        
        // Pedidos desta mesa
        const pedidosDaMesa = pedidosData.filter((p) => p.mesa_id === mesa.id);

        console.log(`Mesa ${mesa.numero_mesa}:`, {
          id: mesa.id,
          clientes: clientesDaMesa.length,
          pedidos: pedidosDaMesa.length,
          total: mesa.total
        });

        return {
          ...mesa,
          clientes: clientesDaMesa,
          pedidos: pedidosDaMesa,
          totalPedidos: pedidosDaMesa.length,
          valorTotal: mesa.total, // Total vem direto do banco de dados (calculado automaticamente pelo backend)
        };
      });

      setMesasComDados(mesasProcessadas);
    } catch (error) {
      console.error("Erro ao carregar mesas:", error);
      setMesasComDados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMesaClick = (mesaId: string) => {
    setSelectedMesaId(mesaId);
    setModalDetalhesOpen(true);
  };

  const handleNovaMesa = () => {
    setModalNovaOpen(true);
  };

  const handleNovaMesaSuccess = () => {
    // Recarregar lista de mesas
    loadMesas();
  };

  const handleDeleteClick = (mesa: MesaComDados, e: React.MouseEvent) => {
    e.stopPropagation(); // Impedir que abra o modal de detalhes
    setMesaToDelete(mesa);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mesaToDelete) return;

    // Validar se a mesa pode ser deletada
    if (mesaToDelete.status !== 'livre') {
      toast.error("Não é possível deletar esta mesa", {
        description: "A mesa deve estar livre (sem clientes) para ser deletada."
      });
      setDeleteDialogOpen(false);
      setMesaToDelete(null);
      return;
    }

    if (mesaToDelete.clientes.length > 0) {
      toast.error("Não é possível deletar esta mesa", {
        description: "Ainda existem clientes vinculados a esta mesa."
      });
      setDeleteDialogOpen(false);
      setMesaToDelete(null);
      return;
    }

    if (mesaToDelete.pedidos.length > 0) {
      toast.error("Não é possível deletar esta mesa", {
        description: "Ainda existem pedidos vinculados a esta mesa. Desvincule-os primeiro."
      });
      setDeleteDialogOpen(false);
      setMesaToDelete(null);
      return;
    }

    setDeleting(true);

    try {
      await mesasAPI.delete(mesaToDelete.id);
      
      toast.success("Mesa deletada com sucesso", {
        description: `Mesa ${mesaToDelete.numero_mesa} foi removida do sistema.`
      });

      // Recarregar lista de mesas
      await loadMesas();
      
    } catch (error: any) {
      console.error("Erro ao deletar mesa:", error);
      toast.error("Erro ao deletar mesa", {
        description: error?.response?.data?.message || "Tente novamente."
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setMesaToDelete(null);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-500 hover:bg-gray-600';
    
    switch (status.toLowerCase()) {
      case 'livre':
        return 'bg-green-500 hover:bg-green-600';
      case 'ocupada':
        return 'bg-red-500 hover:bg-red-600';
      case 'reservada':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredMesas = mesasComDados.filter(
    (mesa) =>
      mesa.numero_mesa.toString().includes(searchTerm) ||
      mesa.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mesa.clientes?.some((c) =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Estatísticas
  const stats = {
    total: mesasComDados.length,
    livres: mesasComDados.filter((m) => m.status === 'livre').length,
    ocupadas: mesasComDados.filter((m) => m.status === 'ocupada').length,
    reservadas: mesasComDados.filter((m) => m.status === 'reservada').length,
    totalPedidos: mesasComDados.reduce((sum, m) => sum + m.totalPedidos, 0),
    valorTotal: mesasComDados.reduce((sum, m) => sum + m.valorTotal, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mesas</h1>
          <p className="text-muted-foreground">Gerencie as mesas do restaurante</p>
        </div>
        <Button onClick={handleNovaMesa}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Mesa
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total de Mesas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{stats.livres}</div>
            <p className="text-xs text-muted-foreground">Livres</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{stats.ocupadas}</div>
            <p className="text-xs text-muted-foreground">Ocupadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.reservadas}</div>
            <p className="text-xs text-muted-foreground">Reservadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.totalPedidos}</div>
            <p className="text-xs text-muted-foreground">Pedidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.valorTotal)}
            </div>
            <p className="text-xs text-muted-foreground">Receita</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, status ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMesas.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhuma mesa encontrada" : "Nenhuma mesa cadastrada"}
              </div>
            ) : (
              filteredMesas.map((mesa) => (
                <Card
                  key={mesa.id}
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => handleMesaClick(mesa.id)}
                >
                  <CardContent className="p-6">
                    {/* Cabeçalho */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">Mesa {mesa.numero_mesa}</h3>
                        <p className="text-sm text-muted-foreground">
                          Capacidade: {mesa.capacidade} pessoas
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(mesa.status)}>
                          {mesa.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDeleteClick(mesa, e)}
                          disabled={mesa.status !== 'livre' || mesa.clientes.length > 0 || mesa.pedidos.length > 0}
                          title={mesa.status !== 'livre' || mesa.clientes.length > 0 || mesa.pedidos.length > 0 ? "Mesa deve estar livre e sem pedidos" : "Deletar mesa"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Clientes */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {mesa.clientes?.length || 0} cliente(s)
                        </span>
                      </div>
                      {mesa.clientes && mesa.clientes.length > 0 && (
                        <div className="ml-6 space-y-1">
                          {mesa.clientes.slice(0, 2).map((cliente) => (
                            <p key={cliente.id} className="text-xs text-muted-foreground truncate">
                              • {cliente.nome}
                            </p>
                          ))}
                          {mesa.clientes.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              + {mesa.clientes.length - 2} mais
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Pedidos e Valor */}
                    <div className="space-y-2 pt-3 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          <span>Pedidos</span>
                        </div>
                        <span className="font-semibold">{mesa.totalPedidos}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>Total</span>
                        </div>
                        <span className="font-semibold text-primary">
                          {formatCurrency(mesa.valorTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Última atualização */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 pt-3 border-t">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(mesa.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <MesaDetalhesModal
        mesaId={selectedMesaId}
        open={modalDetalhesOpen}
        onClose={() => {
          setModalDetalhesOpen(false);
          setSelectedMesaId(null);
        }}
      />

      {/* Modal Nova Mesa */}
      <NovaMesaModal
        open={modalNovaOpen}
        onClose={() => setModalNovaOpen(false)}
        onSuccess={handleNovaMesaSuccess}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Tem certeza que deseja deletar a <strong>Mesa {mesaToDelete?.numero_mesa}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                Esta ação não pode ser desfeita.
              </p>
              
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar Mesa
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}