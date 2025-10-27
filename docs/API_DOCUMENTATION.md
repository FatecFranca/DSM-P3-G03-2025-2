# API Documentation - Sistema de Restaurante

Este documento descreve as rotas disponíveis na API do sistema de restaurante, incluindo todas as operações CRUD e funcionalidades de include para relacionamentos.

## Base URL
```
http://localhost:8080
```

## Status Codes
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Atualização bem-sucedida
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Rotas Documentadas

### 📋 CLIENTES

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|---------|
| `GET` | `/clientes/:id` | Busca cliente por ID | ✅ 200 |
| `GET` | `/clientes` | Lista todos os clientes | ✅ 200 |
| `POST` | `/clientes` | Cria novo cliente | ✅ 201 |
| `PUT` | `/clientes/:id` | Atualiza cliente existente | ✅ 204 |

### 🪑 MESAS

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|---------|
| `GET` | `/mesas/:id` | Busca mesa por ID | ✅ 200 |
| `GET` | `/mesas` | Lista todas as mesas | ✅ 200 |
| `GET` | `/mesas/:id?include=cliente` | Busca mesa por ID com cliente | ✅ 200 |
| `GET` | `/mesas?include=cliente` | Lista mesas com clientes | ✅ 200 |
| `POST` | `/mesas` | Cria nova mesa | ✅ 201 |
| `PUT` | `/mesas/:id` | Atualiza mesa existente | ✅ 204 |

### 📝 PEDIDOS

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|---------|
| `GET` | `/pedidos/:id` | Busca pedido por ID | ✅ 200 |
| `GET` | `/pedidos` | Lista todos os pedidos | ✅ 200 |
| `GET` | `/pedidos?include=mesa` | Lista pedidos com mesas | ✅ 200 |
| `GET` | `/pedidos/:id?include=mesa` | Busca pedido por ID com mesa | ✅ 200 |
| `POST` | `/pedidos` | Cria novo pedido | ✅ 201 |
| `PUT` | `/pedidos/:id` | Atualiza pedido existente | ✅ 204 |

### 🍕 PRODUTOS

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|---------|
| `GET` | `/produtos/:id` | Busca produto por ID | ✅ 200 |
| `GET` | `/produtos` | Lista todos os produtos | ✅ 200 |
| `GET` | `/produtos?include=categoria` | Lista produtos com categorias | ✅ 200 |
| `GET` | `/produtos/:id?include=categoria` | Busca produto por ID com categoria | ✅ 200 |
| `GET` | `/produtos?include=categoria,fornecedores` | Lista produtos com categoria e fornecedores | ✅ 200 |
| `POST` | `/produtos` | Cria novo produto | ✅ 201 |
| `PUT` | `/produtos/:id` | Atualiza produto existente | ✅ 204 |

### 📂 CATEGORIAS

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|---------|
| `GET` | `/categorias/:id` | Busca categoria por ID | ✅ 200 |
| `GET` | `/categorias` | Lista todas as categorias | ✅ 200 |
| `GET` | `/categorias?include=produtos` | Lista categorias com produtos | ✅ 200 |
| `GET` | `/categorias/:id?include=produtos` | Busca categoria por ID com produtos | ✅ 200 |
| `POST` | `/categorias` | Cria nova categoria | ✅ 201 |
| `PUT` | `/categorias/:id` | Atualiza categoria existente | ✅ 204 |

### 🏪 FORNECEDORES

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|---------|
| `GET` | `/fornecedores/:id` | Busca fornecedor por ID | ✅ 200 |
| `GET` | `/fornecedores` | Lista todos os fornecedores | ✅ 200 |
| `GET` | `/fornecedores?include=produtos` | Lista fornecedores com produtos | ✅ 200 |
| `GET` | `/fornecedores/:id?include=produtos` | Busca fornecedor por ID com produtos | ✅ 200 |
| `POST` | `/fornecedores` | Cria novo fornecedor | ✅ 201 |
| `PUT` | `/fornecedores/:id` | Atualiza fornecedor existente | ✅ 204 |

### 👨‍🍳 GARÇONS

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|---------|
| `GET` | `/garcons/:id` | Busca garçom por ID | ✅ 200 |
| `GET` | `/garcons` | Lista todos os garçons | ✅ 200 |
| `GET` | `/garcons?include=pedidos` | Lista garçons com pedidos | ✅ 200 |
| `GET` | `/garcons/:id?include=pedidos` | Busca garçom por ID com pedidos | ✅ 200 |
| `POST` | `/garcons` | Cria novo garçom | ✅ 201 |
| `PUT` | `/garcons/:id` | Atualiza garçom existente | ✅ 204 |

## Funcionalidades de Include

### Parâmetros de Include Suportados

- **Mesas**: `?include=cliente` ou `?include=clientes`
- **Pedidos**: `?include=mesa`, `?include=garcom`, `?include=itens`
- **Produtos**: `?include=categoria`, `?include=fornecedores`
- **Categorias**: `?include=produtos`
- **Fornecedores**: `?include=produtos`
- **Garçons**: `?include=pedidos`