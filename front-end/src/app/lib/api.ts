/**
 * Cliente HTTP para integração com backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
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

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return text as unknown as T;
    }

    const data = await response.json();

    if (!response.ok) {
      // Se for 401 (não autorizado), limpar token e redirecionar
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Apenas redirecionar se não estiver em rota pública
        if (!window.location.pathname.startsWith('/sign-in') && 
            !window.location.pathname.startsWith('/register')) {
          window.location.href = '/sign-in';
        }
      }
      throw new Error(data.message || data.error || `HTTP ${response.status}`);
    }

    return data;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildURL(endpoint, params);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...this.getHeaders(),
          ...fetchOptions.headers,
        },
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'}] ${endpoint}:`, error);
      throw error;
    }
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

// Endpoints de autenticação
export const authAPI = {
  loginCliente: async (email: string, senha: string) => {
    const response = await api.post<{ token: string; user: any }>('/clientes/login', { email, senha });
    // Salvar token no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  loginGarcom: async (email: string, senha: string) => {
    const response = await api.post<{ token: string; user: any }>('/garcons/login', { email, senha });
    // Salvar token no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  register: async (data: { nome: string; email: string; senha: string; cpf?: string; celular?: string }) => {
    const response = await api.post<{ token: string; user: any }>('/clientes/register', data);
    // Salvar token no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  verifyToken: () => api.get('/clientes/verify'),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

// Endpoints específicos


export const mesasAPI = {
  list: (params?: { include?: string }) => api.get('/mesas', params),
  get: (id: string, params?: { include?: string }) => api.get(`/mesas/${id}`, params),
  create: (data: unknown) => api.post('/mesas', data),
  update: (id: string, data: unknown) => api.put(`/mesas/${id}`, data),
  delete: (id: string) => api.delete(`/mesas/${id}`),
  sairDaMesa: (id: string) => api.post(`/mesas/${id}/sair`, {}), // Nova rota com autenticação
};



export const pedidosAPI = {
  list: (params?: { include?: string }) => api.get('/pedidos', params),
  get: (id: string, params?: { include?: string }) => api.get(`/pedidos/${id}`, params),
  create: (data: unknown) => api.post('/pedidos', data),
  update: (id: string, data: unknown) => api.put(`/pedidos/${id}`, data),
  delete: (id: string) => api.delete(`/pedidos/${id}`),

  // Rotas de itens de pedido
  createItem: (pedidoId: string, data: unknown) => api.post(`/pedidos/${pedidoId}/itens`, data),
  listItems: (pedidoId: string, params?: { include?: string }) => api.get(`/pedidos/${pedidoId}/itens`, params),
  getItem: (pedidoId: string, itemId: string) => api.get(`/pedidos/${pedidoId}/itens/${itemId}`),
  updateItem: (pedidoId: string, itemId: string, data: unknown) => api.put(`/pedidos/${pedidoId}/itens/${itemId}`, data),
  deleteItem: (pedidoId: string, itemId: string) => api.delete(`/pedidos/${pedidoId}/itens/${itemId}`),
};


export const produtosAPI = {
  list: (params?: { include?: string }) => api.get('/produtos', params),
  get: (id: string, params?: { include?: string }) => api.get(`/produtos/${id}`, params),
  create: (data: unknown) => api.post('/produtos', data),
  update: (id: string, data: unknown) => api.put(`/produtos/${id}`, data),
  delete: (id: string) => api.delete(`/produtos/${id}`),
};

export const categoriasAPI = {
  list: (params?: { include?: string }) => api.get('/categorias', params),
  get: (id: string, params?: { include?: string }) => api.get(`/categorias/${id}`, params),
  create: (data: unknown) => api.post('/categorias', data),
  update: (id: string, data: unknown) => api.put(`/categorias/${id}`, data),
  delete: (id: string) => api.delete(`/categorias/${id}`),
};

export const clientesAPI = {
  list: (params?: { include?: string }) => api.get('/clientes', params),
  get: (id: string, params?: { include?: string }) => api.get(`/clientes/${id}`, params),
  create: (data: unknown) => api.post('/clientes', data),
  update: (id: string, data: unknown) => api.put(`/clientes/${id}`, data),
  delete: (id: string) => api.delete(`/clientes/${id}`),
};

export const garconsAPI = {
  list: (params?: { include?: string }) => api.get('/garcons', params),
  get: (id: string, params?: { include?: string }) => api.get(`/garcons/${id}`, params),
  create: (data: unknown) => api.post('/garcons', data),
  update: (id: string, data: unknown) => api.put(`/garcons/${id}`, data),
  delete: (id: string) => api.delete(`/garcons/${id}`),
};

export const fornecedoresAPI = {
  list: (params?: { include?: string }) => api.get('/fornecedores', params),
  get: (id: string, params?: { include?: string }) => api.get(`/fornecedores/${id}`, params),
  create: (data: unknown) => api.post('/fornecedores', data),
  update: (id: string, data: unknown) => api.put(`/fornecedores/${id}`, data),
  delete: (id: string) => api.delete(`/fornecedores/${id}`),
};

export const withRelations = (...relations: string[]) => ({
  include: relations.join(',')
});

// API destinda aos relatorios PDF
export const relatoriosAPI = {}

export default api;
