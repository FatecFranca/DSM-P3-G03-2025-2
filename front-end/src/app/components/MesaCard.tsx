import { Mesa } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { StatusBadge } from './StatusBadge';
import { Users, Calendar } from 'lucide-react';
import { Button } from './ui/button';

interface MesaCardProps {
  mesa: Mesa;
  onView: (mesa: Mesa) => void;
}

export function MesaCard({ mesa, onView }: MesaCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => onView(mesa)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3>Mesa {mesa.numero}</h3>
            <p className="text-muted-foreground">Capacidade: {mesa.capacidade} pessoas</p>
          </div>
          <StatusBadge status={mesa.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {mesa.clientes && mesa.clientes.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{mesa.clientes.length} cliente(s)</span>
            </div>
          )}
          {mesa.data_reserva && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(mesa.data_reserva).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          <Button variant="outline" className="w-full mt-2" onClick={() => onView(mesa)}>
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
