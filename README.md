# DSM-P3-G03-2025-2
Repositório do GRUPO 03 do Projeto Interdisciplinar do 3º semestre DSM 2025/2. Alunos: André Coral Rodrigues, Bruno José Rodrigues da Silva,  Guilherme de Araújo Silva.

# 📋 Sobre o Projeto

PedidoRapido é uma plataforma de gerenciamento que permite:

-   🗂️ Cadastro e gestão do estabelecimento e clientes
-   🛍️ Venda e gerenciamento de produtos
-   📊 Gerenciamento de estoque
-   🪑 Gerenciamento de mesas
-   👥 Sistema de clientes e pedidos
-   🏭 Controle de fornecedores


## 🛠️ Backend

-   **Node.js** + **Express.js** - API REST
-   **Prisma ORM** - Gerenciamento de banco de dados
-   **MongoDB** - Banco de dados NoSQL
-   **JWT** - Autenticação
-   **Bcrypt** - Hash de senhas
-   **JavaScript** Linguagem utilizada


## 🎨 Frontend

-  **Next.js 16** - Framework React
-  **React 19** - Biblioteca UI
-  **TypeScript** - Tipagem estática
-  **Tailwind CSS** - Estilização


## 📁 Estrutura do Projeto
```bash
DSM-P3-G03-2025-2/
├── backend/              # API Backend
│   ├── src/
│   │   ├── controllers/  # Controladores HTTP
│   │   ├── database/     # Configurações do banco
│   │   ├── routes/       # Rotas da API
│   │   ├── middlewares/  # Middlewares (auth)
│   │   └── lib/          # Utilitários
│   ├── prisma/
│   │   └── schema.prisma # Esquema do banco de dados
│   └── package.json
│
├── frontend/             # Frontend Next.js
│   ├── app/  # Páginas e rotas  
│   │   │ 
│   │   ├── private/ # Rotas autenticadas 
│   │   │        ├── admin/ # Rota admin
│   │   │        ├── cliente/ # Rota cliente
│   │   │        └── garcom/  # Rota garcom
│   │   │ 
│   │   └── public/  # Rotas sem autenticação 
│   │           ├── register/ # Rota para registrar
│   │           └── sign-in/  # Rota para logar
│   │ 
│   ├── components/      # Componentes React
│   ├── lib/            # API client e utilitários
│   ├── contexts/       # Contextos de autenticação e thema
│   ├── hooks/          # React hooks customizados (Atualmente não esta em uso)
│   └── package.json
│
├── docs/               # Documentação
└── vercel.json        # Configuração Vercel
    
```

## 🔧 Instalação e Configuração


- **Node.js 18+**
- **MongoDB** (local ou MongoDB Atlas)
- **npm** ou **yarn**




### 1. Clone o repositório
```bash
git clone https://github.com/FatecFranca/DSM-P3-G03-2025-2.git
cd DSM-P3-G03-2025-2    
```



### 2. Configure o Backend

```bash
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Gere o Prisma Client
npx prisma generate


# Inicie o servidor
npm run dev
Backend rodando em: http://localhost:8080
```
### 3. Configure o Frontend

```bash

cd frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cd lib 
altereURL: const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'URL';

# Inicie o servidor
npm run dev
Frontend rodando em: http://localhost:3000

```

## 📚 Documentação Completa

Backend API
Estrutura da API
A API segue o padrão MVC

Routes: Definem endpoints e aplicam middlewares
Controllers: Lidam com requisições HTTP
Models: Definidos no Prisma schema

## CLIENTE

### AUTENTICAÇÃO
````bash
POST   /clientes/register      # Registrar cliente
POST   /clientes/login         # Login de cliente
GET    /clientes/verify        # Verificar token do cliente (JWT)
````

### CRUD
````bash
POST   /clientes              # Criar cliente
GET    /clientes              # Listar clientes
GET    /clientes/:id          # Buscar cliente por ID
PUT    /clientes/:id          # Atualizar cliente
DELETE /clientes/:id          # Deletar cliente

````
## CATEGORIA

```bash
POST   /categorias            # Criar categoria
GET    /categorias            # Listar categorias
GET    /categorias/:id        # Buscar categoria por ID
PUT    /categorias/:id        # Atualizar categoria
DELETE /categorias/:id        # Deletar categoria
```

## GARCOM

 #### AUTENTICAÇÃO
```bash
POST   /garcons/login         # Login de garçom

```
 #### CRUD
```bash
POST   /garcons               # Criar garçom
GET    /garcons               # Listar garçons
GET    /garcons/:id           # Buscar garçom por ID
PUT    /garcons/:id           # Atualizar garçom
DELETE /garcons/:id           # Deletar garçom
```

## MESAS
```bash
POST   /mesas                 # Criar mesa
GET    /mesas                 # Listar mesas
GET    /mesas/:id             # Buscar mesa por ID
PUT    /mesas/:id             # Atualizar mesa
DELETE /mesas/:id             # Deletar mesa

POST   /mesas/:id/sair        # Cliente sair da mesa (JWT)
```


## PEDIDOS

 #### CRUD 
```bash
POST   /pedidos               # Criar pedido
GET    /pedidos               # Listar pedidos
GET    /pedidos/:id           # Buscar pedido por ID
PUT    /pedidos/:id           # Atualizar pedido
DELETE /pedidos/:id           # Deletar pedido
```

