"use client";
import { useState } from 'react';
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
import { api } from '@/src/app/lib/api';
import { AlertCircle, Loader2 } from 'lucide-react';

interface NovaMesaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NovaMesaModal({ open, onClose, onSuccess }: NovaMesaModalProps) {
  const [formData, setFormData] = useState({
    numero: '',
    numero_mesa: '',
    capacidade: '',
    status: 'livre',
    data_reserva: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.numero || !formData.numero_mesa || !formData.capacidade) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    const numero = parseInt(formData.numero);
    const numero_mesa = parseInt(formData.numero_mesa);
    const capacidade = parseInt(formData.capacidade);

    if (isNaN(numero) || numero <= 0) {
      setError('Número deve ser um valor positivo');
      return;
    }

    if (isNaN(numero_mesa) || numero_mesa <= 0) {
      setError('Número da mesa deve ser um valor positivo');
      return;
    }

    if (isNaN(capacidade) || capacidade <= 0) {
      setError('Capacidade deve ser um valor positivo');
      return;
    }

    // Validar data de reserva se status for "reservada"
    if (formData.status === 'reservada' && !formData.data_reserva) {
      setError('Data de reserva é obrigatória para mesas reservadas');
      return;
    }

    try {
      setLoading(true);

      // Preparar dados para envio
      const mesaData: any = {
        numero,
        numero_mesa,
        capacidade,
        status: formData.status,
        data_reserva: formData.data_reserva
          ? new Date(formData.data_reserva).toISOString()
          : null,
      };

      // Criar mesa via API
      await api.post('/mesas', mesaData);

      // Limpar formulário
      setFormData({
        numero: '',
        numero_mesa: '',
        capacidade: '',
        status: 'livre',
        data_reserva: '',
      });

      // Chamar callback de sucesso
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Erro ao criar mesa:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao criar mesa');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        numero: '',
        numero_mesa: '',
        capacidade: '',
        status: 'livre',
        data_reserva: '',
      });
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Mesa</DialogTitle>
            <DialogDescription>
              Cadastre uma nova mesa no restaurante
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Número */}
            <div className="grid gap-2">
              <Label htmlFor="numero">
                Número <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numero"
                type="number"
                min="1"
                placeholder="Ex: 2"
                value={formData.numero}
                onChange={(e) =>
                  setFormData({ ...formData, numero: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            {/* Número da Mesa */}
            <div className="grid gap-2">
              <Label htmlFor="numero_mesa">
                Número da Mesa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numero_mesa"
                type="number"
                min="1"
                placeholder="Ex: 1"
                value={formData.numero_mesa}
                onChange={(e) =>
                  setFormData({ ...formData, numero_mesa: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            {/* Capacidade */}
            <div className="grid gap-2">
              <Label htmlFor="capacidade">
                Capacidade (pessoas) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="capacidade"
                type="number"
                min="1"
                placeholder="Ex: 4"
                value={formData.capacidade}
                onChange={(e) =>
                  setFormData({ ...formData, capacidade: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">
                Status Inicial <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={loading}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="livre">Livre</SelectItem>
                  <SelectItem value="ocupada">Ocupada</SelectItem>
                  <SelectItem value="reservada">Reservada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data de Reserva (condicional) */}
            {formData.status === 'reservada' && (
              <div className="grid gap-2">
                <Label htmlFor="data_reserva">
                  Data e Hora da Reserva <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="data_reserva"
                  type="datetime-local"
                  value={formData.data_reserva}
                  onChange={(e) =>
                    setFormData({ ...formData, data_reserva: e.target.value })
                  }
                  disabled={loading}
                  required={formData.status === 'reservada'}
                />
              </div>
            )}

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
                'Criar Mesa'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}