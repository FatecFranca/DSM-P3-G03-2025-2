# Memorial Descritivo — Projeto Interdisciplinar

## Tema

**Sistema de Gerenciamento de Mesas para Bares e Restaurantes** — Aplicativo cliente integrado a um painel administrativo, com o objetivo de substituir o uso de fichas físicas e otimizar o processo de atendimento.

## Justificativa

O setor de bares e restaurantes enfrenta desafios relacionados ao controle manual de pedidos, uso de comandas físicas e falhas no gerenciamento de mesas e atendimentos. Esses métodos tradicionais acarretam lentidão, erros e perda de informações, impactando a eficiência e a experiência do cliente.

A proposta de digitalização do processo por meio de um sistema integrado traz benefícios como agilidade no atendimento, redução de falhas, maior controle sobre o fluxo de pedidos e automatização do fechamento das contas. O sistema centraliza informações em tempo real e permite integração com métodos de pagamento eletrônicos, otimizando a operação e aumentando a satisfação dos clientes.

## Objetivos

- ✅ Automatizar o controle de mesas e pedidos, substituindo fichas físicas por um sistema digital integrado.
- ✅ Associar mesas a usuários (clientes e administradores), garantindo controle temporal, lógico e hierárquico da ocupação.
- ✅ Gerenciar pedidos e itens vinculados às mesas de forma automatizada.
- ✅ Disponibilizar relatórios de desempenho e histórico de consumo.
- ✅ Integrar a atuação dos garçons no processo de atendimento, mantendo rastreabilidade.
- ✅ Permitir o cadastro e vinculação de produtos, categorias e fornecedores, com controle hierárquico e organizacional.
- ✅ Implementar sistema de permissões diferenciadas para usuários (clientes e administradores).

## Modelagem de Relacionamentos

### Cliente – Mesa (Agregação)

**Justificativa:** A relação entre Cliente e Mesa caracteriza-se como agregação, onde múltiplos clientes podem compartilhar uma mesa durante uma sessão (como em grupos familiares ou de amigos). Cada cliente está vinculado a uma única mesa por sessão, mas uma mesa pode acomodar vários clientes simultaneamente. A mesa existe independentemente dos clientes e pode estar vazia (disponível) ou ocupada por um ou mais clientes. Quando os clientes encerram sua sessão, a mesa é liberada mas continua existindo no sistema para futuras ocupações.

**Cardinalidade:** Cliente → 1 Mesa | Mesa → 0..* Clientes


**Níveis de Acesso:**
- **Cliente (Usuário Comum):** Acesso limitado a uma única mesa durante sua sessão
- **Gerente (Administrador):** Acesso simultâneo a múltiplas mesas para gerenciamento

### Mesa – Pedido (Composição)

**Justificativa:** A entidade Pedido está diretamente ligada à Mesa, pois só é possível registrar um pedido a partir de uma mesa ativa. A mesa é responsável por agrupar os pedidos de uma sessão. Quando a mesa é encerrada, todos os pedidos relacionados são finalizados com ela.

**Cardinalidade:** Mesa → 0..* Pedidos | Pedido → 1 Mesa

### Pedido – ItemPedido (Composição)

**Justificativa:** A relação entre Pedido e ItemPedido também é de composição, visto que os itens existem apenas como parte de um pedido. Os itens detalham os produtos incluídos no pedido, mas não fazem sentido isoladamente. Se um pedido for removido, todos os itens ligados a ele também são removidos.

**Cardinalidade:** Pedido → 1..* Itens de Pedido | ItemPedido → 1 Pedido

### Pedido – Garçom (Associação)

**Justificativa:** Este é um exemplo de associação, pois o garçom e o pedido são entidades independentes. Um garçom pode atender diversos pedidos, e um pedido deve ser atendido por apenas um garçom durante seu atendimento. Não há dependência de existência entre eles.

**Cardinalidade:** Pedido → 1 Garçom | Garçom → 0..* Pedido

### ItemPedido – Produto (Composição)

