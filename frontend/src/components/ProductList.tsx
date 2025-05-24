import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useStore, Product, RecurrenceType } from '../store/useStore';
import { productApi } from '../services/api';

interface ProductListProps {
  onEdit: (product: Product) => void;
  onAdd: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEdit, onAdd }) => {
  const { products, setProducts, deleteProduct, isLoading, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      await productApi.delete(id);
      deleteProduct(id);
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price);
  };

  const getRecurrenceText = (product: Product) => {
    if (!product.isRecurring) return 'One-off';
    
    const intervalText = product.recurrenceInterval > 1 ? ` (every ${product.recurrenceInterval})` : '';
    
    switch (product.recurrenceType) {
      case RecurrenceType.Daily:
        return `Daily${intervalText}`;
      case RecurrenceType.Weekly:
        return `Weekly${intervalText}`;
      case RecurrenceType.Monthly:
        return `Monthly${intervalText}`;
      case RecurrenceType.Annually:
        return `Annually${intervalText}`;
      case RecurrenceType.Custom:
        return `Custom${intervalText}`;
      default:
        return 'One-off';
    }
  };

  const getRecurrenceBadgeStyle = (product: Product) => {
    if (!product.isRecurring) {
      return {
        backgroundColor: '#f1f5f9',
        color: '#475569',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        fontWeight: '500'
      };
    }
    
    return {
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: '500'
    };
  };

  if (error) {
    return (
      <div className="card" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
        <div className="card-body">
          <p style={{ color: '#991b1b' }}>{error}</p>
          <button 
            onClick={loadProducts}
            className="btn btn-primary"
            style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h4 mb-1">Products & Services</h1>
            <p className="text-muted small mb-0">
              Manage your products and services including pricing and recurrence options.
            </p>
          </div>
          <button
            onClick={onAdd}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <PlusIcon style={{ width: '20px', height: '20px' }} />
            Add Product
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <p className="text-muted">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <svg className="text-muted" width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h6 className="fw-medium mb-2">No products yet</h6>
            <p className="text-muted small mb-3">Add your first product or service to get started!</p>
            <button onClick={onAdd} className="btn btn-primary">
              <PlusIcon style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Add First Product
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Product/Service</th>
                  <th>Price</th>
                  <th>Billing</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="fw-medium">{product.name}</div>
                      {product.description && (
                        <div className="text-muted small" style={{ marginTop: '0.25rem' }}>
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="fw-medium">{formatPrice(product.priceGBP)}</div>
                    </td>
                    <td>
                      <span style={getRecurrenceBadgeStyle(product)}>
                        {getRecurrenceText(product)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="btn"
                          style={{ 
                            color: '#3b82f6', 
                            padding: '0.25rem',
                            border: 'none',
                            background: 'none'
                          }}
                          title="Edit product"
                        >
                          <PencilIcon style={{ width: '18px', height: '18px' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn"
                          style={{ 
                            color: '#dc2626', 
                            padding: '0.25rem',
                            border: 'none',
                            background: 'none'
                          }}
                          title="Delete product"
                        >
                          <TrashIcon style={{ width: '18px', height: '18px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList; 