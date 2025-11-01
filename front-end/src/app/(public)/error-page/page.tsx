import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/src/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/app/components/ui/card';

interface ErrorPageProps {
  type?: 'access-denied' | '404' | 'error';
  message?: string;
  onGoBack?: () => void;
}

export function ErrorPage({ type = 'error', message, onGoBack }: ErrorPageProps) {
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Icon className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {message || defaultMessage}
          </p>
          {onGoBack && (
            <Button onClick={onGoBack} className="w-full">
              Voltar
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