**Justificativa:** A ligação entre ItemPedido e Produto é tratada como composição devido ao vínculo direto do item com um produto específico. Mesmo que o produto exista de forma independente no catálogo, cada item de pedido depende de um produto para existir.

**Cardinalidade:** ItemPedido → 1 Produto | Produto → 0..* Itens de Pedido

### Produto – Categoria (Agregação)

**Justificativa:** A relação entre Produto e Categoria é de agregação, pois embora uma categoria agrupe produtos semelhantes, ambos podem existir separadamente. Um produto pode estar associado a uma ou mais categorias, e as categorias podem existir sem produtos temporariamente.

**Cardinalidade:** Produto → 0..* Categorias | Categoria → 0..* Produtos

### Produto – Fornecedor (Associação)

**Justificativa:** O produto pode ser fornecido por diferentes fornecedores, e os fornecedores podem fornecer diferentes produtos. Apesar de existirem vínculos entre eles, nenhum depende do outro para existir. Por isso, a relação correta é de associação.

**Cardinalidade:** Produto → 0..* Fornecedores | Fornecedor → 0..* Produtos

## Hierarquia de Usuários

O sistema implementa diferentes níveis de acesso para garantir segurança e funcionalidade adequada:

### Tipos de Usuário

| Tipo | Permissões | Acesso a Mesas |
|------|-----------|----------------|
| **Cliente** | Visualizar cardápio, fazer pedidos, visualizar conta | 1 mesa (sua mesa atual) |
| **Garçom** | Gerenciar pedidos, atualizar status, visualizar múltiplas mesas | N mesas (todas sob sua responsabilidade) |
| **Gerente** | Todas as permissões + relatórios, configurações | N mesas (todas do estabelecimento) |
| **Administrador** | Controle total do sistema | N mesas (acesso irrestrito) |

### Fluxo de Acesso

```
1. Cliente → Login/QR Code → Vinculado a 1 Mesa → Faz Pedidos → Encerra Sessão
2. Garçom → Login → Acesso a Múltiplas Mesas → Gerencia Pedidos → Atualiza Status
3. Gerente → Login → Visão Geral → Relatórios → Controle Operacional
```

## Conclusão

A modelagem apresentada estabelece uma estrutura sólida de relacionamentos que reflete a lógica operacional do sistema. Foram adotadas corretamente as classificações conforme definição:

| Tipo de Relação | Característica Principal |
|---|---|
| **Associação** | Entidades independentes com relação eventual |
| **Agregação** | Relação "todo-parte" com fraca dependência |
| **Composição** | Relação de dependência total (um objeto não existe sem o outro) |

**Destaque para a modelagem Usuário-Mesa:** A alteração de Cliente-Mesa para Usuário-Mesa permite maior flexibilidade no sistema, possibilitando diferentes níveis de acesso e permissões. Isso garante que clientes tenham acesso limitado a sua mesa, enquanto administradores (garçons, gerentes) possam gerenciar múltiplas mesas simultaneamente, mantendo a segurança e organização do sistema.

A modelagem NoAM descrita é adequada para sistemas de atendimento em bares e restaurantes, permitindo implementação eficiente em bancos NoSQL como MongoDB ou Firebase, bem como em bancos relacionais com ORMs modernos como Prisma.

O sistema proposto visa modernizar e otimizar o atendimento em bares e restaurantes, substituindo processos manuais por uma solução digital integrada. A implementação do aplicativo cliente, associada ao painel administrativo, permite o gerenciamento eficiente de pedidos, mesas, pagamentos e relatórios de desempenho. Com isso, o projeto busca promover maior agilidade, precisão e controle operacional, beneficiando tanto o estabelecimento quanto a experiência do cliente.

---

## Arquivos Relacionados

- 📄 [Diagrama NoAM](./NoAM.drawio) - Modelagem visual dos relacionamentos
- 🗃️ [Schema Prisma](../back-end/prisma/schema.prisma) - Implementação do banco de dados
- 📋 [Memorial Descritivo PDF](./Memorial_Descritivo_Projeto_Interdisciplinar.pdf) - Documento original
- 👥 [Sistema de Usuários](../back-end/src/modules/users/) - Implementação de autenticação e permissões