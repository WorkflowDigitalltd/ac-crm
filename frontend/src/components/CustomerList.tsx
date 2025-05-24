import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useStore, Customer } from '../store/useStore';
import { customerApi } from '../services/api';
import { format } from 'date-fns';

interface CustomerListProps {
  onEdit: (customer: Customer) => void;
  onAdd: () => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onEdit, onAdd }) => {
  const { customers, setCustomers, deleteCustomer, isLoading, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      setLoading(true);
      await customerApi.delete(id);
      deleteCustomer(id);
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error deleting customer:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <div className="card" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
        <div className="card-body">
          <p style={{ color: '#991b1b' }}>{error}</p>
          <button 
            onClick={loadCustomers}
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
            <h1 className="h4 mb-1">Customers</h1>
            <p className="text-muted small mb-0">
              A list of all customers including their name, email, and contact details.
            </p>
          </div>
          <button
            onClick={onAdd}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <PlusIcon style={{ width: '20px', height: '20px' }} />
            Add Customer
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <p className="text-muted">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <svg className="text-muted" width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h6 className="fw-medium mb-2">No customers yet</h6>
            <p className="text-muted small mb-3">Add your first customer to get started!</p>
            <button onClick={onAdd} className="btn btn-primary">
              <PlusIcon style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Add First Customer
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Created</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="fw-medium">{customer.name}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{customer.email}</div>
                      {customer.phone && (
                        <div className="text-muted small">{customer.phone}</div>
                      )}
                    </td>
                    <td>
                      <div>
                        {customer.address && (
                          <div className="fw-medium">{customer.address}</div>
                        )}
                        {customer.postcode && (
                          <div className="text-muted small">{customer.postcode}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="small text-muted">{formatDate(customer.createdAt)}</span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => onEdit(customer)}
                          className="btn"
                          style={{ 
                            color: '#3b82f6', 
                            padding: '0.25rem',
                            border: 'none',
                            background: 'none'
                          }}
                          title="Edit customer"
                        >
                          <PencilIcon style={{ width: '18px', height: '18px' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="btn"
                          style={{ 
                            color: '#dc2626', 
                            padding: '0.25rem',
                            border: 'none',
                            background: 'none'
                          }}
                          title="Delete customer"
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

export default CustomerList; 