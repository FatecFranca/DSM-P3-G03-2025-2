"use client";
import { useState } from 'react';
import { useAuth } from '@/src/app/contexts/AuthContext';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
import { Label } from '@/src/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Alert, AlertDescription } from '@/src/app/components/ui/alert';
import { UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      
      // Redirecionar baseado no role do usuário
      switch (loggedUser.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'garcom':
          router.push('/garcom/mesas');
          break;
        case 'cliente':
          router.push('/cliente/select-mesa');
          break;
        default:
          router.push('/');
      }
    } catch (err) {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <UtensilsCrossed className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle>Sistema de Gerenciamento de Mesas</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link href="/register" className="text-primary hover:underline font-medium">
                Criar conta
              </Link>
            </div>

            <div className="mt-4 space-y-2 rounded-md bg-muted p-4">
              <p className="text-sm text-muted-foreground">Credenciais de teste:</p>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Admin:</strong> admin@mesa.com / admin123
                </p>
                <p>
                  <strong>Garçom:</strong> garcom@mesa.com / garcom123
                </p>
                <p>
                  <strong>Cliente:</strong> cliente@mesa.com / cliente123
                </p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
