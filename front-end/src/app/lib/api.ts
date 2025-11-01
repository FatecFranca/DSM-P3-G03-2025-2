/**
 * Cliente HTTP para integração com backend
 * 
 * Para usar:
 * 1. Configure API_BASE_URL no .env
 * 2. Substitua as chamadas mock por api.get(), api.post(), etc.
 * 3. O token JWT será incluído automaticamente nos headers
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Adicionar token JWT se existir
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildURL(endpoint, params);

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(),
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);

// Endpoints específicos - Exemplos de uso

export const mesasAPI = {
  list: () => api.get('/mesas'),
  get: (id: string) => api.get(`/mesas/${id}`),
  create: (data: unknown) => api.post('/mesas', data),
  update: (id: string, data: unknown) => api.put(`/mesas/${id}`, data),
  delete: (id: string) => api.delete(`/mesas/${id}`),
};

export const pedidosAPI = {
  list: (params?: { mesa_id?: string; data_inicio?: string; data_fim?: string }) => 
    api.get('/pedidos', params),
  get: (id: string) => api.get(`/pedidos/${id}`),
  create: (data: unknown) => api.post('/pedidos', data),
  update: (id: string, data: unknown) => api.put(`/pedidos/${id}`, data),
  delete: (id: string) => api.delete(`/pedidos/${id}`),
};

export const produtosAPI = {
  list: (params?: { categoria_id?: string; search?: string }) => 
    api.get('/produtos', params),
  get: (id: string) => api.get(`/produtos/${id}`),
  create: (data: unknown) => api.post('/produtos', data),
  update: (id: string, data: unknown) => api.put(`/produtos/${id}`, data),
  delete: (id: string) => api.delete(`/produtos/${id}`),
};

export const categoriasAPI = {
  list: () => api.get('/categorias'),
  get: (id: string) => api.get(`/categorias/${id}`),
  create: (data: unknown) => api.post('/categorias', data),
  update: (id: string, data: unknown) => api.put(`/categorias/${id}`, data),
  delete: (id: string) => api.delete(`/categorias/${id}`),
};

export const clientesAPI = {
  list: (params?: { search?: string }) => api.get('/clientes', params),
  get: (id: string) => api.get(`/clientes/${id}`),
  create: (data: unknown) => api.post('/clientes', data),
  update: (id: string, data: unknown) => api.put(`/clientes/${id}`, data),
  delete: (id: string) => api.delete(`/clientes/${id}`),
};

export const garconsAPI = {
  list: (params?: { turno?: string; ativo?: boolean }) => api.get('/garcons', params),
  get: (id: string) => api.get(`/garcons/${id}`),
  create: (data: unknown) => api.post('/garcons', data),
  update: (id: string, data: unknown) => api.put(`/garcons/${id}`, data),
  delete: (id: string) => api.delete(`/garcons/${id}`),
};

export const fornecedoresAPI = {
  list: (params?: { search?: string }) => api.get('/fornecedores', params),
  get: (id: string) => api.get(`/fornecedores/${id}`),
  create: (data: unknown) => api.post('/fornecedores', data),
  update: (id: string, data: unknown) => api.put(`/fornecedores/${id}`, data),
  delete: (id: string) => api.delete(`/fornecedores/${id}`),
};

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  register: (data: unknown) => api.post('/auth/register', data),
};

export const relatoriosAPI = {
  dashboard: () => api.get('/relatorios/dashboard'),
  vendas: (params: { data_inicio: string; data_fim: string }) => 
    api.get('/relatorios/vendas', params),
  produtos: (params: { data_inicio: string; data_fim: string }) => 
    api.get('/relatorios/produtos', params),
  mesas: (params: { data_inicio: string; data_fim: string }) => 
    api.get('/relatorios/mesas', params),
};
