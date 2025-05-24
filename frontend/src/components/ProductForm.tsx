import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useStore, Product, RecurrenceType } from '../store/useStore';
import { productApi } from '../services/api';

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, isOpen, onClose }) => {
  const { addProduct, updateProduct, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceGBP: '',
    isRecurring: false,
    recurringPriceGBP: '',
    recurrenceType: RecurrenceType.None,
    recurrenceInterval: 1,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        priceGBP: product.priceGBP.toString(),
        isRecurring: product.isRecurring,
        recurringPriceGBP: product.recurringPriceGBP?.toString() || '',
        recurrenceType: product.recurrenceType,
        recurrenceInterval: product.recurrenceInterval,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        priceGBP: '',
        isRecurring: false,
        recurringPriceGBP: '',
        recurrenceType: RecurrenceType.None,
        recurrenceInterval: 1,
      });
    }
    setError(null);
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      
      const productData = {
        name: formData.name,
        description: formData.description || undefined,
        priceGBP: parseFloat(formData.priceGBP),
        recurringPriceGBP: formData.isRecurring && formData.recurringPriceGBP 
          ? parseFloat(formData.recurringPriceGBP) 
          : undefined,
        isRecurring: formData.isRecurring,
        recurrenceType: formData.isRecurring ? formData.recurrenceType : RecurrenceType.None,
        recurrenceInterval: formData.isRecurring ? formData.recurrenceInterval : 1,
      };

      if (product) {
        // Update existing product
        await productApi.update(product.id, productData);
        updateProduct(product.id, productData);
      } else {
        // Create new product
        const newProduct = await productApi.create(productData);
        addProduct(newProduct);
      }
      
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(name === 'isRecurring' && checked && !prev.recurringPriceGBP && prev.priceGBP 
          ? { recurringPriceGBP: prev.priceGBP }
          : {})
      }));
    } else if (name === 'recurrenceInterval') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 1
      }));
    } else if (name === 'recurrenceType') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) as RecurrenceType
      }));
    } else if (name === 'priceGBP') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(prev.isRecurring && (!prev.recurringPriceGBP || prev.recurringPriceGBP === prev.priceGBP)
          ? { recurringPriceGBP: value }
          : {})
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      overflowY: 'auto',
      padding: '1rem'
    }}>
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '500px', 
        margin: 'auto',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="h5 mb-0">
              {product ? 'Edit Product' : 'Add Product'}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              <XMarkIcon style={{ width: '24px', height: '24px' }} />
            </button>
          </div>

          {error && (
            <div className="card mb-3" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
              <div className="card-body py-3">
                <p className="small mb-0" style={{ color: '#991b1b' }}>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Product/Service Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="priceGBP" className="form-label">
                {formData.isRecurring ? 'Initial/Setup Price (£)' : 'Price (£)'} *
              </label>
              <input
                type="number"
                id="priceGBP"
                name="priceGBP"
                required
                min="0"
                step="0.01"
                value={formData.priceGBP}
                onChange={handleChange}
                className="form-control"
              />
              {formData.isRecurring && (
                <p className="small text-muted" style={{ marginTop: '0.25rem' }}>
                  This is the initial price (e.g., setup fee, first payment)
                </p>
              )}
            </div>

            <div className="mb-3">
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '8px',
                    accentColor: '#3b82f6'
                  }}
                />
                <label htmlFor="isRecurring" className="form-label mb-0">
                  Recurring billing
                </label>
              </div>
            </div>

            {formData.isRecurring && (
              <>
                <div className="mb-3">
                  <label htmlFor="recurringPriceGBP" className="form-label">
                    Recurring Price (£) *
                  </label>
                  <input
                    type="number"
                    id="recurringPriceGBP"
                    name="recurringPriceGBP"
                    required
                    min="0"
                    step="0.01"
                    value={formData.recurringPriceGBP}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <p className="small text-muted" style={{ marginTop: '0.25rem' }}>
                    Amount charged for each recurring period (can be different from initial price)
                  </p>
                </div>

                <div className="mb-3">
                  <label htmlFor="recurrenceType" className="form-label">
                    Recurrence Type
                  </label>
                  <select
                    id="recurrenceType"
                    name="recurrenceType"
                    value={formData.recurrenceType}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value={RecurrenceType.Daily}>Daily</option>
                    <option value={RecurrenceType.Weekly}>Weekly</option>
                    <option value={RecurrenceType.Monthly}>Monthly</option>
                    <option value={RecurrenceType.Annually}>Annually</option>
                    <option value={RecurrenceType.Custom}>Custom</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="recurrenceInterval" className="form-label">
                    Interval (every X periods)
                  </label>
                  <input
                    type="number"
                    id="recurrenceInterval"
                    name="recurrenceInterval"
                    min="1"
                    value={formData.recurrenceInterval}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <p className="small text-muted" style={{ marginTop: '0.25rem' }}>
                    e.g., "2" with "Monthly" = every 2 months
                  </p>
                </div>
              </>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.5rem 1rem'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm; 