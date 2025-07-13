import React from 'react';

type Props = {
  onClose: () => void;
  onSubmit: (formData: {
    category_id: string;
    amount: number;
    date: string;
    description?: string;
    is_recurring: boolean;
  }) => void;
};

const AddExpenseModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      category_id: formData.get('category') as string,
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      is_recurring: formData.get('is_recurring') === 'on',
    };

    onSubmit(data);
    form.reset();
  };

  // New handler for clicks on overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // Click was on the overlay, not inside the modal form
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}  // <-- add this here
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#fff',
          padding: 24,
          borderRadius: 12,
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ color: '#4f46e5', marginBottom: 8 }}>Add Expense</h2>
        <input name="category" placeholder="Category ID" required style={{ padding: 8, backgroundColor: '#fff', color: '#000' }} />
        <input name="amount" type="number" step="0.01" placeholder="Amount" required style={{ padding: 8, backgroundColor: '#fff', color: '#000' }} />
        <input name="date" type="date" required style={{ padding: 8, backgroundColor: '#fff', color: '#000' }} />
        <input name="description" placeholder="Description (optional)" style={{ padding: 8, backgroundColor: '#fff', color: '#000' }} />
        <label style={{ fontSize: 14, color: '#000', backgroundColor: '#fff'}}>
          <input name="is_recurring" type="checkbox" /> Recurring
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#6c63ff',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 8,
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseModal;
