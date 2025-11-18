"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { DollarSign, ShoppingCart, Users, TrendingUp, Download, Calendar } from "lucide-react";
import { pedidosAPI, clientesAPI } from "@/src/app/lib/api";
import { gerarPDFRelatorio } from "@/src/app/lib/gerarPDFRelatorio";
import { toast } from "sonner";

interface RelatorioData {
  receitaTotal: number;
  receitaMes: number;
  receitaHoje: number;
  totalPedidos: number;
  pedidosMes: number;
  pedidosHoje: number;
  totalClientes: number;
  ticketMedio: number;
  produtoMaisVendido: string;
  mesaMaisUsada: string;
}

export default function RelatoriosPage() {
  const [data, setData] = useState<RelatorioData>({
    receitaTotal: 0,
    receitaMes: 0,
    receitaHoje: 0,
    totalPedidos: 0,
    pedidosMes: 0,
    pedidosHoje: 0,
    totalClientes: 0,
    ticketMedio: 0,
    produtoMaisVendido: '-',
    mesaMaisUsada: '-',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatorios();
  }, []);

  const loadRelatorios = async () => {
    try {
      setLoading(true);

      const [pedidos, clientes] = await Promise.all([
        pedidosAPI.list(),
        clientesAPI.list(),
      ]);

      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      // Filtrar pedidos
      const pedidosArray = Array.isArray(pedidos) ? pedidos : [];
      const pedidosHoje = pedidosArray.filter((p: any) => {
        const dataPedido = new Date(p.data_hora);
        return dataPedido >= hoje;
      });

      const pedidosMes = pedidosArray.filter((p: any) => {
        const dataPedido = new Date(p.data_hora);
        return dataPedido >= primeiroDiaMes;
      });

      // Calcular receitas
      const receitaTotal = pedidosArray.reduce((acc: number, p: any) => 
        acc + (Number(p.valor) || 0), 0
      );

      const receitaMes = pedidosMes.reduce((acc: number, p: any) => 
        acc + (Number(p.valor) || 0), 0
      );

      const receitaHoje = pedidosHoje.reduce((acc: number, p: any) => 
        acc + (Number(p.valor) || 0), 0
      );

      // Ticket médio
      const ticketMedio = pedidosArray.length > 0 
        ? receitaTotal / pedidosArray.length 
        : 0;

      setData({
        receitaTotal,
        receitaMes,
        receitaHoje,
        totalPedidos: pedidosArray.length,
        pedidosMes: pedidosMes.length,
        pedidosHoje: pedidosHoje.length,
        totalClientes: Array.isArray(clientes) ? clientes.length : 0,
        ticketMedio,
        produtoMaisVendido: '-',
        mesaMaisUsada: '-',
      });
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
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
        <div className="text-lg">Carregando relatórios...</div>
      </div>
    );
  }

  const exportarPDF = async () => {
    try {
      toast.info('Gerando PDF...', {
        description: 'Aguarde enquanto preparamos seu relatório'
      });

      // Gerar PDF diretamente no frontend com os dados já carregados
      gerarPDFRelatorio({
        receitaTotal: data.receitaTotal,
        receitaMes: data.receitaMes,
        receitaHoje: data.receitaHoje,
        totalPedidos: data.totalPedidos,
        pedidosMes: data.pedidosMes,
        pedidosHoje: data.pedidosHoje
      });

      toast.success('PDF gerado com sucesso!', {
        description: 'O arquivo foi baixado para seu computador'
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao gerar relatório', {
        description: 'Tente novamente mais tarde'
      });
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análise de desempenho do restaurante</p>
        </div>
        <Button onClick={exportarPDF}>
          <Download className="mr-2 h-4 w-4" />
            Exportar PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.receitaTotal)}</div>
            <p className="text-xs text-muted-foreground">Desde o início</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.receitaMes)}</div>
            <p className="text-xs text-muted-foreground">{data.pedidosMes} pedidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.receitaHoje)}</div>
            <p className="text-xs text-muted-foreground">{data.pedidosHoje} pedidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.ticketMedio)}</div>
            <p className="text-xs text-muted-foreground">Por pedido</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total de Pedidos</span>
                <span className="text-2xl font-bold">{data.totalPedidos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pedidos do Mês</span>
                <span className="text-2xl font-bold text-blue-600">{data.pedidosMes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pedidos Hoje</span>
                <span className="text-2xl font-bold text-green-600">{data.pedidosHoje}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total de Clientes</span>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">{data.totalClientes}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Produto Mais Vendido</span>
                <span className="text-lg font-semibold">{data.produtoMaisVendido}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mesa Mais Usada</span>
                <span className="text-lg font-semibold">{data.mesaMaisUsada}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Hoje</div>
                <div className="text-2xl font-bold">{formatCurrency(data.receitaHoje)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {data.pedidosHoje} pedidos
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Este Mês</div>
                <div className="text-2xl font-bold">{formatCurrency(data.receitaMes)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {data.pedidosMes} pedidos
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Total</div>
                <div className="text-2xl font-bold">{formatCurrency(data.receitaTotal)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {data.totalPedidos} pedidos
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
