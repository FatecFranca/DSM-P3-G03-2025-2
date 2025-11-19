"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
import { Label } from '@/src/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Alert, AlertDescription } from '@/src/app/components/ui/alert';
import { UtensilsCrossed } from 'lucide-react';
import { authAPI } from '@/src/app/lib/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf: '',
    celular: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 Registrando novo usuário...');
      
      // Registrar usando JWT
      const response = await authAPI.register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf || undefined,
        celular: formData.celular || undefined
      });

      console.log('✅ Registro bem-sucedido:', response.user);
      console.log('🔑 Token JWT salvo');

      // Redirecionar para seleção de mesa
      router.push('/cliente/select-mesa');
    } catch (err: any) {
      console.error('❌ Erro no registro:', err);
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4 relative overflow-hidden4">
      <Card className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-orange-300/50 shadow-2xl hover:shadow-orange-300/70 transition-transform hover:scale-101">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <UtensilsCrossed className="h-8 w-8 text-orange-300" />
          </div>
          <CardTitle
            className="text-2xl font-bold text-black"
            style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>
              Criar Conta!
          </CardTitle>
          <CardDescription>Preencha seus dados para começar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="space-y-2 text-gray-700 font-bold "
                style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }} >Nome Completo *</Label>
              <Input
                className='bg-white/50 border-orange-300/60 focus:border-primary focus:ring-primary text-gray-900 shadow border hover:shadow-orange-300/80'
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="space-y-2 text-gray-700 font-bold "
                style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>Email *</Label>
              <Input
                id="email"
                className='bg-white/50 border-orange-300/60 focus:border-primary focus:ring-primary text-gray-900 shadow border hover:shadow-orange-300/80'
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="space-y-2 text-gray-700 font-bold "
                style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>Senha *</Label>
              <Input
                id="senha"
                className='bg-white/50 border-orange-300/60 focus:border-primary focus:ring-primary text-gray-900 shadow border hover:shadow-orange-300/80'
                name="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha" className="space-y-2 text-gray-700 font-bold "
                style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>Confirmar Senha *</Label>
              <Input
                id="confirmarSenha"
                className='bg-white/50 border-orange-300/60 focus:border-primary focus:ring-primary text-gray-900 shadow border hover:shadow-orange-300/80'
                name="confirmarSenha"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf"className="space-y-2 text-gray-700 font-bold "
                style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>CPF </Label>
              <Input
                id="cpf"
                className='bg-white/50 border-orange-300/60 focus:border-primary
                 focus:ring-primary text-gray-900 shadow border hover:shadow-orange-300/80'
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular"className="space-y-2 text-gray-700 font-bold "
                style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>Celular </Label>
              <Input
                id="celular"
                className='bg-white/50 border-orange-300/60 focus:border-primary focus:ring-primary text-gray-900
                 shadow border hover:shadow-orange-300/80'
                name="celular"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.celular}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit"  className="w-full font-bold text-orange-300 shadow-md transition-all
              hover:bg-orange-300 hover:text-black hover:shadow-lg hover:shadow-orange-300/50
               transition-transform hover:scale-101 " 
             disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/sign-in" className="text-gray-700 font-bold hover:text-orange-300 hover:underline"
              style={{ textShadow: "2px 2px 6px rgba(253, 186, 116, 0.8)" }}>
                Fazer login
              </Link>
            </div>

            <div className="mt-4 rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                🔒 Sua senha será criptografada com bcrypt e um token JWT será gerado para autenticação segura.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}