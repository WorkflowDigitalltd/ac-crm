import axios from 'axios';
import { Customer, Product, Sale, Payment, SaleItem, Expense } from '../store/useStore';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (logging disabled for cleaner console)
api.interceptors.request.use((config) => {
  // Only log errors and important requests in development
  if (process.env.NODE_ENV === 'development' && config.method !== 'get') {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

// Customer API
export const customerApi = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  create: async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    const response = await api.post('/customers', customer);
    return response.data;
  },

  update: async (id: string, customer: Omit<Customer, 'id' | 'createdAt'>): Promise<void> => {
    await api.put(`/customers/${id}`, customer);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};

// Product API
export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },

  update: async (id: string, product: Omit<Product, 'id'>): Promise<void> => {
    await api.put(`/products/${id}`, product);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// Sale API
export const saleApi = {
  getAll: async (): Promise<Sale[]> => {
    const response = await api.get('/sales');
    return response.data;
  },

  getById: async (id: string): Promise<Sale> => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  getByCustomer: async (customerId: string): Promise<Sale[]> => {
    const response = await api.get(`/sales/customer/${customerId}`);
    return response.data;
  },

  create: async (sale: {
    customerId: string;
    saleDate?: string;
    quoteId?: string;
    notes?: string;
    saleItems: {
      productId: string;
      quantity: number;
      unitPriceGBP: number;
      unitRecurringPriceGBP?: number;
      recurrenceOverride?: number;
      recurrenceIntervalOverride?: number;
      notes?: string;
    }[];
  }): Promise<Sale> => {
    const response = await api.post('/sales', sale);
    return response.data;
  },

  update: async (id: string, sale: {
    saleDate: string;
    status: number;
    notes?: string;
    saleItems: {
      productId: string;
      quantity: number;
      unitPriceGBP: number;
      unitRecurringPriceGBP?: number;
      recurrenceOverride?: number;
      recurrenceIntervalOverride?: number;
      notes?: string;
    }[];
  }): Promise<void> => {
    await api.put(`/sales/${id}`, sale);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sales/${id}`);
  },
};

// Payment API
export const paymentApi = {
  getAll: async (): Promise<Payment[]> => {
    const response = await api.get('/payments');
    return response.data;
  },

  getById: async (id: string): Promise<Payment> => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  getBySale: async (saleId: string): Promise<Payment[]> => {
    const response = await api.get(`/payments/sale/${saleId}`);
    return response.data;
  },

  getMethods: async (): Promise<{ value: number; text: string }[]> => {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  create: async (payment: {
    saleId: string;
    amountPaidGBP: number;
    paymentDate?: string;
    paymentMethod: number;
    reference?: string;
    notes?: string;
    paymentType?: string;
  }): Promise<Payment> => {
    const response = await api.post('/payments', payment);
    return response.data;
  },

  update: async (id: string, payment: {
    amountPaidGBP: number;
    paymentDate: string;
    paymentMethod: number;
    reference?: string;
    notes?: string;
    paymentType?: string;
  }): Promise<void> => {
    await api.put(`/payments/${id}`, payment);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },
};

// Expense API
export const expenseApi = {
  getAll: async (): Promise<Expense[]> => {
    const response = await api.get('/expenses');
    return response.data;
  },

  getById: async (id: string): Promise<Expense> => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<{ value: number; text: string }[]> => {
    const response = await api.get('/expenses/categories');
    return response.data;
  },

  getMonthlySummary: async (year: number = new Date().getFullYear()): Promise<any[]> => {
    const response = await api.get(`/expenses/summary/monthly?year=${year}`);
    return response.data;
  },

  getCategorySummary: async (year: number = new Date().getFullYear(), month: number = 0): Promise<any[]> => {
    const response = await api.get(`/expenses/summary/category?year=${year}&month=${month}`);
    return response.data;
  },

  create: async (expense: {
    description: string;
    amountGBP: number;
    expenseDate: string;
    category: number;
    vendor?: string;
    reference?: string;
    notes?: string;
    isTaxDeductible: boolean;
  }): Promise<Expense> => {
    const response = await api.post('/expenses', expense);
    return response.data;
  },

  update: async (id: string, expense: {
    description: string;
    amountGBP: number;
    expenseDate: string;
    category: number;
    vendor?: string;
    reference?: string;
    notes?: string;
    isTaxDeductible: boolean;
  }): Promise<void> => {
    await api.put(`/expenses/${id}`, expense);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};

export default api; 