import { Button } from '../ui/button';
import { LucideIcon } from 'lucide-react';

interface CategoriaChipProps {
  label: string;
  icon?: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export function CategoriaChip({ label, icon: Icon, isActive, onClick }: CategoriaChipProps) {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className="flex-shrink-0 gap-2"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </Button>
  );
}
