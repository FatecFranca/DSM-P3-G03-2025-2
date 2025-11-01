import { Badge } from './ui/badge';
import { MesaStatus } from '../types';
import { cn } from './ui/utils';

interface StatusBadgeProps {
  status: MesaStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<MesaStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
    'Disponível': { variant: 'outline', className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800' },
    'Reservada': { variant: 'outline', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800' },
    'Ocupada': { variant: 'outline', className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800' },
    'Em atendimento': { variant: 'outline', className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800' },
    'Fechada': { variant: 'outline', className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {status}
    </Badge>
  );
}
