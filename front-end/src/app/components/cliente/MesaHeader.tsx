import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Bell, Users, Clock } from 'lucide-react';

interface MesaHeaderProps {
  mesaNumero: number;
  capacidade?: number;
  tempoNaMesa?: string;
  onChamarGarcom?: () => void;
}

export function MesaHeader({ 
  mesaNumero, 
  capacidade = 4, 
  tempoNaMesa,
  onChamarGarcom 
}: MesaHeaderProps) {
  return (
    <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Mesa {mesaNumero}</h2>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                Ativa
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Até {capacidade} pessoas</span>
              </div>
              {tempoNaMesa && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{tempoNaMesa}</span>
                </div>
              )}
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={onChamarGarcom}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Bell className="w-4 h-4 mr-2" />
            Chamar Garçom
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
