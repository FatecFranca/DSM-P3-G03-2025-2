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
  email: string;
  logradouro: string;
  num_imovel: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  celular: string;
  mesa_id?: string;
  mesa?: Mesa;
}

export type MesaStatus = 'Disponível' | 'Reservada' | 'Ocupada' | 'Em atendimento' | 'Fechada';

export interface Mesa {
  id: string;
  numero: number;
  capacidade: number;
  status: MesaStatus;
  data_reserva?: string;
  clientes?: Cliente[];
  pedidos?: Pedido[];
}

export type PedidoStatus = 'Pendente' | 'Em andamento' | 'Concluído' | 'Cancelado';

export interface Pedido {
  id: string;
  num_pedido: string;
  data_hora: string;
  mesa_id: string;
  mesa?: Mesa;
  garcom_id?: string;
  garcom?: Garcom;
  itens?: ItemPedido[];
  total?: number;
  status?: PedidoStatus;
}

export interface ItemPedido {
  id: string;
  num_item: number;
  quantidade: number;
  produto_id: string;
  produto?: Produto;
  pedido_id: string;
  pedido?: Pedido;
  subtotal?: number;
}

export type Turno = 'Manhã' | 'Tarde' | 'Noite';

export interface Garcom {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  turno: Turno;
  ativo: boolean;
  pedidos?: Pedido[];
}

export type UnidadeMedida = 'UN' | 'KG' | 'L' | 'CX' | 'PC';

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
  num_imovel: string;
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
}

export interface DashboardMetrics {
  total_mesas: number;
  mesas_ocupadas: number;
  pedidos_hoje: number;
  faturamento_dia: number;
  mesas_disponiveis: number;
}
