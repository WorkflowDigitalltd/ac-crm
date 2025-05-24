import { create } from 'zustand';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  postcode?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  priceGBP: number;
  recurringPriceGBP?: number;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceInterval: number;
}

export enum RecurrenceType {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Annually = 4,
  Custom = 5
}

interface Store {
  // Customers
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  // Customers
  customers: [],
  setCustomers: (customers) => set({ customers }),
  addCustomer: (customer) => set((state) => ({ 
    customers: [...state.customers, customer] 
  })),
  updateCustomer: (id, updatedCustomer) => set((state) => ({
    customers: state.customers.map(customer => 
      customer.id === id ? { ...customer, ...updatedCustomer } : customer
    )
  })),
  deleteCustomer: (id) => set((state) => ({
    customers: state.customers.filter(customer => customer.id !== id)
  })),

  // Products
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    )
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(product => product.id !== id)
  })),

  // UI State
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
})); 