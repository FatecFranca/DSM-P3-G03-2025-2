"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
import { Label } from '@/src/app/components/ui/label';
import { Alert, AlertDescription } from '@/src/app/components/ui/alert';
import { UtensilsCrossed, ArrowRight, QrCode, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock de mesas válidas
const mesasValidas = [
  { codigo: 'MESA01', numero: 1, capacidade: 4 },
  { codigo: 'MESA02', numero: 2, capacidade: 2 },
  { codigo: 'MESA03', numero: 3, capacidade: 6 },
  { codigo: 'MESA04', numero: 4, capacidade: 4 },
  { codigo: 'MESA05', numero: 5, capacidade: 8 },
  { codigo: 'MESA06', numero: 6, capacidade: 2 },
  { codigo: 'MESA07', numero: 7, capacidade: 4 },
  { codigo: 'MESA08', numero: 8, capacidade: 6 },
];

export default function SelectMesaPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simula validação
    await new Promise(resolve => setTimeout(resolve, 1000));

    const codigoUpper = codigo.toUpperCase().trim();
    const mesaEncontrada = mesasValidas.find(m => m.codigo === codigoUpper);

    if (mesaEncontrada) {
      toast.success(`Mesa ${mesaEncontrada.numero} confirmada!`, {
        description: `Capacidade para ${mesaEncontrada.capacidade} pessoas`,
      });
      
      // Redireciona para a página da mesa com query params
      setTimeout(() => {
        router.push(`/cliente/pedido-mesa?mesa=${mesaEncontrada.numero}&capacidade=${mesaEncontrada.capacidade}&codigo=${mesaEncontrada.codigo}`);
      }, 500);
    } else {
      setError('Código inválido. Verifique o código na sua mesa e tente novamente.');
      setLoading(false);
    }
  };

  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCodigo(value);
    if (error) setError('');
  };

  const handleScanQR = () => {
    toast.info('Escaneamento de QR Code', {
      description: 'Funcionalidade em desenvolvimento',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <UtensilsCrossed className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Bem-vindo!</h1>
          <p className="text-muted-foreground">
            Digite o código da sua mesa para começar
          </p>
        </div>

        {/* Card Principal */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Selecionar Mesa</CardTitle>
            <CardDescription>
              Você encontra o código impresso na sua mesa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código da Mesa</Label>
                <Input
                  id="codigo"
                  type="text"
                  placeholder="Ex: MESA01"
                  value={codigo}
                  onChange={handleCodigoChange}
                  maxLength={10}
                  className="text-center text-lg font-mono tracking-wider uppercase"
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={!codigo.trim() || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
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
                  Localize o código na sua mesa
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  2
                </div>
                <p className="text-muted-foreground">
                  Digite o código no campo acima
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  3
                </div>
                <p className="text-muted-foreground">
                  Faça seu pedido pelo cardápio digital
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Códigos de Teste (apenas para desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Códigos de Teste</CardTitle>
              <CardDescription className="text-xs">
                Apenas em desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {mesasValidas.slice(0, 4).map((mesa) => (
                  <Button
                    key={mesa.codigo}
                    variant="outline"
                    size="sm"
                    onClick={() => setCodigo(mesa.codigo)}
                    className="font-mono"
                  >
                    {mesa.codigo}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}