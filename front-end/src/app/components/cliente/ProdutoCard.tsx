import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus, Minus } from 'lucide-react';
import { Produto } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProdutoCardProps {
  produto: Produto;
  onAddToCart: (produto: Produto, quantidade: number) => void;
}

export function ProdutoCard({ produto, onAddToCart }: ProdutoCardProps) {
  const [quantidade, setQuantidade] = useState(0);

  const handleIncrement = () => {
    const novaQuantidade = quantidade + 1;
    setQuantidade(novaQuantidade);
    onAddToCart(produto, 1);
  };

  const handleDecrement = () => {
    if (quantidade > 0) {
      const novaQuantidade = quantidade - 1;
      setQuantidade(novaQuantidade);
      onAddToCart(produto, -1);
    }
  };

  // Imagens diferentes por categoria
  const getImageByCategoria = (categoriaId: string) => {
    const images: Record<string, string> = {
      '1': 'photo-1541014741259-de529411b96a', // Entradas
      '2': 'photo-1546069901-ba9599a7e63c', // Pratos principais
      '3': 'photo-1437418747212-8d9709afab22', // Bebidas
      '4': 'photo-1551024506-0bccd828d307', // Sobremesas
    };
    return images[categoriaId] || images['2'];
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-muted">
        <ImageWithFallback
          src={`https://images.unsplash.com/${getImageByCategoria(produto.categoria_id)}?w=400&h=300&fit=crop`}
          alt={produto.nome}
          className="w-full h-full object-cover"
        />
        {produto.qtd_estoque < 5 && produto.qtd_estoque > 0 && (
          <Badge className="absolute top-2 right-2 bg-orange-500">
            Últimas unidades
          </Badge>
        )}
        {produto.qtd_estoque === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg">
              Indisponível
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-1">{produto.nome}</h3>
          {produto.detalhes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {produto.detalhes}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl text-primary">
            R$ {produto.preco_unitario.toFixed(2)}
          </span>
          
          {produto.qtd_estoque > 0 && (
            <div className="flex items-center gap-2">
              {quantidade === 0 ? (
                <Button
                  size="sm"
                  onClick={handleIncrement}
                  className="rounded-full"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              ) : (
                <div className="flex items-center gap-2 bg-primary rounded-full px-2 py-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDecrement}
                    className="h-7 w-7 rounded-full text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-6 text-center text-primary-foreground">{quantidade}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleIncrement}
                    className="h-7 w-7 rounded-full text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
