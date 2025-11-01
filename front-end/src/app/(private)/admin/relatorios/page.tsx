"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Label } from '@/src/app/components/ui/label';
import { Input } from '@/src/app/components/ui/input';
import { Button } from '@/src/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/app/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Calendar } from 'lucide-react';

// Mock data
const vendas30Dias = [
  { data: '01/01', valor: 1200 },
  { data: '02/01', valor: 1500 },
  { data: '03/01', valor: 1800 },
  { data: '04/01', valor: 2100 },
  { data: '05/01', valor: 1900 },
  { data: '06/01', valor: 2400 },
  { data: '07/01', valor: 2800 },
];

const produtosMaisVendidos = [
  { nome: 'Hambúrguer', quantidade: 145 },
  { nome: 'Refrigerante', quantidade: 230 },
  { nome: 'Batata Frita', quantidade: 180 },
  { nome: 'Pizza', quantidade: 95 },
  { nome: 'Salada', quantidade: 68 },
];

const mesasUtilizacao = [
  { nome: 'Disponível', value: 35 },
  { nome: 'Ocupada', value: 40 },
  { nome: 'Reservada', value: 15 },
  { nome: 'Fechada', value: 10 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#6b7280'];

const faturamentoPorCategoria = [
  { categoria: 'Bebidas', valor: 4500 },
  { categoria: 'Lanches', valor: 8200 },
  { categoria: 'Sobremesas', valor: 2100 },
  { categoria: 'Pratos Principais', valor: 12400 },
  { categoria: 'Entradas', valor: 3200 },
];

export default function RelatoriosPage() {
  const [dateRange, setDateRange] = useState({
    inicio: '',
    fim: '',
  });
  const [tipoRelatorio, setTipoRelatorio] = useState('vendas');

  const handleExport = () => {
    alert('Exportando relatório...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Relatórios</h1>
          <p className="text-muted-foreground">
            Análise e estatísticas do restaurante
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="tipo">Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="produtos">Produtos</SelectItem>
                  <SelectItem value="mesas">Mesas</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="inicio">Data Início</Label>
              <Input
                id="inicio"
                type="date"
                value={dateRange.inicio}
                onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fim">Data Fim</Label>
              <Input
                id="fim"
                type="date"
                value={dateRange.fim}
                onChange={(e) => setDateRange({ ...dateRange, fim: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Faturamento - Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vendas30Dias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`R$ ${value}`, 'Faturamento']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Line type="monotone" dataKey="valor" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilização de Mesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mesasUtilizacao}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, value }) => `${nome}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mesasUtilizacao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Percentual']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={produtosMaisVendidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} unidades`, 'Quantidade']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="quantidade" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faturamento por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faturamentoPorCategoria} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="categoria" type="category" width={120} />
                <Tooltip
                  formatter={(value) => [`R$ ${value}`, 'Faturamento']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="valor" fill="hsl(var(--chart-4))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">Total de Vendas</p>
              <p>R$ 30.400,00</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Ticket Médio</p>
              <p>R$ 125,50</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Total de Pedidos</p>
              <p>242</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Taxa de Ocupação</p>
              <p>68%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
