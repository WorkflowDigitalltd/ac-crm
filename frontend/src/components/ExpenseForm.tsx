import React, { useState, useEffect } from 'react';
import { useStore, Expense, ExpenseCategory } from '../store/useStore';
import { expenseApi } from '../services/api';

interface ExpenseFormProps {
  expense?: Expense;
  onClose: () => void;
  onSuccess: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onClose, onSuccess }) => {
  const { addExpense, updateExpense, setLoading } = useStore();
  const [categories, setCategories] = useState<{ value: number; text: string }[]>([]);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    description: '',
    amountGBP: '',
    expenseDate: '',
    category: 0,
    vendor: '',
    reference: '',
    notes: '',
    isTaxDeductible: true
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await expenseApi.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load expense categories.');
      }
    };

    loadCategories();

    // If editing an existing expense, populate the form
    if (expense) {
      setFormData({
        description: expense.description,
        amountGBP: expense.amountGBP.toString(),
        expenseDate: new Date(expense.expenseDate).toISOString().split('T')[0],
        category: expense.category,
        vendor: expense.vendor || '',
        reference: expense.reference || '',
        notes: expense.notes || '',
        isTaxDeductible: expense.isTaxDeductible
      });
    } else {
      // Set default date to today for new expenses
      setFormData(prev => ({
        ...prev,
        expenseDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [expense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const expenseData = {
        description: formData.description,
        amountGBP: parseFloat(formData.amountGBP),
        expenseDate: formData.expenseDate,
        category: Number(formData.category),
        vendor: formData.vendor || undefined,
        reference: formData.reference || undefined,
        notes: formData.notes || undefined,
        isTaxDeductible: formData.isTaxDeductible
      };

      if (expense) {
        // Update existing expense
        await expenseApi.update(expense.id, expenseData);
        updateExpense(expense.id, {
          ...expenseData,
          id: expense.id,
          categoryText: ExpenseCategory[expenseData.category]
        });
      } else {
        // Create new expense
        const newExpense = await expenseApi.create(expenseData);
        addExpense(newExpense);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving expense:', err);
      setError(err.response?.data?.message || 'Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{expense ? 'Edit Expense' : 'Add Expense'}</h5>
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      </div>
      <div className="modal-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description*</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="amountGBP" className="form-label">Amount (£)*</label>
              <div className="input-group">
                <span className="input-group-text">£</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  id="amountGBP"
                  name="amountGBP"
                  value={formData.amountGBP}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="expenseDate" className="form-label">Date*</label>
              <input
                type="date"
                className="form-control"
                id="expenseDate"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="category" className="form-label">Category*</label>
              <select
                className="form-select"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.text}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="vendor" className="form-label">Vendor/Supplier</label>
              <input
                type="text"
                className="form-control"
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="reference" className="form-label">Reference/Invoice Number</label>
            <input
              type="text"
              className="form-control"
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea
              className="form-control"
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isTaxDeductible"
              name="isTaxDeductible"
              checked={formData.isTaxDeductible}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="isTaxDeductible">
              Tax Deductible
            </label>
          </div>
          
          <div className="modal-footer px-0 pb-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {expense ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
