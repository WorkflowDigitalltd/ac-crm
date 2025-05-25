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

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceGBP: number;
  unitRecurringPriceGBP?: number;
  recurrenceOverride?: RecurrenceType;
  recurrenceIntervalOverride?: number;
  notes?: string;
  lineTotal: number;
  lineRecurringTotal?: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  saleDate: string;
  totalAmountGBP: number;
  totalRecurringAmountGBP: number;
  totalPaidGBP: number;
  outstandingBalanceGBP: number;
  status: SaleStatus;
  quoteId?: string;
  notes?: string;
  saleItems: SaleItem[];
  payments: Payment[];
}

export interface Payment {
  id: string;
  saleId: string;
  amountPaidGBP: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  paymentMethodText: string;
  reference?: string;
  notes?: string;
  paymentType?: string;
}

export interface Expense {
  id: string;
  description: string;
  amountGBP: number;
  expenseDate: string;
  category: ExpenseCategory;
  categoryText: string;
  vendor?: string;
  reference?: string;
  notes?: string;
  attachmentPath?: string;
  isTaxDeductible: boolean;
}

export enum RecurrenceType {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Quarterly = 4,
  Biannually = 5,
  Annually = 6,
  Custom = 7
}

export enum SaleStatus {
  Active = 0,
  Overdue = 1,
  Cancelled = 2,
  Complete = 3
}

export enum PaymentMethod {
  Cash = 0,
  Card = 1,
  BankTransfer = 2,
  Cheque = 3,
  Other = 4
}

export enum ExpenseCategory {
  Uncategorized = 0,
  Rent = 1,
  Utilities = 2,
  Salaries = 3,
  Equipment = 4,
  Supplies = 5,
  Marketing = 6,
  Travel = 7,
  Insurance = 8,
  Software = 9,
  Subscriptions = 10,
  Professional = 11,
  Maintenance = 12,
  Training = 13,
  Meals = 14,
  Entertainment = 15,
  Taxes = 16,
  Shipping = 17,
  Inventory = 18,
  Other = 19
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

  // Sales
  sales: Sale[];
  setSales: (sales: Sale[] | ((prev: Sale[]) => Sale[])) => void;
  addSale: (sale: Sale) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;

  // Payments
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;

  // Expenses
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

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

  // Sales
  sales: [],
  setSales: (salesOrUpdater) =>
    set((state) => ({
      sales: typeof salesOrUpdater === 'function'
        ? (salesOrUpdater as (prev: Sale[]) => Sale[])(state.sales)
        : salesOrUpdater
    })),
  addSale: (sale) => set((state) => ({ 
    sales: [...state.sales, sale] 
  })),
  updateSale: (id, updatedSale) => set((state) => ({
    sales: state.sales.map(sale => 
      sale.id === id ? { ...sale, ...updatedSale } : sale
    )
  })),
  deleteSale: (id) => set((state) => ({
    sales: state.sales.filter(sale => sale.id !== id)
  })),

  // Payments
  payments: [],
  setPayments: (payments) => set({ payments }),
  addPayment: (payment) => set((state) => ({ 
    payments: [...state.payments, payment] 
  })),
  updatePayment: (id, updatedPayment) => set((state) => ({
    payments: state.payments.map(payment => 
      payment.id === id ? { ...payment, ...updatedPayment } : payment
    )
  })),
  deletePayment: (id) => set((state) => ({
    payments: state.payments.filter(payment => payment.id !== id)
  })),

  // Expenses
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((state) => ({ 
    expenses: [...state.expenses, expense] 
  })),
  updateExpense: (id, updatedExpense) => set((state) => ({
    expenses: state.expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    )
  })),
  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter(expense => expense.id !== id)
  })),

  // UI State
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));