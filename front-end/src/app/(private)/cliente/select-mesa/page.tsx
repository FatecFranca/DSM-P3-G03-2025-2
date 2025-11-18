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

      const mesas = await api.get<Mesa[]>('/mesas');
      const mesa = mesas.find((m) => m.numero_mesa === numero);

      if (!mesa) {
        setError(`Mesa número ${numero} não encontrada. Verifique o número na sua mesa.`);
        setLoading(false);
        return;
      }

      if (mesa.status && mesa.status !== 'livre') {
        setError(`Mesa ${numero} não está disponível. Status atual: ${mesa.status}`);
        setLoading(false);
        return;
      }

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
      const todosClientes = await api.get<any[]>('/clientes');
      const clientesDaMesa = todosClientes.filter((c) => c.mesa_id === mesaEncontrada.id);
      
      await api.put(`/clientes/${user.id}`, {
        mesa_id: mesaEncontrada.id,
      });

      const novoTotalClientes = clientesDaMesa.length + 1;
      const atingiuCapacidadeMaxima = novoTotalClientes >= mesaEncontrada.capacidade;
      
      await api.put(`/mesas/${mesaEncontrada.id}`, {
        status: atingiuCapacidadeMaxima ? 'ocupada' : 'livre',
      });

      toast.success(`Mesa ${mesaEncontrada.numero_mesa} confirmada!`, {
        description: `Capacidade para ${mesaEncontrada.capacidade} pessoas`,
      });

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
    // MUDANÇA: bg-transparent para mostrar os blobs globais
    <div className="min-h-screen bg-transparent">
      
      {/* Header com Glass Effect */}
      <div className="glass-header">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Seleção de Mesa</h2>
              <p className="text-xs text-muted-foreground">Escolha sua mesa</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/50 border border-orange-200 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <User className="w-4 h-4 text-primary" />
                <a href="/cliente/perfil">
                  <span className="text-sm font-medium truncate max-w-[150px] text-foreground hover:text-primary transition-colors">
                    {user?.nome}
                  </span>
                </a>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 border-orange-200 hover:bg-orange-50 text-orange-700"
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
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20 transform rotate-3 hover:rotate-0 transition-all duration-300">
            <UtensilsCrossed className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo!</h1>
          <p className="text-muted-foreground">
            Digite o número da sua mesa para começar
          </p>
        </div>

        {/* Card Principal com Glass Panel */}
        <Card className="glass-panel border-orange-200">
          <CardHeader>
            <CardTitle className="text-foreground">Selecionar Mesa</CardTitle>
            <CardDescription>
              Você encontra o número impresso na sua mesa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="numero" className="text-foreground font-medium">Número da Mesa</Label>
                <Input
                  id="numero"
                  type="number"
                  placeholder="Ex: 1, 2, 3..."
                  value={numeroMesa}
                  onChange={handleNumeroChange}
                  min="1"
                  className="text-center text-2xl font-bold tracking-wider bg-white/50 border-orange-200 focus:border-primary focus:ring-primary h-14"
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Mesa Encontrada */}
              {mesaEncontrada && (
                <div className="border border-green-200 bg-green-50/80 backdrop-blur-sm rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-green-900">
                          Mesa Encontrada!
                        </h3>
                        <p className="text-sm text-green-700">
                          Mesa Nº {mesaEncontrada.numero_mesa}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                        <span className="text-green-800">Capacidade</span>
                        <span className="font-semibold flex items-center gap-1 text-green-900">
                          <Users className="h-4 w-4" />
                          {mesaEncontrada.capacidade} pessoas
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                        <span className="text-green-800">Status</span>
                        <span className="font-semibold text-green-900">
                          {mesaEncontrada.status || 'Disponível'}
                        </span>
                      </div>
                    </div>
                </div>
              )}

              {!mesaEncontrada ? (
                <Button 
                  type="submit" 
                  className="w-full h-11 font-semibold text-base shadow-md" 
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
                  className="w-full h-11 font-semibold text-base shadow-md bg-green-600 hover:bg-green-700" 
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
                <span className="w-full border-t border-orange-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-2 text-muted-foreground rounded-full border border-orange-100">
                  ou
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary"
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
        <Card className="glass-panel bg-white/40 border-orange-100">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm">
                  1
                </div>
                <p className="text-muted-foreground">
                  Localize o número da sua mesa
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm">
                  2
                </div>
                <p className="text-muted-foreground">
                  Digite o número no campo acima
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm">
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