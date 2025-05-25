import React, { useState, useEffect } from 'react';
import { useStore, Sale, Customer, Product, RecurrenceType, SaleStatus, SaleItem, PaymentMethod } from '../store/useStore';
import { saleApi, customerApi, productApi, paymentApi } from '../services/api';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface SaleFormProps {
  sale?: Sale;
  isOpen: boolean;
  onClose: () => void;
  preselectedCustomerId?: string;
}

interface SaleItemForm {
  productId: string;
  quantity: number;
  unitPriceGBP: number;
  unitRecurringPriceGBP?: number;
  recurrenceOverride?: RecurrenceType;
  recurrenceIntervalOverride?: number;
  notes?: string;
}

const SaleForm: React.FC<SaleFormProps> = ({ sale, isOpen, onClose, preselectedCustomerId }) => {
  const { customers, products, addSale, updateSale, setSales, setLoading, setCustomers, setProducts } = useStore();
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [customerId, setCustomerId] = useState(preselectedCustomerId || '');
  const [saleDate, setSaleDate] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<SaleStatus>(SaleStatus.Active);
  const [saleItems, setSaleItems] = useState<SaleItemForm[]>([]);

  // New payment state
  const [collectPayment, setCollectPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'deposit'>('full');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<{ value: number; text: string }[]>([]);

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await paymentApi.getMethods();
        setPaymentMethods(methods);
      } catch (err) {
        console.error('Error loading payment methods:', err);
      }
    };
    
    loadPaymentMethods();
  }, []);

  // Load customers and products
  useEffect(() => {
    const loadData = async () => {
      try {
        if (customers.length === 0) {
          const customersData = await customerApi.getAll();
          setCustomers(customersData);
        }
        if (products.length === 0) {
          const productsData = await productApi.getAll();
          setProducts(productsData);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, [customers.length, products.length, setCustomers, setProducts]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (sale) {
        // Edit mode
        setCustomerId(sale.customerId);
        setSaleDate(sale.saleDate.split('T')[0]);
        setNotes(sale.notes || '');
        setStatus(sale.status);
        setSaleItems(sale.saleItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPriceGBP: item.unitPriceGBP,
          unitRecurringPriceGBP: item.unitRecurringPriceGBP,
          recurrenceOverride: item.recurrenceOverride,
          recurrenceIntervalOverride: item.recurrenceIntervalOverride,
          notes: item.notes
        })));
        
        // Disable payment collection for existing sales
        setCollectPayment(false);
      } else {
        // Add mode
        setCustomerId(preselectedCustomerId || '');
        setSaleDate(new Date().toISOString().split('T')[0]);
        setNotes('');
        setStatus(SaleStatus.Active);
        setSaleItems([]);
        
        // Reset payment fields
        setCollectPayment(false);
        setPaymentType('full');
        setPaymentAmount(0);
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod(PaymentMethod.Cash);
        setPaymentReference('');
        setPaymentNotes('');
      }
      setError(null);
    }
  }, [isOpen, sale, preselectedCustomerId]);

  // Update payment amount when payment type or totals change
  useEffect(() => {
    const { totalAmount } = calculateTotals();
    if (collectPayment) {
      if (paymentType === 'full') {
        setPaymentAmount(totalAmount);
      } else if (paymentType === 'deposit' && paymentAmount === 0) {
        // Set default deposit to 50% or minimum £50
        const defaultDeposit = Math.max(totalAmount * 0.5, Math.min(50, totalAmount));
        setPaymentAmount(Math.round(defaultDeposit * 100) / 100);
      }
    }
  }, [collectPayment, paymentType, saleItems]);

  const addSaleItem = () => {
    setSaleItems([...saleItems, {
      productId: '',
      quantity: 1,
      unitPriceGBP: 0,
      unitRecurringPriceGBP: undefined,
      recurrenceOverride: undefined,
      recurrenceIntervalOverride: undefined,
      notes: ''
    }]);
  };

  const removeSaleItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const updateSaleItem = (index: number, field: keyof SaleItemForm, value: any) => {
    const updatedItems = [...saleItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // If product changed, update pricing from product defaults
    if (field === 'productId' && value) {
      const product = products.find(p => p.id === value);
      if (product) {
        updatedItems[index].unitPriceGBP = product.priceGBP;
        updatedItems[index].unitRecurringPriceGBP = product.recurringPriceGBP || undefined;
      }
    }

    setSaleItems(updatedItems);
  };

  const calculateTotals = () => {
    const totalAmount = saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPriceGBP), 0);
    const totalRecurring = saleItems.reduce((sum, item) => {
      return sum + (item.unitRecurringPriceGBP ? item.quantity * item.unitRecurringPriceGBP : 0);
    }, 0);
    return { totalAmount, totalRecurring };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!customerId) {
      setError('Please select a customer');
      return;
    }

    if (saleItems.length === 0) {
      setError('Please add at least one product to the sale');
      return;
    }

    // Validate all sale items have products selected
    for (let i = 0; i < saleItems.length; i++) {
      if (!saleItems[i].productId) {
        setError(`Please select a product for item ${i + 1}`);
        return;
      }
      if (saleItems[i].quantity <= 0) {
        setError(`Please enter a valid quantity for item ${i + 1}`);
        return;
      }
      if (saleItems[i].unitPriceGBP < 0) {
        setError(`Please enter a valid price for item ${i + 1}`);
        return;
      }
    }

    // Validate payment if collecting payment
    if (collectPayment) {
      if (paymentAmount <= 0) {
        setError('Payment amount must be greater than zero');
        return;
      }
      
      const { totalAmount } = calculateTotals();
      if (paymentAmount > totalAmount) {
        setError('Payment amount cannot exceed sale total');
        return;
      }
    }

    try {
      setLoading(true);

      if (sale) {
        // Update existing sale
        await saleApi.update(sale.id, {
          saleDate: saleDate + 'T00:00:00Z',
          status: status,
          notes: notes || undefined,
          saleItems: saleItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPriceGBP: item.unitPriceGBP,
            unitRecurringPriceGBP: item.unitRecurringPriceGBP,
            recurrenceOverride: item.recurrenceOverride,
            recurrenceIntervalOverride: item.recurrenceIntervalOverride,
            notes: item.notes
          }))
        });

        // Refresh sales list
        const updatedSales = await saleApi.getAll();
        setSales(updatedSales);
      } else {
        // Create new sale
        const newSale = await saleApi.create({
          customerId,
          saleDate: saleDate + 'T00:00:00Z',
          notes: notes || undefined,
          saleItems: saleItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPriceGBP: item.unitPriceGBP,
            unitRecurringPriceGBP: item.unitRecurringPriceGBP,
            recurrenceOverride: item.recurrenceOverride,
            recurrenceIntervalOverride: item.recurrenceIntervalOverride,
            notes: item.notes
          }))
        });

        addSale(newSale);

        // Create payment if requested
        if (collectPayment && paymentAmount > 0) {
          const paymentTypeText = paymentType === 'full' ? 'Full Payment' : 'Deposit';
          try {
            // Add a delay to ensure sale is fully committed to database
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log('Creating payment for sale:', newSale.id, 'Amount:', paymentAmount);
            await paymentApi.create({
              saleId: newSale.id,
              amountPaidGBP: paymentAmount,
              paymentDate: paymentDate + 'T00:00:00Z',
              paymentMethod: paymentMethod,
              reference: paymentReference || undefined,
              notes: paymentNotes || undefined,
              paymentType: paymentTypeText
            });
            // Fetch the updated sale and update the sales list
            const updatedSale = await saleApi.getById(newSale.id);
            setSales((prevSales: Sale[]) => prevSales.map((sale: Sale) => sale.id === updatedSale.id ? updatedSale : sale));
          } catch (paymentError: any) {
            console.error('Error creating payment:', paymentError);
            setError(`Sale created successfully, but payment creation failed: ${paymentError.response?.data?.message || paymentError.message}. You can add the payment manually from the sales list.`);
            return;
          }
        }
      }

      onClose();
    } catch (err: any) {
      console.error('Error saving sale:', err);
      setError(err.response?.data?.message || 'Failed to save sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const { totalAmount, totalRecurring } = calculateTotals();

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
        maxWidth: '900px', 
        margin: 'auto',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="h5 mb-0">
              {sale ? 'Edit Sale' : 'Create New Sale'}
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
            {/* Sale Details */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Customer *</label>
                <select
                  className="form-control"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                  disabled={!!preselectedCustomerId}
                >
                  <option value="">Select a customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Sale Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {sale && (
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(Number(e.target.value) as SaleStatus)}
                  >
                    <option value={SaleStatus.Active}>Active</option>
                    <option value={SaleStatus.Complete}>Complete</option>
                    <option value={SaleStatus.Cancelled}>Cancelled</option>
                    <option value={SaleStatus.Overdue}>Overdue</option>
                  </select>
                </div>
              </div>
            )}

            {/* Products & Services Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="h6 mb-0" style={{ color: '#374151', fontWeight: '600' }}>Products & Services</h4>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={addSaleItem}
                  style={{
                    backgroundColor: '#e0f2fe',
                    border: '1px solid #0369a1',
                    color: '#0369a1',
                    borderRadius: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <PlusIcon style={{ width: '16px', height: '16px' }} />
                  Add Product
                </button>
              </div>

              {saleItems.length === 0 ? (
                <div className="card" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <div className="card-body text-center py-4">
                    <p className="mb-3" style={{ color: '#64748b' }}>No products added yet</p>
                    <button
                      type="button"
                      className="btn"
                      onClick={addSaleItem}
                      style={{
                        backgroundColor: '#0369a1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        padding: '0.5rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        margin: '0 auto'
                      }}
                    >
                      <PlusIcon style={{ width: '16px', height: '16px' }} />
                      Add Your First Product
                    </button>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ borderColor: '#e2e8f0' }}>
                  <div className="card-body p-0">
                    {saleItems.map((item, index) => (
                      <div key={index} className={`p-3 ${index > 0 ? 'border-top' : ''}`} style={{ borderColor: '#e2e8f0' }}>
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label small">Product *</label>
                            <select
                              className="form-control form-control-sm"
                              value={item.productId}
                              onChange={(e) => updateSaleItem(index, 'productId', e.target.value)}
                              required
                            >
                              <option value="">Select product...</option>
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name} - {formatCurrency(product.priceGBP)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-2">
                            <label className="form-label small">Quantity *</label>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={item.quantity}
                              onChange={(e) => updateSaleItem(index, 'quantity', Number(e.target.value))}
                              min="1"
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label small">Unit Price *</label>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control form-control-sm"
                              value={item.unitPriceGBP}
                              onChange={(e) => updateSaleItem(index, 'unitPriceGBP', Number(e.target.value))}
                              min="0"
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label small">Recurring Price</label>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control form-control-sm"
                              value={item.unitRecurringPriceGBP || ''}
                              onChange={(e) => updateSaleItem(index, 'unitRecurringPriceGBP', e.target.value ? Number(e.target.value) : undefined)}
                              min="0"
                              placeholder="Optional"
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label small">Line Total</label>
                            <div className="form-control form-control-sm" style={{ backgroundColor: '#f8fafc', color: '#374151' }}>
                              {formatCurrency(item.quantity * item.unitPriceGBP)}
                            </div>
                          </div>
                        </div>
                        <div className="row g-3 mt-1">
                          <div className="col-md-10">
                            <label className="form-label small">Notes</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={item.notes || ''}
                              onChange={(e) => updateSaleItem(index, 'notes', e.target.value)}
                              placeholder="Optional notes for this item"
                            />
                          </div>
                          <div className="col-md-2 d-flex align-items-end">
                            <button
                              type="button"
                              className="btn btn-sm w-100"
                              onClick={() => removeSaleItem(index)}
                              style={{
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#991b1b',
                                borderRadius: '0.375rem'
                              }}
                            >
                              <TrashIcon style={{ width: '16px', height: '16px' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sale Totals */}
            {saleItems.length > 0 && (
              <div className="row mb-4">
                <div className="col-md-6 offset-md-6">
                  <div className="card" style={{ backgroundColor: '#f0f9ff', borderColor: '#0369a1' }}>
                    <div className="card-body">
                      <h6 className="h6 mb-3" style={{ color: '#0369a1' }}>Sale Summary</h6>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Total Amount:</span>
                        <strong style={{ color: '#374151' }}>{formatCurrency(totalAmount)}</strong>
                      </div>
                      {totalRecurring > 0 && (
                        <div className="d-flex justify-content-between">
                          <span>Recurring Total:</span>
                          <strong style={{ color: '#374151' }}>{formatCurrency(totalRecurring)}/period</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NEW: Payment Collection Section - only show for new sales */}
            {!sale && saleItems.length > 0 && totalAmount > 0 && (
              <div className="mb-4">
                <div className="card" style={{ borderColor: '#10b981', backgroundColor: '#f0fdf4' }}>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <input
                        type="checkbox"
                        id="collectPayment"
                        checked={collectPayment}
                        onChange={(e) => setCollectPayment(e.target.checked)}
                        className="form-check-input me-2"
                      />
                      <label htmlFor="collectPayment" className="form-check-label h6 mb-0" style={{ color: '#059669' }}>
                        Collect Payment Now
                      </label>
                    </div>

                    {collectPayment && (
                      <div>
                        {/* Payment Type Selection */}
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Payment Type *</label>
                            <div className="d-flex gap-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="paymentType"
                                  id="paymentTypeFull"
                                  checked={paymentType === 'full'}
                                  onChange={() => setPaymentType('full')}
                                />
                                <label className="form-check-label" htmlFor="paymentTypeFull">
                                  Pay in Full
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="paymentType"
                                  id="paymentTypeDeposit"
                                  checked={paymentType === 'deposit'}
                                  onChange={() => setPaymentType('deposit')}
                                />
                                <label className="form-check-label" htmlFor="paymentTypeDeposit">
                                  Pay Deposit
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Payment Amount *</label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                borderRight: 'none',
                                padding: '0.375rem 0.75rem',
                                borderRadius: '0.375rem 0 0 0.375rem',
                                fontSize: '0.875rem',
                                color: '#475569'
                              }}>£</span>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                min="0.01"
                                max={totalAmount}
                                required
                                disabled={paymentType === 'full'}
                                style={{
                                  borderRadius: '0 0.375rem 0.375rem 0',
                                  borderLeft: 'none'
                                }}
                              />
                            </div>
                            <div className="small mt-1" style={{ color: '#64748b' }}>
                              Remaining balance: {formatCurrency(totalAmount - paymentAmount)}
                            </div>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label">Payment Date *</label>
                            <input
                              type="date"
                              className="form-control"
                              value={paymentDate}
                              onChange={(e) => setPaymentDate(e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Payment Method *</label>
                            <select
                              className="form-control"
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(Number(e.target.value) as PaymentMethod)}
                              required
                            >
                              {paymentMethods.map((method) => (
                                <option key={method.value} value={method.value}>
                                  {method.text}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Reference</label>
                            <input
                              type="text"
                              className="form-control"
                              value={paymentReference}
                              onChange={(e) => setPaymentReference(e.target.value)}
                              placeholder="Optional reference"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <label className="form-label">Payment Notes</label>
                            <input
                              type="text"
                              className="form-control"
                              value={paymentNotes}
                              onChange={(e) => setPaymentNotes(e.target.value)}
                              placeholder="Optional payment notes"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-4">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional notes for this sale"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Form Actions */}
            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                onClick={onClose}
                className="btn"
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
                disabled={saleItems.length === 0}
                style={{
                  backgroundColor: saleItems.length === 0 ? '#e2e8f0' : '#0369a1',
                  color: saleItems.length === 0 ? '#94a3b8' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  cursor: saleItems.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {sale ? 'Update Sale' : collectPayment && paymentAmount > 0 ? 'Create Sale & Collect Payment' : 'Create Sale'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaleForm; 