## ITEM PEDIDO

```bash
POST   /pedidos/:id/itens                 # Criar item
GET    /pedidos/:id/itens                 # Listar itens
GET    /pedidos/:id/itens/:itemId         # Buscar item específico
PUT    /pedidos/:id/itens/:itemId         # Atualizar item
DELETE /pedidos/:id/itens/:itemId         # Deletar item

```

## PRODUTOS

```bash
POST   /produtos               # Criar produto
GET    /produtos               # Listar produtos
GET    /produtos/:id           # Buscar produto por ID
PUT    /produtos/:id           # Atualizar produto
DELETE /produtos/:id           # Deletar produto

```

### Tipos de Usuário
- **Admin:** Pode gerenciar produtos, clientes, garcons, mesas, pedidos, categorias e perfil.
- **Cliente:** Pode entrar escolher uma mesa do sistema, fazer pedidos
e gerenciar seu perfil.
- **Garcom:** Pode gerenciar mesas e pedidos.


### Parâmetros de Include Suportados

- **Mesas**: `?include=cliente` ou `?include=clientes`
- **Pedidos**: `?include=mesa`, `?include=garcom`, `?include=itens`
- **Produtos**: `?include=categoria`, `?include=fornecedores`
- **Categorias**: `?include=produtos`
- **Fornecedores**: `?include=produtos`
- **Garçons**: `?include=pedidos`


### Relacionamentos

```bash

Clientes (N) → (1) Mesa
Mesa (1) → (N) Pedidos
Pedido (1) → (N) Item pedidos
Produto (1) → (N) Item Pedidos
Produto (N) → (N) Categorias
Fornecedores (N) → (N) Produtos
Garcom (1) → (N) Pedidos

``` 


## Visualizar Dados
Use o Prisma Studio para visualizar e editar dados:

```bash
cd backend
npx prisma studio

```
Abre em:

```bash
 http://localhost:5555
```




## 🔐 Segurança

- **✅ Hash de senhas com bcrypt**
- **✅ Autenticação baseada em JWT**
- **✅ Controle de acesso baseado em roles**
- **✅ Rotas protegidas com middleware de autenticação**
- **✅ Configuração de CORS**
- **✅ Variáveis de ambiente para secrets**


## 🐛 Troubleshooting


### Erro de conexão com MongoDB  
**Erro:** `"Can't reach database server"`  

#### Soluções:
**1. Verifique se o MongoDB está rodando.** 
**2. Confirme a variável **DATABASE_URL** no arquivo** `.env`.  
**3. Para MongoDB Atlas, verifique o *Network Access*** (liberar `0.0.0.0/0`).  
**4. Teste a connection string localmente.**  


### Prisma Client não encontrado  
**Erro:** `"Cannot find module '@prisma/client'"`

#### Solução:
```bash
cd backend
npx prisma generate
```



## 🧪 Testes
Testar API Backend

**Health Check:**
```bash
curl http://localhost:3000/
```
### Registrar Admin:

```bash
```bash
curl -X POST http://localhost:3000/auth/cliente/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "admin da silva",
    "cpf": "55566677788",
    "data_nascimento": null,
    "senha": "123456",
    "email": "admin@admin.com",
    "admin": true,
    "celular": "16555554444",
    "mesa_id": null
  }'
```
  ### Registrar Cliente:

```bash
```bash
  curl -X POST http://localhost:3000/auth/cliente/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Cliente da silva",
    "cpf": "55566677788",
    "data_nascimento": null,
    "senha": "123456",
    "email": "Cliente@teste.com",
    "admin": false,
    "celular": "16555554444",
    "mesa_id": null
  }'
```
### Testar Frontend

**Acesse:** `http://localhost:3000`  

Vá para **/register** e crie uma conta.  

- **Atualmente só é possivel criar Cliente admin:false (Cliente comum) pela pagina de registro**

Faça login em **/sign-in**.



Navegue pela aplicação.  


## 📖 Recursos Adicionais

### Ferramentas Recomendadas
**- Postman / Insomnia — Testar API**  
**- MongoDB Compass — GUI para MongoDB local**  
**- VS Code Extensions:** 
  **- Prisma**  
  **- ESLint**  


### 🔗 Links Úteis
- [Documentação do Express](https://expressjs.com/)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)


###   *[🚀 Elevator Pitch](https://www.youtube.com)* 





#### *🥈 [Prototipo Baixa Fidelidade](www.figma.com)*  (**Se for necessario**)

#### *🥇 [Prototipo Alta Fidelidade](https://pedidorapido.vercel.app)*

### *Logins funcionais (Alta fidelidade):*

```bash
Cliente: teste@teste.com senha: 123456
Admin: admin@admin.com senha: 123456
Garcom: garcom@teste.com senha: 123456
```
## 💻 Equipe

**GRUPO 03 - DSM 3º Semestre 2025/2**

- André Coral Rodrigues  
- Bruno José  
- Guilherme de Araújo Silva  

**Instituição:** FATEC Franca  
**Curso:** Desenvolvimento de Software Multiplataforma  
**Semestre:** 3º - 2025/2  
