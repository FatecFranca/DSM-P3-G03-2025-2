import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ItemCarrinho {
  produto_id: string;
  nome: string;
  preco_unitario: number;
  quantidade: number;
  subtotal: number;
  num_item: number;
}

export interface Produto {
  id: string;
  nome: string;
  preco_unitario: number;
  qtd_estoque: number;
}

export function useCarrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  // Adicionar produto ao carrinho
  const adicionarItem = useCallback((produto: Produto, quantidade: number = 1) => {
    setItens((prev) => {
      // Verificar se produto já está no carrinho
      const itemExistente = prev.find((item) => item.produto_id === produto.id);

      if (itemExistente) {
        // Atualizar quantidade
        const novaQuantidade = itemExistente.quantidade + quantidade;

        // Validar estoque
        if (novaQuantidade > produto.qtd_estoque) {
          toast.error('Quantidade indisponível', {
            description: `Estoque disponível: ${produto.qtd_estoque}`
          });
          return prev;
        }

        toast.success('Quantidade atualizada', {
          description: `${produto.nome}: ${novaQuantidade}x`
        });

        return prev.map((item) =>
          item.produto_id === produto.id
            ? {
                ...item,
                quantidade: novaQuantidade,
                subtotal: novaQuantidade * produto.preco_unitario,
              }
            : item
        );
      } else {
        // Adicionar novo item
        const novoItem: ItemCarrinho = {
          produto_id: produto.id,
          nome: produto.nome,
          preco_unitario: produto.preco_unitario,
          quantidade,
          subtotal: quantidade * produto.preco_unitario,
          num_item: prev.length + 1,
        };

        toast.success('Produto adicionado', {
          description: `${produto.nome} x${quantidade}`
        });

        return [...prev, novoItem];
      }
    });
  }, []);

  // Remover item do carrinho
  const removerItem = useCallback((produto_id: string) => {
    setItens((prev) => {
      const item = prev.find((i) => i.produto_id === produto_id);
      
      if (item) {
        toast.info('Produto removido', {
          description: item.nome
        });
      }

      // Reindexar num_item
      return prev
        .filter((item) => item.produto_id !== produto_id)
        .map((item, index) => ({ ...item, num_item: index + 1 }));
    });
  }, []);

  // Atualizar quantidade de um item
  const atualizarQuantidade = useCallback((produto_id: string, quantidade: number, estoqueMax: number) => {
    if (quantidade <= 0) {
      removerItem(produto_id);
      return;
    }

    if (quantidade > estoqueMax) {
      toast.error('Quantidade indisponível', {
        description: `Estoque disponível: ${estoqueMax}`
      });
      return;
    }

    setItens((prev) =>
      prev.map((item) =>
        item.produto_id === produto_id
          ? {
              ...item,
              quantidade,
              subtotal: quantidade * item.preco_unitario,
            }
          : item
      )
    );
  }, [removerItem]);

  // Limpar carrinho
  const limparCarrinho = useCallback(() => {
    setItens([]);
  }, []);

  // Calcular total do carrinho
  const total = itens.reduce((sum, item) => sum + item.subtotal, 0);

  // Contar total de itens
  const totalItens = itens.reduce((sum, item) => sum + item.quantidade, 0);

  return {
    itens,
    total,
    totalItens,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
  };
}