/**
 * approvalService.js
 * ---------------------------------------------------------------
 * Camada de acesso à API da Tela de Aprovação do Gestor.
 *
 * PARA CONECTAR AO SEU BACKEND:
 *   1. Troque API_BASE_URL pela URL real da sua API.
 *   2. Ajuste ENDPOINTS se as rotas forem diferentes.
 *   3. Ajuste `normalizeOrder` para mapear os campos que o backend retorna.
 *   4. Mude USE_MOCK para false.
 * ---------------------------------------------------------------
 */

const USE_MOCK = true;

const API_BASE_URL = 'https://SEU-BACKEND.com/api';

const ENDPOINTS = {
  getOrder: (orderId) => `/orders/${orderId}`, // GET
  submitApproval: (orderId) => `/orders/${orderId}/approval`, // POST (ou PUT)
};

/** Se usar autenticação, retorne aqui os headers (ex.: Bearer token). */
function getAuthHeaders() {
  // const token = localStorage.getItem('token');
  // return token ? { Authorization: `Bearer ${token}` } : {};
  return {};
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Erro ${response.status} ao comunicar com o servidor.`);
  }

  return response.status === 204 ? null : response.json();
}

/**
 * Converte a resposta do backend para o formato usado pela tela.
 * Ajuste os nomes à direita conforme o contrato da sua API.
 *
 * Formato esperado pela tela:
 * {
 *   id, orderDate: 'YYYY-MM-DD', supplier,
 *   items: [{ id, product, quantity, unitPrice, lastPrice,
 *             lastPurchaseDate: 'YYYY-MM-DD' | null,
 *             stockQuantity, avgSales3Months }]
 * }
 */
function normalizeOrder(data) {
  return {
    id: data.id,
    orderDate: data.orderDate,
    supplier: data.supplier,
    items: (data.items ?? []).map((item) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lastPrice: item.lastPrice ?? null,
      lastPurchaseDate: item.lastPurchaseDate ?? null,
      stockQuantity: item.stockQuantity,
      avgSales3Months: item.avgSales3Months,
    })),
  };
}

/* ----------------------------- MOCK ----------------------------- */

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_ORDER = {
  // Dados do Pedido de Compra nº 00001405
  id: '00001405',
  orderDate: '2026-11-09', // o PDF só traz a data de impressão (09/11/2026)
  supplier: 'DISTRIBUIDORA IMPERIO',
  items: [
    {
      id: 1,
      product: 'GARRAFA 500ML - ITALYPET', 
      quantity: 3,
      unitPrice: 90,
      lastPrice: 85,
      lastPurchaseDate: '2026-10-14',
      stockQuantity: 12,
      avgSales3Months: 8,
    },
    {
    id: 2,
    product: 'DETERGENTE LÍQUIDO 500ML - YPÊ',
    quantity: 24,
    unitPrice: 2.50,
    totalPrice: 60.00,
    lastPrice: 2.35,
    lastPurchaseDate: '2026-09-28',
    stockQuantity: 15,
    avgSales3Months: 30,
  },
  {
    id: 3,
    product: 'PAPEL TOALHA INTERFOLHA 1000F - HIGIENE',
    quantity: 10,
    unitPrice: 45.00,
    totalPrice: 450.00,
    lastPrice: 42.00,
    lastPurchaseDate: '2026-10-05',
    stockQuantity: 4,
    avgSales3Months: 12,
  },
  {
    id: 4,
    product: 'SACO DE LIXO 100L REFORÇADO - PLASTUBOS',
    quantity: 5,
    unitPrice: 35.50,
    totalPrice: 177.50,
    lastPrice: 34.00,
    lastPurchaseDate: '2026-09-15',
    stockQuantity: 8,
    avgSales3Months: 6,
  },
  {
    id: 5,
    product: 'DESINFETANTE EUCALIPTO 5L - UFE',
    quantity: 6,
    unitPrice: 28.00,
    totalPrice: 168.00,
    lastPrice: 26.50,
    lastPurchaseDate: '2026-10-01',
    stockQuantity: 2,
    avgSales3Months: 7,
  },
  {
    id: 6,
    product: 'ESPONJA MULTIUSO (PCT COM 4) - SCOTCH-BRITE',
    quantity: 15,
    unitPrice: 7.80,
    totalPrice: 117.00,
    lastPrice: 7.50,
    lastPurchaseDate: '2026-09-20',
    stockQuantity: 10,
    avgSales3Months: 14,
  },
  {
    id: 7,
    product: 'PAPEL HIGIÊNICO ROLO 30X300M - MELHORAMENTOS',
    quantity: 8,
    unitPrice: 65.00,
    totalPrice: 520.00,
    lastPrice: 62.00,
    lastPurchaseDate: '2026-10-10',
    stockQuantity: 5,
    avgSales3Months: 9,
  },
  {
    id: 8,
    product: 'ÁGUA SANITÁRIA 2L - Q-BOA',
    quantity: 12,
    unitPrice: 6.50,
    totalPrice: 78.00,
    lastPrice: 6.00,
    lastPurchaseDate: '2026-09-25',
    stockQuantity: 6,
    avgSales3Months: 15,
  },
  {
    id: 9,
    product: 'COPO DESCARTÁVEL 200ML (PCT COM 100) - PLASVALE',
    quantity: 20,
    unitPrice: 8.90,
    totalPrice: 178.00,
    lastPrice: 8.50,
    lastPurchaseDate: '2026-10-02',
    stockQuantity: 18,
    avgSales3Months: 22,
  },
  {
    id: 10,
    product: 'RODO PLÁSTICO 40CM COM CABO - BETTANIN',
    quantity: 4,
    unitPrice: 15.00,
    totalPrice: 60.00,
    lastPrice: 14.00,
    lastPurchaseDate: '2026-08-15',
    stockQuantity: 3,
    avgSales3Months: 2,
  }
  ],
};

/* ------------------------------ API ----------------------------- */

/**
 * Busca os dados do pedido (GET).
 * @param {string} orderId
 */
export async function fetchOrderDetails(orderId) {
  if (USE_MOCK) {
    await wait(800);
    return normalizeOrder({ ...MOCK_ORDER, id: orderId });
  }

  const data = await request(ENDPOINTS.getOrder(orderId), { method: 'GET' });
  return normalizeOrder(data);
}

/**
 * Envia a decisão do gestor (POST/PUT).
 * @param {string} orderId
 * @param {{ status: 'approved' | 'rejected', comment: string }} decision
 */
export async function submitApproval(orderId, { status, comment }) {
  if (status !== 'approved' && status !== 'rejected') {
    throw new Error("Status inválido. Use 'approved' ou 'rejected'.");
  }

  if (USE_MOCK) {
    await wait(1000);
    return { orderId, status, comment, decidedAt: new Date().toISOString() };
  }

  return request(ENDPOINTS.submitApproval(orderId), {
    method: 'POST', // troque para 'PUT' se o seu backend exigir
    body: JSON.stringify({ status, comment }),
  });
}
