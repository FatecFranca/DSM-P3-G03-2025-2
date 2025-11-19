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
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || password.trim() === '') {
      setError('A senha é obrigatória');
      return;
    }

    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (loggedUser.role === 'garcom') {
        router.push('/garcom/mesas');
      } else if (loggedUser.role === 'cliente') {
        router.push('/cliente/select-mesa');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fundo transparente para mostrar os elementos globais
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4 relative overflow-hidden">
      
      {/* BLOBS DE FUNDO (Garantia que apareçam no login) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-300/20 rounded-full blur-[100px] -z-10" />

      {/* CARD GLASS - Adicionei border-orange-300 explicitamente */}
      <Card className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-orange-300/50 shadow-2xl
       hover:shadow-orange-300/80 transition-transform hover:scale-101">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-orange-500/20">
            <UtensilsCrossed className="h-8 w-8 text-orange-300 " />
            
            
          </div>
        
          <CardTitle
            className="text-2xl font-bold text-black"
            style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>
              Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-gray-600">Entre com seu email e senha</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="space-y-2 text-gray-700 font-bold hover "
                style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }} >Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                // Input com fundo branco semitransparente e borda laranja
                className="bg-white/50 border-orange-300/60 focus:border-primary focus:ring-primary text-gray-900 shadow border hover:shadow-orange-300/80"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 font-bold "
                style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="bg-white/50 border-orange-300/60 focus:border-primary focus:ring-primary text-gray-900 shadow border hover:shadow-orange-300/80"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full font-bold text-orange-300 shadow-md transition-all
              hover:bg-orange-300 hover:text-black hover:shadow-lg hover:shadow-orange-300/50
              transition-transform hover:scale-101"
              disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Não tem uma conta? </span>
              <Link href="/register" className="text-gray-700 font-bold hover:text-orange-300
               hover:underline" 
                style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>
                Criar conta
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}