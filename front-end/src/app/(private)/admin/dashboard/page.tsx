"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { clientesAPI, produtosAPI, pedidosAPI, mesasAPI } from "@/src/app/lib/api";

interface DashboardStats {
  totalClientes: number;
  totalProdutos: number;
  totalPedidos: number;
  totalMesas: number;
  pedidosHoje: number;
  receitaHoje: number;
  mesasOcupadas: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    totalProdutos: 0,
    totalPedidos: 0,
    totalMesas: 0,
    pedidosHoje: 0,
    receitaHoje: 0,
    mesasOcupadas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar todos os dados em paralelo
      const [clientes, produtos, pedidos, mesas] = await Promise.all([
        clientesAPI.list(),
        produtosAPI.list(),
        pedidosAPI.list(),
        mesasAPI.list(),
      ]);

      // Calcular pedidos de hoje
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const pedidosHoje = Array.isArray(pedidos) 
        ? pedidos.filter((p: any) => {
            const dataPedido = new Date(p.data_hora);
            return dataPedido >= hoje;
          })
        : [];

      // Calcular receita de hoje (soma dos valores dos pedidos)
      const receitaHoje = pedidosHoje.reduce((acc: number, p: any) => {
        return acc + (Number(p.valor_total) || 0);
      }, 0);

      // Contar mesas ocupadas
      const mesasOcupadas = Array.isArray(mesas)
        ? mesas.filter((m: any) => m.status === 'ocupada').length
        : 0;

      setStats({
        totalClientes: Array.isArray(clientes) ? clientes.length : 0,
        totalProdutos: Array.isArray(produtos) ? produtos.length : 0,
        totalPedidos: Array.isArray(pedidos) ? pedidos.length : 0,
        totalMesas: Array.isArray(mesas) ? mesas.length : 0,
        pedidosHoje: pedidosHoje.length,
        receitaHoje,
        mesasOcupadas,
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProdutos}</div>
            <p className="text-xs text-muted-foreground">No cardápio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pedidosHoje}</div>
            <p className="text-xs text-muted-foreground">De {stats.totalPedidos} totais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.receitaHoje)}</div>
            <p className="text-xs text-muted-foreground">Faturamento do dia</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status das Mesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total de Mesas</span>
                <span className="text-2xl font-bold">{stats.totalMesas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mesas Ocupadas</span>
                <span className="text-2xl font-bold text-red-500">{stats.mesasOcupadas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mesas Livres</span>
                <span className="text-2xl font-bold text-green-500">
                  {stats.totalMesas - stats.mesasOcupadas}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total de Pedidos</span>
                <span className="text-2xl font-bold">{stats.totalPedidos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pedidos Hoje</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{stats.pedidosHoje}</span>
                  {stats.pedidosHoje > 0 && <TrendingUp className="h-5 w-5 text-green-500" />}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ticket Médio</span>
                <span className="text-2xl font-bold">
                  {stats.pedidosHoje > 0 
                    ? formatCurrency(stats.receitaHoje / stats.pedidosHoje)
                    : formatCurrency(0)
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
