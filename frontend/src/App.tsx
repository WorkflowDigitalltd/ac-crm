import React, { useState } from 'react';
import Layout from './components/Layout';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import { Customer, Product } from './store/useStore';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Customer modal state
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  
  // Product modal state
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

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
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title h5">Phase 1 Complete</h3>
                    <p className="card-text text-muted mb-3">
                      Your CRM foundation is ready!
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
                      <div className="d-flex align-items-center text-success">
                        <span className="status-dot success"></span>
                        UK Formatting (£, DD/MM/YYYY)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title h5">Coming Soon</h3>
                    <p className="card-text text-muted mb-3">
                      Phase 2 features in development
                    </p>
                    <div className="small">
                      <div className="d-flex align-items-center mb-1 text-warning">
                        <span className="status-dot warning"></span>
                        Sales & Orders
                      </div>
                      <div className="d-flex align-items-center mb-1 text-warning">
                        <span className="status-dot warning"></span>
                        Payment Tracking
                      </div>
                      <div className="d-flex align-items-center text-warning">
                        <span className="status-dot warning"></span>
                        Invoices & Quotes
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
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <svg className="text-muted" width="96" height="96" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="h5 mb-3">Sales & Orders</h3>
              <p className="text-muted mb-3">This feature will be available in Phase 2.</p>
              <p className="small text-muted">Complete your customer and product setup first, then we'll add powerful sales tracking capabilities.</p>
            </div>
          </div>
        );
      
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
