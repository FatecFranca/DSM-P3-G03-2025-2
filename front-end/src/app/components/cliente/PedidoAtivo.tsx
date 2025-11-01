import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/app/components/ui/card';
import { Badge } from '@/src/app/components/ui/badge';
import { Separator } from '@/src/app/components/ui/separator';
import { Clock, ChefHat, CheckCircle2, Package, AlertCircle } from 'lucide-react';
import { Pedido, PedidoStatus } from '@/src/app/types/index';

interface PedidoAtivoProps {
  pedido: Pedido;
}

const statusConfig: Record<PedidoStatus, {
  label: string;
  icon: typeof ChefHat;
  color: string;
  message?: string;
}> = {
  'Pendente': {
    label: 'Pendente',
    icon: AlertCircle,
    color: 'bg-yellow-500',
    message: 'Seu pedido foi recebido e será preparado em breve.',
  },
  'Em andamento': {
    label: 'Preparando',
    icon: ChefHat,
    color: 'bg-orange-500',
    message: 'Seu pedido está sendo preparado com carinho!',
  },
  'Concluído': {
    label: 'Pronto',
    icon: CheckCircle2,
    color: 'bg-green-500',
    message: 'Seu pedido está pronto! Um garçom irá levá-lo até sua mesa.',
  },
  'Cancelado': {
    label: 'Cancelado',
    icon: AlertCircle,
    color: 'bg-red-500',
    message: 'Este pedido foi cancelado.',
  },
};

export function PedidoAtivo({ pedido }: PedidoAtivoProps) {
  const status = pedido.status || 'Pendente';
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Pedido #{pedido.num_pedido}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {new Date(pedido.data_hora).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </CardDescription>
          </div>
          <Badge className={config.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {pedido.itens?.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.quantidade}x</span>
                  <span>{item.produto?.nome}</span>
                </div>
                {item.produto?.detalhes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.produto.detalhes}
                  </p>
                )}
              </div>
              <span className="text-sm font-medium">
                R$ {item.subtotal?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className="text-lg font-bold text-primary">
            R$ {pedido.total?.toFixed(2)}
          </span>
        </div>

        {config.message && (
          <div className={`rounded-lg p-3 text-sm text-center ${
            status === 'Concluído' 
              ? 'bg-green-500/10 border border-green-500/20' 
              : status === 'Cancelado'
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-muted'
          }`}>
            <p className={
              status === 'Concluído' 
                ? 'text-green-700 dark:text-green-400'
                : status === 'Cancelado'
                ? 'text-red-700 dark:text-red-400'
                : 'text-muted-foreground'
            }>
              {config.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
