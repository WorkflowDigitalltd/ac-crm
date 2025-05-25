import React, { useEffect, useState } from 'react';
import { useStore, Sale, SaleStatus } from '../store/useStore';
import { saleApi } from '../services/api';
import { PlusIcon, EyeIcon, CreditCardIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SalesListProps {
  onAdd: () => void;
  onEdit: (sale: Sale) => void;
  onView: (sale: Sale) => void;
  onAddPayment: (sale: Sale) => void;
}

const SalesList: React.FC<SalesListProps> = ({ onAdd, onEdit, onView, onAddPayment }) => {
  const { sales, setSales, isLoading, setLoading } = useStore();
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const loadSales = async () => {
    try {
      setLoading(true);
      setError('');
      const salesData = await saleApi.getAll();
      setSales(salesData);
    } catch (err) {
      console.error('Error loading sales:', err);
      setError('Failed to load sales. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getSaleStatusText = (status: SaleStatus) => {
    switch (status) {
      case SaleStatus.Active:
        return 'Active';
      case SaleStatus.Overdue:
        return 'Overdue';
      case SaleStatus.Cancelled:
        return 'Cancelled';
      case SaleStatus.Complete:
        return 'Complete';
      default:
        return 'Unknown';
    }
  };

  const getSaleStatusClass = (status: SaleStatus) => {
    switch (status) {
      case SaleStatus.Active:
        return 'text-success';
      case SaleStatus.Overdue:
        return 'text-danger';
      case SaleStatus.Cancelled:
        return 'text-secondary';
      case SaleStatus.Complete:
        return 'text-primary';
      default:
        return 'text-muted';
    }
  };

  const getPaymentStatusClass = (outstandingBalance: number) => {
    if (outstandingBalance === 0) return 'text-success';
    if (outstandingBalance > 0) return 'text-warning';
    return 'text-muted';
  };

  const getPaymentStatusText = (totalAmount: number, totalPaid: number, outstandingBalance: number) => {
    if (outstandingBalance === 0) return 'Paid in Full';
    if (totalPaid === 0) return 'No Payments';
    return 'Partial Payment';
  };

  const handleDeleteSale = async (saleId: string) => {
    setError('');
    setSuccessMessage('');

    if (window.confirm('Are you sure you want to delete this sale? This action cannot be undone and will also delete associated items.')) {
      setLoading(true);
      try {
        await saleApi.delete(saleId);
        // Compute the new sales array after filtering
        const updatedSales = sales.filter((s: Sale) => s.id !== saleId);
        setSales(updatedSales); // Pass the new array directly
        setSuccessMessage('Sale successfully deleted.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err: any) {
        console.error('Error deleting sale:', err);
        setError(err.response?.data?.message || 'Failed to delete sale. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Always use a safe array for sales
  const safeSales = Array.isArray(sales) ? sales : [];

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Sales</h4>
            <p>{error}</p>
            <hr />
            <div className="d-flex">
              <button className="btn btn-outline-danger me-2" onClick={loadSales}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Sales & Orders</h1>
          <p className="text-muted">Manage your sales and track payments</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={onAdd}
        >
          <PlusIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
          Add Sale
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success d-flex align-items-center" role="alert">
          <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
            <use xlinkHref="#check-circle-fill"/>
          </svg>
          <div>{successMessage}</div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Sales</h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex">
            <button className="btn btn-outline-danger me-2" onClick={loadSales}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <div className="card">
        <div className="card-body">
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !safeSales || safeSales.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <svg className="text-muted" width="96" height="96" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="h5 mb-3">No Sales Yet</h3>
              <p className="text-muted mb-4">
                Start creating sales to track your customer orders and payments.
              </p>
              <button
                className="btn btn-primary d-flex align-items-center mx-auto"
                onClick={onAdd}
              >
                <PlusIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Create Your First Sale
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Sale Date</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Paid</th>
                    <th>Outstanding</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safeSales.map((sale) => {
                    const itemCount = Array.isArray(sale.saleItems) ? sale.saleItems.length : 0;
                    // Safety check for sale object and required properties
                    if (!sale || !sale.id || !sale.customerName) {
                      return null;
                    }
                    
                    return (
                      <tr key={sale.id}>
                        <td>{formatDate(sale.saleDate)}</td>
                        <td>
                          <div>
                            <div className="fw-medium">{sale.customerName}</div>
                            <div className="small text-muted">{sale.customerEmail || ''}</div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {itemCount} item{itemCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="fw-medium">
                          {formatCurrency(sale.totalAmountGBP || 0)}
                          {(sale.totalRecurringAmountGBP || 0) > 0 && (
                            <div className="small text-muted">
                              + {formatCurrency(sale.totalRecurringAmountGBP)}/period
                            </div>
                          )}
                        </td>
                        <td className="fw-medium text-success">
                          {formatCurrency(sale.totalPaidGBP || 0)}
                        </td>
                        <td className={`fw-medium ${getPaymentStatusClass(sale.outstandingBalanceGBP || 0)}`}>
                          {formatCurrency(sale.outstandingBalanceGBP || 0)}
                        </td>
                        <td>
                          <span className={`badge ${getSaleStatusClass(sale.status)}`}>
                            {getSaleStatusText(sale.status)}
                          </span>
                        </td>
                        <td>
                          <span className={`small ${getPaymentStatusClass(sale.outstandingBalanceGBP || 0)}`}>
                            {getPaymentStatusText(sale.totalAmountGBP || 0, sale.totalPaidGBP || 0, sale.outstandingBalanceGBP || 0)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => onView(sale)}
                              title="View Details"
                            >
                              <EyeIcon style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => onEdit(sale)}
                              title="Edit Sale"
                            >
                              <PencilIcon style={{ width: '16px', height: '16px' }} />
                            </button>
                            {(sale.outstandingBalanceGBP || 0) > 0 && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => onAddPayment(sale)}
                                title="Add Payment"
                              >
                                <CreditCardIcon style={{ width: '16px', height: '16px' }} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center align-items-center">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteSale(sale.id)}
                              title="Delete Sale"
                            >
                              <TrashIcon style={{ width: '16px', height: '16px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesList; 