"use client";

import { useState } from 'react';
import { MetricCard } from '@/src/app/components/MetricCard';
import { DataTable, Column } from '@/src/app/components/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Button } from '@/src/app/components/ui/button';
import { DashboardMetrics, Pedido, Mesa } from '@/src/app/types';
import {
  UtensilsCrossed,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useRouter } from 'next/navigation';

// Mock data expandido
const mockMetrics: DashboardMetrics = {
  total_mesas: 20,
  mesas_ocupadas: 12,
  pedidos_hoje: 68,
  faturamento_dia: 4850.75,
  mesas_disponiveis: 8,
};

const mockRecentOrders: Pedido[] = [
  {
    id: '1',
    num_pedido: 'PED001',
    data_hora: new Date(Date.now() - 300000).toISOString(),
    mesa_id: '1',
    total: 125.50,
    status: 'Em andamento',
  },
  {
    id: '2',
    num_pedido: 'PED002',
    data_hora: new Date(Date.now() - 600000).toISOString(),
    mesa_id: '3',
    total: 89.90,
    status: 'Concluído',
  },
  {
    id: '3',
    num_pedido: 'PED003',
    data_hora: new Date(Date.now() - 900000).toISOString(),
    mesa_id: '5',
    total: 234.00,
    status: 'Em andamento',
  },
  {
    id: '4',
    num_pedido: 'PED004',
    data_hora: new Date(Date.now() - 1200000).toISOString(),
    mesa_id: '7',
    total: 178.30,
    status: 'Concluído',
  },
  {
    id: '5',
    num_pedido: 'PED005',
    data_hora: new Date(Date.now() - 1500000).toISOString(),
    mesa_id: '9',
    total: 95.40,
    status: 'Pendente',
  },
];

const mockMesasOcupadas: Mesa[] = [
  { id: '1', numero: 1, capacidade: 4, status: 'Ocupada' },
  { id: '2', numero: 3, capacidade: 2, status: 'Em atendimento' },
  { id: '3', numero: 5, capacidade: 6, status: 'Ocupada' },
  { id: '4', numero: 7, capacidade: 4, status: 'Em atendimento' },
  { id: '5', numero: 9, capacidade: 8, status: 'Ocupada' },
];

// Dados de faturamento semanal
const faturamentoSemanal = [
  { day: 'Seg', value: 2400, pedidos: 32 },
  { day: 'Ter', value: 1890, pedidos: 28 },
  { day: 'Qua', value: 3200, pedidos: 45 },
  { day: 'Qui', value: 3908, pedidos: 52 },
  { day: 'Sex', value: 4800, pedidos: 61 },
  { day: 'Sáb', value: 5200, pedidos: 68 },
  { day: 'Dom', value: 4100, pedidos: 55 },
];

// Dados de vendas por categoria
const vendasPorCategoria = [
  { name: 'Bebidas', value: 1200, color: '#8884d8' },
  { name: 'Lanches', value: 1800, color: '#82ca9d' },
  { name: 'Pratos', value: 2400, color: '#ffc658' },
  { name: 'Sobremesas', value: 800, color: '#ff8042' },
];

// Dados de horários de pico
const horariosPico = [
  { hora: '11h', pedidos: 5 },
  { hora: '12h', pedidos: 15 },
  { hora: '13h', pedidos: 22 },
  { hora: '14h', pedidos: 12 },
  { hora: '18h', pedidos: 8 },
  { hora: '19h', pedidos: 18 },
  { hora: '20h', pedidos: 25 },
  { hora: '21h', pedidos: 16 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [metrics] = useState<DashboardMetrics>(mockMetrics);
  const [selectedPeriod, setSelectedPeriod] = useState<'hoje' | 'semana' | 'mes'>('hoje');

  const orderColumns: Column<Pedido>[] = [
    { 
      header: 'Nº Pedido', 
      accessor: 'num_pedido',
      className: 'font-semibold',
    },
    { 
      header: 'Mesa', 
      accessor: (row) => {
        const mesa = mockMesasOcupadas.find(m => m.id === row.mesa_id);
        return `Mesa ${mesa?.numero || '-'}`;
      }
    },
    {
      header: 'Horário',
      accessor: (row) => {
        const date = new Date(row.data_hora);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      },
    },
    {
      header: 'Status',
      accessor: 'status',
    },
    {
      header: 'Total',
      accessor: (row) => `R$ ${row.total?.toFixed(2)}`,
      className: 'font-semibold text-right',
    },
  ];

  const mesaColumns: Column<Mesa>[] = [
    { 
      header: 'Mesa', 
      accessor: (row) => `Mesa ${row.numero}`,
      className: 'font-semibold',
    },
    { 
      header: 'Capacidade', 
      accessor: (row) => `${row.capacidade} pessoas`,
    },
    { 
      header: 'Status', 
      accessor: 'status',
    },
  ];

  const taxaOcupacao = ((metrics.mesas_ocupadas / metrics.total_mesas) * 100).toFixed(0);
  const ticketMedio = (metrics.faturamento_dia / metrics.pedidos_hoje).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header com período de tempo */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do restaurante em tempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === 'hoje' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('hoje')}
          >
            Hoje
          </Button>
          <Button 
            variant={selectedPeriod === 'semana' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('semana')}
          >
            Semana
          </Button>
          <Button 
            variant={selectedPeriod === 'mes' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('mes')}
          >
            Mês
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Faturamento Hoje"
          value={`R$ ${metrics.faturamento_dia.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
          description="vs. ontem"
        />
        <MetricCard
          title="Pedidos Hoje"
          value={metrics.pedidos_hoje}
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
          description={`Ticket médio: R$ ${ticketMedio}`}
        />
        <MetricCard
          title="Taxa de Ocupação"
          value={`${taxaOcupacao}%`}
          icon={UtensilsCrossed}
          description={`${metrics.mesas_ocupadas}/${metrics.total_mesas} mesas ocupadas`}
        />
        <MetricCard
          title="Mesas Disponíveis"
          value={metrics.mesas_disponiveis}
          icon={CheckCircle}
          description="Pronto para atender"
        />
      </div>

      {/* Alertas e avisos */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="flex items-center gap-4 p-4">
          <AlertCircle className="h-6 w-6 text-amber-500" />
          <div className="flex-1">
            <p className="font-semibold">Horário de pico detectado</p>
            <p className="text-sm text-muted-foreground">
              Alta demanda entre 19h-21h. 3 pedidos aguardando atendimento.
            </p>
          </div>
          <Button onClick={() => router.push('/admin/pedidos')}>
            Ver Pedidos
          </Button>
        </CardContent>
      </Card>

      {/* Gráficos principais */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Faturamento Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Faturamento Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faturamentoSemanal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'value') return [`R$ ${value}`, 'Faturamento'];
                    return [value, name];
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Horários de Pico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horários de Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={horariosPico}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hora" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pedidos" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vendas por Categoria e Mesas Ocupadas */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Vendas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Vendas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vendasPorCategoria}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vendasPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `R$ ${value}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mesas Ocupadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mesas em Atendimento</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/admin/mesas')}
            >
              Ver Todas
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={mesaColumns}
              data={mockMesasOcupadas}
              keyExtractor={(row) => row.id}
              showActions={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Pedidos Recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pedidos Recentes</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Últimos pedidos realizados hoje
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => router.push('/admin/pedidos')}
          >
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={orderColumns}
            data={mockRecentOrders}
            keyExtractor={(row) => row.id}
            showActions={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
