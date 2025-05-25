import React, { useState, useEffect } from 'react';
import { useStore, Payment, PaymentMethod, Sale } from '../store/useStore';
import { paymentApi, saleApi } from '../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PaymentFormProps {
  payment?: Payment;
  sale?: Sale;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, sale: initialSale, isOpen, onClose }) => {
  const { addPayment, updatePayment, setPayments, setLoading, setSales } = useStore();
  const [error, setError] = useState<string | null>(null);
  
  // Local state for the sale being processed by the form
  const [currentSaleForForm, setCurrentSaleForForm] = useState<Sale | undefined>(initialSale);

  // Form state
  const [amountPaidGBP, setAmountPaidGBP] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentType, setPaymentType] = useState('');

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<{ value: number; text: string }[]>([]);

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (isOpen) { // Only load if open
        try {
          const methods = await paymentApi.getMethods();
          setPaymentMethods(methods);
        } catch (err) {
          console.error('Error loading payment methods:', err);
          setError('Failed to load payment methods.');
        }
      }
    };
    loadPaymentMethods();
  }, [isOpen]);

  // Effect to fetch fresh sale data when form opens for adding payment to an existing sale
  useEffect(() => {
    const fetchFreshSaleData = async () => {
      if (isOpen && initialSale && !payment) { // "Add Payment" mode for an existing sale
        setLoading(true);
        try {
          const freshSale = await saleApi.getById(initialSale.id);
          setCurrentSaleForForm(freshSale); // Update local state with fresh sale data
          setAmountPaidGBP(freshSale.outstandingBalanceGBP); // Pre-fill with fresh outstanding balance
        } catch (err) {
          console.error('Error fetching fresh sale data for PaymentForm:', err);
          setError('Could not load the latest sale details. Please close and try again.');
          // Optionally, you could close the form or disable submission
        } finally {
          setLoading(false);
        }
      } else if (initialSale) {
        // If not fetching, ensure currentSaleForForm is synced with initialSale if it changes
        setCurrentSaleForForm(initialSale);
      }
    };

    fetchFreshSaleData();
  }, [isOpen, initialSale, payment, setLoading, setError]);


  // Reset form fields when modal opens/closes or when initialSale/payment props change
  useEffect(() => {
    if (isOpen) {
      setCurrentSaleForForm(initialSale); // Sync with prop

      if (payment) { // Edit existing payment mode
        setAmountPaidGBP(payment.amountPaidGBP);
        setPaymentDate(payment.paymentDate.split('T')[0]);
        setPaymentMethod(payment.paymentMethod);
        setReference(payment.reference || '');
        setNotes(payment.notes || '');
        setPaymentType(payment.paymentType || '');
      } else if (currentSaleForForm) { // Add new payment mode (use currentSaleForForm for outstanding balance)
        setAmountPaidGBP(currentSaleForForm.outstandingBalanceGBP);
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod(PaymentMethod.Cash);
        setReference('');
        setNotes('');
        setPaymentType(''); // Default or perhaps "Partial Payment"
      } else { // Fallback if no sale context (should ideally not happen if form is for a sale)
        setAmountPaidGBP(0);
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod(PaymentMethod.Cash);
        setReference('');
        setNotes('');
        setPaymentType('');
      }
      setError(null); // Clear previous errors
    }
  }, [isOpen, payment, initialSale, currentSaleForForm]); // Rerun if currentSaleForForm updates

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Use currentSaleForForm if available (it has the freshest data), otherwise fallback to initialSale
    const activeSale = currentSaleForForm || initialSale;

    if (!activeSale && !payment) {
      setError('No sale specified for payment.');
      return;
    }

    if (amountPaidGBP <= 0) {
      setError('Payment amount must be greater than zero.');
      return;
    }

    // If adding payment to a sale, validate against that sale's outstanding balance
    if (activeSale && amountPaidGBP > activeSale.outstandingBalanceGBP) {
      setError(`Payment amount (£${amountPaidGBP.toFixed(2)}) cannot exceed the outstanding balance of £${activeSale.outstandingBalanceGBP.toFixed(2)}.`);
      return;
    }

    // If editing a payment, the validation might be different (e.g. relative to original sale state if not refetched)
    // For simplicity, current validation assumes outstandingBalance is always fresh from activeSale.

    setLoading(true);
    try {
      if (payment) { // Update existing payment
        await paymentApi.update(payment.id, {
          amountPaidGBP,
          paymentDate: paymentDate + 'T00:00:00Z',
          paymentMethod,
          reference: reference || undefined,
          notes: notes || undefined,
          paymentType: paymentType || undefined,
        });
        // For updates, ensure the related sale is refreshed
        if (payment.saleId) {
            const updatedSaleData = await saleApi.getById(payment.saleId);
            setSales((prev: Sale[]) => prev.map((s: Sale) => s.id === payment.saleId ? updatedSaleData : s));
        } else {
            // Fallback to refreshing all sales if saleId isn't directly on payment (should be)
            const allSales = await saleApi.getAll();
            setSales(allSales);
        }
        // Also refresh the payments list if you have a separate view for them
        const updatedPayments = await paymentApi.getAll(); // Assuming you might want this
        setPayments(updatedPayments);

      } else if (activeSale) { // Create new payment for the activeSale
        const newPayment = await paymentApi.create({
          saleId: activeSale.id,
          amountPaidGBP,
          paymentDate: paymentDate + 'T00:00:00Z',
          paymentMethod,
          reference: reference || undefined,
          notes: notes || undefined,
          paymentType: paymentType || undefined,
        });
        addPayment(newPayment); // Update local Zustand store for payments

        // Fetch the specific sale that was paid against to get its updated totals
        const updatedSaleData = await saleApi.getById(activeSale.id);
        setSales((prev: Sale[]) => prev.map((s: Sale) => s.id === activeSale.id ? updatedSaleData : s));
      }
      onClose(); // Close form on success
    } catch (err: any) {
      console.error('Error saving payment:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save payment. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const getPaymentMethodText = (methodValue: PaymentMethod) => {
    const found = paymentMethods.find(pm => pm.value === methodValue);
    return found ? found.text : PaymentMethod[methodValue] || 'Unknown';
  };

  if (!isOpen) return null;

  // Determine which sale object to use for display (prefer local fresh state)
  const displaySale = currentSaleForForm || initialSale;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050, overflowY: 'auto', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', margin: 'auto', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="h5 mb-0">{payment ? 'Edit Payment' : 'Add Payment'}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }}><XMarkIcon style={{ width: '24px', height: '24px' }} /></button>
          </div>

          {error && (
            <div className="card mb-3" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
              <div className="card-body py-3"><p className="small mb-0" style={{ color: '#991b1b' }}>{error}</p></div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Sale Information - Use displaySale for freshest data */}
            {displaySale && (
              <div className="card mb-4" style={{ backgroundColor: '#f0f9ff', borderColor: '#0369a1' }}>
                <div className="card-body">
                  <h6 className="h6 mb-3" style={{ color: '#0369a1' }}>Sale Information</h6>
                  <div className="row">
                    <div className="col-md-6"><strong>Customer:</strong> {displaySale.customerName}</div>
                    <div className="col-md-6"><strong>Sale Total:</strong> {formatCurrency(displaySale.totalAmountGBP)}</div>
                    <div className="col-md-6"><strong>Already Paid:</strong> {formatCurrency(displaySale.totalPaidGBP)}</div>
                    <div className="col-md-6"><strong>Outstanding:</strong> <span style={{ color: '#ea580c', fontWeight: 'bold' }}>{formatCurrency(displaySale.outstandingBalanceGBP)}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Payment Amount *</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRight: 'none', padding: '0.375rem 0.75rem', borderRadius: '0.375rem 0 0 0.375rem', fontSize: '0.875rem', color: '#475569' }}>£</span>
                  <input type="number" step="0.01" className="form-control" value={amountPaidGBP} onChange={(e) => setAmountPaidGBP(Number(e.target.value))} min="0.01" max={displaySale ? displaySale.outstandingBalanceGBP : undefined} required style={{ borderRadius: '0 0.375rem 0.375rem 0', borderLeft: 'none' }} />
                </div>
                {displaySale && amountPaidGBP > 0 && (
                  <div className="small mt-1" style={{ color: '#64748b' }}>
                    Remaining after this payment: {formatCurrency(displaySale.outstandingBalanceGBP - amountPaidGBP)}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Date *</label>
                <input type="date" className="form-control" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Payment Method *</label>
                <select className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(Number(e.target.value) as PaymentMethod)} required>
                  {paymentMethods.map((method) => (<option key={method.value} value={method.value}>{method.text}</option>))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Type</label>
                <select className="form-control" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                  <option value="">Select type (optional)...</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Partial">Partial Payment</option>
                  <option value="Full">Full Payment</option>
                  <option value="Final">Final Payment</option>
                  {/* <option value="Refund">Refund</option> Consider if refunds affect paid amount differently */}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Reference</label>
              <input type="text" className="form-control" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Transaction ID, cheque no., etc." />
            </div>

            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optional notes for this payment" style={{ resize: 'vertical' }} />
            </div>

            {/* Payment Summary (Optional, can be removed if too much detail) */}
            {amountPaidGBP > 0 && (
              <div className="card mb-4" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}>
                <div className="card-body">
                  <h6 className="h6 mb-3" style={{ color: '#16a34a' }}>Payment Summary</h6>
                  <div className="d-flex justify-content-between mb-1"><span>Payment Amount:</span><strong style={{ color: '#374151' }}>{formatCurrency(amountPaidGBP)}</strong></div>
                  <div className="d-flex justify-content-between mb-1"><span>Payment Method:</span><span style={{ color: '#374151' }}>{getPaymentMethodText(paymentMethod)}</span></div>
                  {paymentType && (<div className="d-flex justify-content-between"><span>Payment Type:</span><span style={{ color: '#374151' }}>{paymentType}</span></div>)}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" onClick={onClose} className="btn" style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '0.375rem', padding: '0.5rem 1rem' }}>Cancel</button>
              <button type="submit" className="btn" disabled={amountPaidGBP <= 0 || (displaySale && amountPaidGBP > displaySale.outstandingBalanceGBP)} style={{ backgroundColor: (amountPaidGBP <= 0 || (displaySale && amountPaidGBP > displaySale.outstandingBalanceGBP)) ? '#e2e8f0' : '#16a34a', color: (amountPaidGBP <= 0 || (displaySale && amountPaidGBP > displaySale.outstandingBalanceGBP)) ? '#94a3b8' : 'white', border: 'none', borderRadius: '0.375rem', padding: '0.5rem 1rem', cursor: (amountPaidGBP <= 0 || (displaySale && amountPaidGBP > displaySale.outstandingBalanceGBP)) ? 'not-allowed' : 'pointer' }}>
                {payment ? 'Update Payment' : 'Record Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 