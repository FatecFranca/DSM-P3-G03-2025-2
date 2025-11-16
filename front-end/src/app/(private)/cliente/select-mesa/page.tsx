"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
import { Label } from '@/src/app/components/ui/label';
import { Alert, AlertDescription } from '@/src/app/components/ui/alert';
import { UtensilsCrossed, ArrowRight, QrCode, Loader2, CheckCircle, Users, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/src/app/lib/api';
import { useAuth } from '@/src/app/contexts/AuthContext';

interface Mesa {
  id: string;
  numero: number;
  numero_mesa: number;
  capacidade: number;
  status?: string;
}

export default function SelectMesaPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [numeroMesa, setNumeroMesa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mesaEncontrada, setMesaEncontrada] = useState<Mesa | null>(null);

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
    router.push('/sign-in');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setMesaEncontrada(null);

    try {
      const numero = parseInt(numeroMesa.trim());

      if (isNaN(numero) || numero <= 0) {
        setError('Digite um número válido');
        setLoading(false);
        return;
      }

      // Buscar todas as mesas
      const mesas = await api.get<Mesa[]>('/mesas');
      
      // Encontrar mesa pelo numero_mesa
      const mesa = mesas.find((m) => m.numero_mesa === numero);

      if (!mesa) {
        setError(`Mesa número ${numero} não encontrada. Verifique o número na sua mesa.`);
        setLoading(false);
        return;
      }

      // Verificar se a mesa está disponível
      if (mesa.status && mesa.status !== 'livre') {
        setError(`Mesa ${numero} não está disponível. Status atual: ${mesa.status}`);
        setLoading(false);
        return;
      }

      // Mostrar mesa encontrada
      setMesaEncontrada(mesa);
      
    } catch (err: any) {
      console.error('Erro ao buscar mesa:', err);
      setError('Erro ao buscar mesa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarMesa = async () => {
    if (!mesaEncontrada || !user) return;

    setLoading(true);
    setError('');

    try {
      // Buscar todos os clientes para verificar quantos já estão na mesa
      const todosClientes = await api.get<any[]>('/clientes');
      const clientesDaMesa = todosClientes.filter((c) => c.mesa_id === mesaEncontrada.id);
      
      // Atualizar cliente com a mesa selecionada
      await api.put(`/clientes/${user.id}`, {
        mesa_id: mesaEncontrada.id,
      });

      // Verificar se com o novo cliente a mesa atinge a capacidade máxima
      const novoTotalClientes = clientesDaMesa.length + 1;
      const atingiuCapacidadeMaxima = novoTotalClientes >= mesaEncontrada.capacidade;
      
      // Atualizar status da mesa: 'ocupada' apenas se atingir capacidade máxima
      await api.put(`/mesas/${mesaEncontrada.id}`, {
        status: atingiuCapacidadeMaxima ? 'ocupada' : 'livre',
      });

      // Atualizar usuário no contexto
      

      toast.success(`Mesa ${mesaEncontrada.numero_mesa} confirmada!`, {
        description: `Capacidade para ${mesaEncontrada.capacidade} pessoas`,
      });

      // Redirecionar para página de pedido
      setTimeout(() => {
        router.push('/cliente/pedido-mesa');
      }, 500);

    } catch (err: any) {
      console.error('Erro ao confirmar mesa:', err);
      setError(err.response?.data?.error || 'Erro ao confirmar mesa. Tente novamente.');
      setLoading(false);
    }
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumeroMesa(value);
    if (error) setError('');
    if (mesaEncontrada) setMesaEncontrada(null);
  };

  const handleScanQR = () => {
    toast.info('Escaneamento de QR Code', {
      description: 'Funcionalidade em desenvolvimento',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header com Logout */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Seleção de Mesa</h2>
              <p className="text-xs text-muted-foreground">Escolha sua mesa</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium truncate max-w-[150px]">{user?.nome}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md space-y-6">
        {/* Logo e Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <UtensilsCrossed className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Bem-vindo!</h1>
          <p className="text-muted-foreground">
            Digite o número da sua mesa para começar
          </p>
        </div>

        {/* Card Principal */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Selecionar Mesa</CardTitle>
            <CardDescription>
              Você encontra o número impresso na sua mesa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número da Mesa</Label>
                <Input
                  id="numero"
                  type="number"
                  placeholder="Ex: 1, 2, 3..."
                  value={numeroMesa}
                  onChange={handleNumeroChange}
                  min="1"
                  className="text-center text-2xl font-bold tracking-wider"
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Mesa Encontrada */}
              {mesaEncontrada && (
                <Card className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100">
                          Mesa Encontrada!
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Mesa Nº {mesaEncontrada.numero_mesa}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 dark:text-green-300">Capacidade</span>
                        <span className="font-semibold flex items-center gap-1 text-green-900 dark:text-green-100">
                          <Users className="h-4 w-4" />
                          {mesaEncontrada.capacidade} pessoas
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 dark:text-green-300">Status</span>
                        <span className="font-semibold text-green-900 dark:text-green-100">
                          {mesaEncontrada.status || 'Disponível'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!mesaEncontrada ? (
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={!numeroMesa.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Verificar Mesa
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  type="button"
                  onClick={handleConfirmarMesa}
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    <>
                      Confirmar e Continuar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={handleScanQR}
              disabled={loading}
            >
              <QrCode className="mr-2 h-5 w-5" />
              Escanear QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  1
                </div>
                <p className="text-muted-foreground">
                  Localize o número da sua mesa
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  2
                </div>
                <p className="text-muted-foreground">
                  Digite o número no campo acima
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  3
                </div>
                <p className="text-muted-foreground">
                  Confirme e faça seu pedido pelo cardápio digital
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}