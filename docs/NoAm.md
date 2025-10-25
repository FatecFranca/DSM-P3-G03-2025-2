# Modelagem NoAM - Sistema de Gerenciamento de Mesas

## Diagrama de Entidade-Relacionamento

![Diagrama NoAM](./NoAM.svg)

## Estrutura das Entidades

### Cliente
- **id**: ObjectId
- **nome**: String
- **cpf**: String
- **data_nascimento**: DateTime?
- **email**: String?
- **logradouro**: String
- **num_imovel**: String
- **complemento**: String?
- **bairro**: String
- **uf**: String
- **cep**: String
- **celular**: String

### Mesa
- **id**: ObjectId
- **numero**: Integer
- **status**: String
- **capacidade**: Integer
- **cliente_id**: ObjectId
- **data_reserva**: DateTime?

### Pedido
- **id**: ObjectId
- **num_pedido**: Integer
- **data_hora**: DateTime
- **mesa_id**: ObjectId

### ItemPedido
- **id**: ObjectId
- **num_item**: Integer
- **quantidade**: Double
- **produto_id**: ObjectId
- **pedido_id**: ObjectId

### Produto
- **id**: ObjectId
- **nome**: String
- **marca**: String
- **detalhes**: String?
- **quant_unidade**: Double
- **unidade_medida**: String
- **preco_unitario**: Double
- **qtd_estoque**: Double
- **categoria_ids**: [ObjectId]
- **fornecedor_ids**: [ObjectId]

### Garçom
- **id**: ObjectId
- **nome**: String
- **cpf**: String
- **email**: String
- **turno**: String
- **ativo**: Boolean
- **celular**: String

### Fornecedor
- **id**: ObjectId
- **razao_social**: String
- **nome_fantasia**: String?
- **cnpj**: String
- **email**: String
- **logradouro**: String
- **num_imovel**: String
- **complemento**: String?
- **bairro**: String
- **municipio**: String
- **uf**: String
- **cep**: String
- **celular**: String

### Categoria
- **id**: ObjectId
- **descricao**: String

## Relacionamentos

### Cliente → Mesa (1:N)
- Um cliente pode estar associado a múltiplas mesas
- Uma mesa pertence a um único cliente durante sua ocupação

### Mesa → Pedido (1:N)
- Uma mesa pode ter múltiplos pedidos
- Um pedido está vinculado a uma única mesa

### Pedido → ItemPedido (1:N)
- Um pedido pode conter múltiplos itens
- Um item de pedido pertence a um único pedido

### ItemPedido → Produto (N:1)
- Múltiplos itens de pedido podem referenciar o mesmo produto
- Um item de pedido referencia um único produto

### Pedido → Garçom (N:N)
- Um pedido pode ser atendido por múltiplos garçons
- Um garçom pode atender múltiplos pedidos

### Produto → Categoria (N:N)
- Um produto pode pertencer a múltiplas categorias
- Uma categoria pode conter múltiplos produtos

### Produto → Fornecedor (N:N)
- Um produto pode ser fornecido por múltiplos fornecedores
- Um fornecedor pode fornecer múltiplos produtos

## Cardinalidades

| Relacionamento | Cardinalidade |
|---|---|
| Cliente → Mesa | 1:N |
| Mesa → Pedido | 1:N |
| Pedido → ItemPedido | 1:N |
| ItemPedido → Produto | N:1 |
| Pedido → Garçom | N:N |
| Produto → Categoria | N:N |
| Produto → Fornecedor | N:N |

---

**Última atualização**: 25 de outubro de 2025