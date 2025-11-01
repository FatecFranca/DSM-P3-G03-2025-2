import { Badge } from '../ui/badge';
import { ChefHat, CheckCircle2, Package, Clock } from 'lucide-react';

type StatusPedido = 'aguardando' | 'preparando' | 'pronto' | 'entregue';

interface StatusPedidoBadgeProps {
  status: StatusPedido;
}

const statusConfig = {
  aguardando: {
    label: 'Aguardando',
    icon: Clock,
    className: 'bg-yellow-500 hover:bg-yellow-600',
  },
  preparando: {
    label: 'Preparando',
    icon: ChefHat,
    className: 'bg-orange-500 hover:bg-orange-600',
  },
  pronto: {
    label: 'Pronto',
    icon: CheckCircle2,
    className: 'bg-green-500 hover:bg-green-600',
  },
  entregue: {
    label: 'Entregue',
    icon: Package,
    className: 'bg-blue-500 hover:bg-blue-600',
  },
};

export function StatusPedidoBadge({ status }: StatusPedidoBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
