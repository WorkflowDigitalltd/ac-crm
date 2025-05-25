import React, { useEffect, useState } from 'react';
import { useStore, Expense, ExpenseCategory } from '../store/useStore';
import { expenseApi } from '../services/api';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ExpensesListProps {
  onAdd: () => void;
  onEdit: (expense: Expense) => void;
  onView: (expense: Expense) => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ onAdd, onEdit, onView }) => {
  const { expenses, setExpenses, isLoading, setLoading } = useStore();
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState<number>(0); // 0 means all months
  const [categoryFilter, setCategoryFilter] = useState<number>(-1); // -1 means all categories
  const [categories, setCategories] = useState<{ value: number; text: string }[]>([]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const expensesData = await expenseApi.getAll();
      setExpenses(expensesData);
      
      // Load categories for filtering
      const categoriesData = await expenseApi.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
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

  const getCategoryText = (category: ExpenseCategory) => {
    return ExpenseCategory[category];
  };

  const handleDeleteExpense = async (expenseId: string) => {
    setError('');
    setSuccessMessage('');

    if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      setLoading(true);
      try {
        await expenseApi.delete(expenseId);
        setExpenses(expenses.filter((e: Expense) => e.id !== expenseId));
        setSuccessMessage('Expense successfully deleted.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err: any) {
        console.error('Error deleting expense:', err);
        setError(err.response?.data?.message || 'Failed to delete expense. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter expenses based on selected filters
  const filteredExpenses = expenses.filter((expense: Expense) => {
    const expenseDate = new Date(expense.expenseDate);
    const matchesYear = yearFilter === 0 || expenseDate.getFullYear() === yearFilter;
    const matchesMonth = monthFilter === 0 || expenseDate.getMonth() + 1 === monthFilter;
    const matchesCategory = categoryFilter === -1 || expense.category === categoryFilter;
    return matchesYear && matchesMonth && matchesCategory;
  });

  // Calculate totals for filtered expenses
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amountGBP, 0);
  const totalTaxDeductible = filteredExpenses
    .filter(expense => expense.isTaxDeductible)
    .reduce((sum, expense) => sum + expense.amountGBP, 0);

  // Generate month options
  const monthOptions = [
    { value: 0, text: 'All Months' },
    { value: 1, text: 'January' },
    { value: 2, text: 'February' },
    { value: 3, text: 'March' },
    { value: 4, text: 'April' },
    { value: 5, text: 'May' },
    { value: 6, text: 'June' },
    { value: 7, text: 'July' },
    { value: 8, text: 'August' },
    { value: 9, text: 'September' },
    { value: 10, text: 'October' },
    { value: 11, text: 'November' },
    { value: 12, text: 'December' }
  ];

  // Generate year options (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: 0, text: 'All Years' },
    ...Array.from({ length: 6 }, (_, i) => ({
      value: currentYear - i,
      text: `${currentYear - i}`
    }))
  ];

  // Always use a safe array for expenses
  const safeExpenses = Array.isArray(filteredExpenses) ? filteredExpenses : [];

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Expenses</h4>
            <p>{error}</p>
            <hr />
            <div className="d-flex">
              <button className="btn btn-outline-danger me-2" onClick={loadExpenses}>
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
          <h1 className="h3 mb-1">Expenses</h1>
          <p className="text-muted">Track and manage business expenses</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={onAdd}
        >
          <PlusIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
          Add Expense
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

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Filters</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="yearFilter" className="form-label">Year</label>
              <select
                id="yearFilter"
                className="form-select"
                value={yearFilter}
                onChange={(e) => setYearFilter(Number(e.target.value))}
              >
                {yearOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.text}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="monthFilter" className="form-label">Month</label>
              <select
                id="monthFilter"
                className="form-select"
                value={monthFilter}
                onChange={(e) => setMonthFilter(Number(e.target.value))}
              >
                {monthOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.text}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="categoryFilter" className="form-label">Category</label>
              <select
                id="categoryFilter"
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(Number(e.target.value))}
              >
                <option value={-1}>All Categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.text}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Expenses</h5>
              <h2 className="card-text text-primary">{formatCurrency(totalAmount)}</h2>
              <p className="card-text text-muted">{filteredExpenses.length} expense(s)</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Tax Deductible</h5>
              <h2 className="card-text text-success">{formatCurrency(totalTaxDeductible)}</h2>
              <p className="card-text text-muted">
                {((totalTaxDeductible / totalAmount) * 100 || 0).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card">
        <div className="card-body">
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !safeExpenses || safeExpenses.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <svg className="text-muted" width="96" height="96" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="h5 mb-3">No Expenses Found</h3>
              <p className="text-muted mb-4">
                {expenses.length === 0 
                  ? "Start tracking your business expenses to manage your finances better."
                  : "No expenses match your current filters. Try adjusting your filters."}
              </p>
              <button
                className="btn btn-primary d-flex align-items-center mx-auto"
                onClick={onAdd}
              >
                <PlusIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Vendor</th>
                    <th>Amount</th>
                    <th>Tax Deductible</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safeExpenses.map((expense) => {
                    // Safety check for expense object and required properties
                    if (!expense || !expense.id) {
                      return null;
                    }
                    
                    return (
                      <tr key={expense.id}>
                        <td>{formatDate(expense.expenseDate)}</td>
                        <td>
                          <div className="fw-medium">{expense.description}</div>
                          {expense.notes && (
                            <div className="small text-muted">{expense.notes}</div>
                          )}
                        </td>
                        <td>{getCategoryText(expense.category)}</td>
                        <td>{expense.vendor || '-'}</td>
                        <td className="fw-medium">{formatCurrency(expense.amountGBP)}</td>
                        <td>
                          {expense.isTaxDeductible ? (
                            <span className="badge bg-success">Yes</span>
                          ) : (
                            <span className="badge bg-secondary">No</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => onView(expense)}
                              title="View Details"
                            >
                              <EyeIcon style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => onEdit(expense)}
                              title="Edit Expense"
                            >
                              <PencilIcon style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteExpense(expense.id)}
                              title="Delete Expense"
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

export default ExpensesList;
