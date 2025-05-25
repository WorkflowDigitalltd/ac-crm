import React from 'react';
import { Expense, ExpenseCategory } from '../store/useStore';

interface ExpenseDetailsProps {
  expense: Expense;
  onClose: () => void;
  onEdit: () => void;
}

const ExpenseDetails: React.FC<ExpenseDetailsProps> = ({ expense, onClose, onEdit }) => {
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

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Expense Details</h5>
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="row mb-4">
          <div className="col-md-8">
            <h4>{expense.description}</h4>
            <p className="text-muted mb-0">
              {formatDate(expense.expenseDate)} • {ExpenseCategory[expense.category]}
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <h3 className="text-primary mb-0">{formatCurrency(expense.amountGBP)}</h3>
            {expense.isTaxDeductible && (
              <span className="badge bg-success">Tax Deductible</span>
            )}
          </div>
        </div>

        <hr />

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
              <h6 className="text-muted mb-1">Category</h6>
              <p className="mb-0">{ExpenseCategory[expense.category]}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <h6 className="text-muted mb-1">Date</h6>
              <p className="mb-0">{formatDate(expense.expenseDate)}</p>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
              <h6 className="text-muted mb-1">Vendor/Supplier</h6>
              <p className="mb-0">{expense.vendor || '-'}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <h6 className="text-muted mb-1">Reference/Invoice</h6>
              <p className="mb-0">{expense.reference || '-'}</p>
            </div>
          </div>
        </div>

        {expense.notes && (
          <div className="mb-3">
            <h6 className="text-muted mb-1">Notes</h6>
            <p className="mb-0">{expense.notes}</p>
          </div>
        )}

        <div className="mb-3">
          <h6 className="text-muted mb-1">Tax Status</h6>
          <p className="mb-0">
            {expense.isTaxDeductible ? (
              <span className="text-success">Tax Deductible</span>
            ) : (
              <span className="text-secondary">Not Tax Deductible</span>
            )}
          </p>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
        <button type="button" className="btn btn-primary" onClick={onEdit}>Edit</button>
      </div>
    </div>
  );
};

export default ExpenseDetails;
