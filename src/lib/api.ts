
// API client para comunicação com o backend

// Ler a URL base da API de uma variável de ambiente ou usar um padrão
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api');

// --- Funções Auxiliares ---

const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.msg || JSON.stringify(errorData);
    } catch (e) {
      // Ignore
    }
    console.error("API Error:", errorMessage, "URL:", url, "Options:", options);
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();
  return data.data || data;
};

// --- Interfaces de Tipagem Atualizadas ---

// Interface para criar/atualizar Esfiha (sem ID obrigatório)
export interface EsfihaInput {
  nome: string;
  descricao?: string;
  preco: number;
  categoria?: string;
  disponivel: boolean;
  imagem_url?: string;
}

// Interface para Esfiha retornada pela API (com ID obrigatório)
export interface Esfiha extends EsfihaInput {
  id: number;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface ItemPedidoInput {
  esfiha_id: number;
  quantidade: number;
  observacoes?: string;
}

export interface ItemPedido extends ItemPedidoInput {
  id?: number;
  pedido_id?: number;
  preco_unitario?: number;
  esfiha?: string; // Nome da esfiha
  subtotal?: number;
}

export interface PedidoInput {
  nome_cliente: string;
  telefone: string;
  endereco?: string;
  forma_entrega: "retirada" | "entrega";
  observacoes?: string;
  itens: ItemPedidoInput[];
}

export interface Pedido extends PedidoInput {
  id?: number;
  cliente_id?: number;
  status?: string;
  valor_total?: number;
  data_criacao?: string;
  data_atualizacao?: string;
  stripe_payment_intent_id?: string;
  itens: ItemPedido[]; // Itens detalhados
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  pedido_id: number;
  valor_total: number;
}

// --- API de Autenticação ---

export const authAPI = {
  register: async (userData: any): Promise<User> => {
    return apiFetch<User>(`${API_BASE_URL}/users/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: any): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>(`${API_BASE_URL}/users/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return apiFetch<User>(`${API_BASE_URL}/users/me`);
  },
};

// --- API de Esfihas Atualizada ---

export const esfihaAPI = {
  listar: async (filtros?: { categoria?: string }): Promise<Esfiha[]> => {
    const params = new URLSearchParams();
    if (filtros?.categoria) {
      params.append('categoria', filtros.categoria);
    }
    const queryString = params.toString();
    return apiFetch<Esfiha[]>(`${API_BASE_URL}/esfihas${queryString ? '?' + queryString : ''}`);
  },

  obter: async (id: number): Promise<Esfiha> => {
    return apiFetch<Esfiha>(`${API_BASE_URL}/esfihas/${id}`);
  },

  // Usar EsfihaInput para criar
  criar: async (esfihaData: EsfihaInput): Promise<Esfiha> => {
    return apiFetch<Esfiha>(`${API_BASE_URL}/esfihas/admin`, {
      method: 'POST',
      body: JSON.stringify(esfihaData),
    });
  },

  // Usar Partial<EsfihaInput> para atualizar (ou EsfihaInput se todos os campos forem necessários)
  atualizar: async (id: number, esfihaData: Partial<EsfihaInput>): Promise<Esfiha> => {
    return apiFetch<Esfiha>(`${API_BASE_URL}/esfihas/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(esfihaData),
    });
  },

  excluir: async (id: number): Promise<void> => {
    return apiFetch<void>(`${API_BASE_URL}/esfihas/admin/${id}`, {
      method: 'DELETE',
    });
  },

  listarCategorias: async (): Promise<string[]> => {
    return apiFetch<string[]>(`${API_BASE_URL}/esfihas/categorias`);
  },
};

// --- API de Pedidos Atualizada ---

export const pedidoAPI = {
  criarIntentPagamento: async (pedidoInput: PedidoInput): Promise<PaymentIntentResponse> => {
    return apiFetch<PaymentIntentResponse>(`${API_BASE_URL}/pedidos/criar-intent-pagamento`, {
      method: "POST",
      body: JSON.stringify(pedidoInput),
    });
  },

  listarMeusPedidos: async (): Promise<Pedido[]> => {
    return apiFetch<Pedido[]>(`${API_BASE_URL}/pedidos/me`);
  },

  obterMeuPedido: async (id: number): Promise<Pedido> => {
    return apiFetch<Pedido>(`${API_BASE_URL}/pedidos/me/${id}`);
  },

  cancelarMeuPedido: async (id: number): Promise<Pedido> => {
    return apiFetch<Pedido>(`${API_BASE_URL}/pedidos/me/cancelar/${id}`, {
      method: "PATCH",
    });
  },

  // --- Funções Admin ---
  listarTodosAdmin: async (): Promise<Pedido[]> => {
    return apiFetch<Pedido[]>(`${API_BASE_URL}/pedidos/admin`);
  },

  obterAdmin: async (id: number): Promise<Pedido> => {
    return apiFetch<Pedido>(`${API_BASE_URL}/pedidos/admin/${id}`);
  },

  atualizarStatusAdmin: async (id: number, status: string): Promise<Pedido> => {
    return apiFetch<Pedido>(`${API_BASE_URL}/pedidos/admin/atualizar-status/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// --- Constantes de Status ---
export const StatusPedido = {
  PAGAMENTO_PENDENTE: 'pagamento_pendente',
  PENDENTE: 'pendente',
  APROVADO: 'aprovado',
  RECUSADO: 'recusado',
  EM_PREPARACAO: 'em_preparacao',
  A_CAMINHO: 'a_caminho',
  PRONTO_RETIRADA: 'pronto_retirada',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado',
  FALHA_PAGAMENTO: 'falha_pagamento',
};

// --- Funções de Formatação ---
export const formatarPreco = (preco: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
};

