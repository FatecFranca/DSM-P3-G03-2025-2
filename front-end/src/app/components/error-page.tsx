import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/src/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/app/components/ui/dialog';

interface ErrorPageProps {
  type?: 'access-denied' | '404' | 'error';
  message?: string;
  onGoBack?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ErrorPage({ 
  type = 'error', 
  message, 
  onGoBack,
  open = true,
  onOpenChange 
}: ErrorPageProps) {
  const config = {
    'access-denied': {
      icon: ShieldAlert,
      title: 'Acesso Negado',
      defaultMessage: 'Você não tem permissão para acessar esta página. Entre em contato com o administrador.',
    },
    '404': {
      icon: AlertTriangle,
      title: 'Página Não Encontrada',
      defaultMessage: 'A página que você está procurando não existe ou foi movida.',
    },
    'error': {
      icon: AlertTriangle,
      title: 'Erro',
      defaultMessage: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
    },
  };

  const { icon: Icon, title, defaultMessage } = config[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Icon className="h-8 w-8 text-destructive" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {message || defaultMessage}
          </DialogDescription>
        </DialogHeader>
        {onGoBack && (
          <DialogFooter className="sm:justify-center">
            <Button onClick={onGoBack} className="w-full sm:w-auto">
              Voltar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
