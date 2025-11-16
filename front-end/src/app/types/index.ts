// Types baseados no schema Prisma

export interface Categoria {
  id: string;
  descricao: string;
  produtos?: Produto[];
}

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento?: string;
  senha: string;
  email: string;
  admin: boolean;
  celular: string;
  mesa_id?: string;
  mesa?: Mesa;
}

export type MesaStatus = 'livre' | 'reservada' | 'ocupada';

export interface Mesa {
  id: string;
  numero: number;
  capacidade: number;
  status: string;
  numero_mesa: number;
  data_reserva?: string;
  clientes?: Cliente[];
  pedidos?: Pedido[];
}

export interface Pedido {
  id: string;
  num_pedido: number;
  data_hora: string;
  mesa_id: string;
  mesa?: Mesa;
  garcom_id?: string;
  garcom?: Garcom;
  valor: string;
  pagamento: string;
  itens?: ItemPedido[];
}

export interface ItemPedido {
  id: string;
  num_item: number;
  quantidade: number;
  produto_id: string;
  produto?: Produto;
  observacao?: string;
  pedido_id: string;
  pedido?: Pedido;
}

export type Turno = 'manha' | 'tarde' | 'noite';

export interface Garcom {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  senha: string;
  turno: string;
  ativo: boolean;
  pedidos?: Pedido[];
}

export type UnidadeMedida = 'UN' | 'KG' | 'L' | 'CX' | 'PC' | 'ML' | 'G';

export interface Produto {
  id: string;
  nome: string;
  marca: string;
  detalhes?: string;
  quantidade: number;
  unidade_medida: UnidadeMedida;
  preco_unitario: number;
  qtd_estoque: number;
  categoria_id: string;
  categoria?: Categoria;
  fornecedor_ids: string[];
  fornecedores?: Fornecedor[];
}

export interface Fornecedor {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  email: string;
  logradouro: string;
  num_casa: string; // Corrigido: era num_imovel
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  celular: string;
  produto_ids: string[];
  produtos?: Produto[];
}

export type UserRole = 'admin' | 'garcom' | 'cliente';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar?: string;
  mesa_id?: string;
}

export interface DashboardMetrics {
  total_mesas: number;
  mesas_ocupadas: number;
  pedidos_hoje: number;
  faturamento_dia: number;
  mesas_disponiveis: number;
}
