import React, { useState } from 'react';
import ExpensesList from '../components/ExpensesList';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseDetails from '../components/ExpenseDetails';
import { Expense } from '../store/useStore';

const ExpensesPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined);

  const handleAddClick = () => {
    setSelectedExpense(undefined);
    setShowAddModal(true);
  };

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowEditModal(true);
  };

  const handleViewClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowDetailsModal(true);
  };

  const handleEditFromDetails = () => {
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleSuccess = () => {
    // This will be called after successful form submission
  };

  return (
    <div className="container py-4">
      <ExpensesList
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onView={handleViewClick}
      />

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <ExpenseForm
              onClose={() => setShowAddModal(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditModal && selectedExpense && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <ExpenseForm
              expense={selectedExpense}
              onClose={() => setShowEditModal(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}

      {/* View Expense Details Modal */}
      {showDetailsModal && selectedExpense && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <ExpenseDetails
              expense={selectedExpense}
              onClose={() => setShowDetailsModal(false)}
              onEdit={handleEditFromDetails}
            />
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showAddModal || showEditModal || showDetailsModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default ExpensesPage;
