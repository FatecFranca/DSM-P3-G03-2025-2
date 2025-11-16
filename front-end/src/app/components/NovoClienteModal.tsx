"use client";
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/app/components/ui/dialog';
import { Button } from '@/src/app/components/ui/button';
import { Input } from '@/src/app/components/ui/input';
import { Label } from '@/src/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/app/components/ui/select';
import { Alert, AlertDescription } from '@/src/app/components/ui/alert';
import { Checkbox } from '@/src/app/components/ui/checkbox';
import { clientesAPI, api, mesasAPI } from '@/src/app/lib/api';
import { AlertCircle, Loader2 } from 'lucide-react';

interface NovoClienteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Mesa {
  id: string;
  numero: number;
  status: string;
}

export function NovoClienteModal({ open, onClose, onSuccess }: NovoClienteModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    celular: '',
    cpf: '',
    senha: '',
    mesa_id: undefined as string | undefined,
    admin: false,
  });
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMesas, setLoadingMesas] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadMesas();
    }
  }, [open]);

  const loadMesas = async () => {
    try {
      setLoadingMesas(true);
      const mesasData = await api.get<Mesa[]>('/mesas');
      setMesas(mesasData);
    } catch (err) {
      console.error('Erro ao carregar mesas:', err);
    } finally {
      setLoadingMesas(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.nome || !formData.email || !formData.senha) {
      setError('Nome, email e senha são obrigatórios');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return;
    }

    // Validar CPF (formato básico)
    if (formData.cpf) {
      const cpfLimpo = formData.cpf.replace(/\D/g, '');
      if (cpfLimpo.length !== 11) {
        setError('CPF deve ter 11 dígitos');
        return;
      }
    }

    // Validar celular
    if (formData.celular) {
      const celularLimpo = formData.celular.replace(/\D/g, '');
      if (celularLimpo.length < 10 || celularLimpo.length > 11) {
        setError('Celular inválido');
        return;
      }
    }

    // Validar senha
    if (formData.senha.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      setLoading(true);

      // Preparar dados para envio
      const clienteData: any = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        admin: formData.admin,
      };

      // Adicionar campos opcionais se preenchidos
      if (formData.celular) {
        clienteData.celular = formData.celular.replace(/\D/g, '');
      }
      if (formData.cpf) {
        clienteData.cpf = formData.cpf.replace(/\D/g, '');
      }
      if (formData.mesa_id) {
        clienteData.mesa_id = formData.mesa_id;
      }

      // Criar cliente via API
      await clientesAPI.create(clienteData);

      // Se cliente foi vinculado a uma mesa, verificar capacidade
      if (formData.mesa_id) {
        // Buscar todos os clientes para contar quantos estão na mesa
        const todosClientes = await api.get<any[]>('/clientes');
        const clientesDaMesa = todosClientes.filter((c) => c.mesa_id === formData.mesa_id);
        
        // Buscar dados da mesa para verificar capacidade
        const mesaAtual = await mesasAPI.get(formData.mesa_id);
        
        // Verificar se atingiu capacidade máxima
        const atingiuCapacidadeMaxima = clientesDaMesa.length >= mesaAtual.capacidade;
        
        // Atualizar status da mesa: 'ocupada' apenas se atingir capacidade máxima
        await mesasAPI.update(formData.mesa_id, {
          status: atingiuCapacidadeMaxima ? 'ocupada' : 'livre',
        });
      }

      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        celular: '',
        cpf: '',
        senha: '',
        mesa_id: undefined,
        admin: false,
      });

      // Chamar callback de sucesso
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao criar cliente:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao criar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        nome: '',
        email: '',
        celular: '',
        cpf: '',
        senha: '',
        mesa_id: undefined,
        admin: false,
      });
      setError('');
      onClose();
    }
  };

  const formatCPF = (value: string) => {
    const cpf = value.replace(/\D/g, '');
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatCelular = (value: string) => {
    const celular = value.replace(/\D/g, '');
    if (celular.length <= 10) {
      return celular.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return celular.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Cadastre um novo cliente no sistema
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Nome */}
            <div className="grid gap-2">
              <Label htmlFor="nome">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                type="text"
                placeholder="Ex: João Silva"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: joao@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            {/* Senha */}
            <div className="grid gap-2">
              <Label htmlFor="senha">
                Senha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.senha}
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            {/* CPF */}
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                maxLength={14}
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: formatCPF(e.target.value) })
                }
                disabled={loading}
              />
            </div>

            {/* Celular */}
            <div className="grid gap-2">
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                type="text"
                placeholder="(00) 00000-0000"
                maxLength={15}
                value={formData.celular}
                onChange={(e) =>
                  setFormData({ ...formData, celular: formatCelular(e.target.value) })
                }
                disabled={loading}
              />
            </div>

            {/* Mesa */}
            <div className="grid gap-2">
              <Label htmlFor="mesa">Mesa (Opcional)</Label>
              <Select
                value={formData.mesa_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, mesa_id: value })
                }
                disabled={loading || loadingMesas}
              >
                <SelectTrigger id="mesa">
                  <SelectValue placeholder="Nenhuma mesa selecionada" />
                </SelectTrigger>
                <SelectContent>
                  {mesas
                    .filter((m) => m.status === 'livre' || m.status === 'ocupada')
                    .map((mesa) => (
                      <SelectItem key={mesa.id} value={mesa.id}>
                        Mesa {mesa.numero} - {mesa.status}
                      </SelectItem>
                    ))}
                  {mesas.filter((m) => m.status === 'livre' || m.status === 'ocupada').length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Nenhuma mesa disponível
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Admin */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="admin"
                checked={formData.admin}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, admin: checked as boolean })
                }
                disabled={loading}
              />
              <Label
                htmlFor="admin"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Administrador
              </Label>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Cliente'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}