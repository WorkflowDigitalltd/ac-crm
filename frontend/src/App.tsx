import React, { useState } from 'react';
import Layout from './components/Layout';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SalesList from './components/SalesList';
import SaleForm from './components/SaleForm';
import PaymentForm from './components/PaymentForm';
import ExpensesPage from './pages/ExpensesPage';
import { Customer, Product, Sale } from './store/useStore';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Customer modal state
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  
  // Product modal state
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Sale modal state
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | undefined>(undefined);
  const [preselectedCustomerId, setPreselectedCustomerId] = useState<string | undefined>(undefined);

  // Payment modal state
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [paymentSale, setPaymentSale] = useState<Sale | undefined>(undefined);

  const handleCustomerAdd = () => {
    setEditingCustomer(undefined);
    setIsCustomerFormOpen(true);
  };

  const handleCustomerEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerFormOpen(true);
  };

  const handleCustomerFormClose = () => {
    setIsCustomerFormOpen(false);
    setEditingCustomer(undefined);
  };

  const handleProductAdd = () => {
    setEditingProduct(undefined);
    setIsProductFormOpen(true);
  };

  const handleProductEdit = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleProductFormClose = () => {
    setIsProductFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleSaleAdd = () => {
    setEditingSale(undefined);
    setPreselectedCustomerId(undefined);
    setIsSaleFormOpen(true);
  };

  const handleSaleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setPreselectedCustomerId(undefined);
    setIsSaleFormOpen(true);
  };

  const handleSaleView = (sale: Sale) => {
    // For now, just edit the sale
    handleSaleEdit(sale);
  };

  const handleSaleFormClose = () => {
    setIsSaleFormOpen(false);
    setEditingSale(undefined);
    setPreselectedCustomerId(undefined);
  };

  const handleAddPayment = (sale: Sale) => {
    setPaymentSale(sale);
    setIsPaymentFormOpen(true);
  };

  const handlePaymentFormClose = () => {
    setIsPaymentFormOpen(false);
    setPaymentSale(undefined);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div>
            {/* Welcome Header */}
            <div className="gradient-header">
              <h1 className="display-6 fw-bold mb-3">Welcome to AC CRM</h1>
              <p className="lead opacity-75">Your professional customer relationship management system</p>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title h5">Quick Start</h3>
                    <p className="card-text text-muted mb-3">
                      Get started with your CRM by adding customers and products.
                    </p>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setCurrentPage('customers')}
                      >
                        Manage Customers
                      </button>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => setCurrentPage('products')}
                      >
                        Manage Products
                      </button>
                      <button
                        className="btn btn-outline-info"
                        onClick={() => setCurrentPage('sales')}
                      >
                        Manage Sales
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setCurrentPage('expenses')}
                      >
                        Manage Expenses
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title h5">Phase 2 Complete</h3>
                    <p className="card-text text-muted mb-3">
                      Sales & Payments now available!
                    </p>
                    <div className="small">
                      <div className="d-flex align-items-center mb-1 text-success">
                        <span className="status-dot success"></span>
                        Customer Management
                      </div>
                      <div className="d-flex align-items-center mb-1 text-success">
                        <span className="status-dot success"></span>
                        Product Management
                      </div>
                      <div className="d-flex align-items-center mb-1 text-success">
                        <span className="status-dot success"></span>
                        Sales & Orders
                      </div>
                      <div className="d-flex align-items-center text-success">
                        <span className="status-dot success"></span>
                        Payment Tracking
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title h5">Phase 3 Progress</h3>
                    <p className="card-text text-muted mb-3">
                      Phase 3 features in development
                    </p>
                    <div className="small">
                      <div className="d-flex align-items-center mb-1 text-warning">
                        <span className="status-dot warning"></span>
                        Invoices & Quotes
                      </div>
                      <div className="d-flex align-items-center mb-1 text-success">
                        <span className="status-dot success"></span>
                        Expense Tracking
                      </div>
                      <div className="d-flex align-items-center text-warning">
                        <span className="status-dot warning"></span>
                        Advanced Reports
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="card">
              <div className="card-body">
                <h2 className="h4 mb-4">Your Professional CRM Features</h2>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-medium mb-2">🏢 Customer Management</h6>
                    <p className="text-muted small mb-0">
                      Store comprehensive customer details including contact information, addresses, and interaction history.
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-medium mb-2">📦 Product Catalog</h6>
                    <p className="text-muted small mb-0">
                      Manage your products and services with flexible pricing and recurring billing options.
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-medium mb-2">🛒 Shopping Basket Sales</h6>
                    <p className="text-muted small mb-0">
                      Create sales with multiple products and flexible pricing, supporting complex orders.
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-medium mb-2">💰 Partial Payments</h6>
                    <p className="text-muted small mb-0">
                      Track deposits, installments, and flexible payment schedules with automatic balance calculation.
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-medium mb-2">🔄 Recurring Billing</h6>
                    <p className="text-muted small mb-0">
                      Set up automatic recurring charges with customizable intervals (daily, weekly, monthly, annual).
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="fw-medium mb-2">🇬🇧 UK Business Ready</h6>
                    <p className="text-muted small mb-0">
                      Built for UK businesses with proper date formats and GBP currency support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'customers':
        return (
          <>
            <CustomerList 
              onAdd={handleCustomerAdd}
              onEdit={handleCustomerEdit}
            />
            <CustomerForm
              customer={editingCustomer}
              isOpen={isCustomerFormOpen}
              onClose={handleCustomerFormClose}
            />
          </>
        );
      
      case 'products':
        return (
          <>
            <ProductList 
              onAdd={handleProductAdd}
              onEdit={handleProductEdit}
            />
            <ProductForm
              product={editingProduct}
              isOpen={isProductFormOpen}
              onClose={handleProductFormClose}
            />
          </>
        );
      
      case 'sales':
        return (
          <>
            <SalesList 
              onAdd={handleSaleAdd}
              onEdit={handleSaleEdit}
              onView={handleSaleView}
              onAddPayment={handleAddPayment}
            />
            <SaleForm
              sale={editingSale}
              isOpen={isSaleFormOpen}
              onClose={handleSaleFormClose}
              preselectedCustomerId={preselectedCustomerId}
            />
            <PaymentForm
              sale={paymentSale}
              isOpen={isPaymentFormOpen}
              onClose={handlePaymentFormClose}
            />
          </>
        );
      
      case 'expenses':
        return <ExpensesPage />;
      
      default:
        return (
          <div className="card">
            <div className="card-body">
              <h1 className="h4">Page not found</h1>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </div>
  );
}

export default App;
