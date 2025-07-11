import React, { useState } from 'react';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncome: (income: { date: string; source: string; amount: number; is_recurring: boolean }) => void;
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onAddIncome }) => {
  const [date, setDate] = useState('');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [isRecurring, setIsRecurring] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !source || amount === '') {
      alert('Please fill out all fields');
      return;
    }
    onAddIncome({ date, source, amount: Number(amount), is_recurring: isRecurring });
    setDate('');
    setSource('');
    setAmount('');
    setIsRecurring(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: '24px',
          width: '320px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ color: '#6c63ff', marginBottom: 16 }}>Add Income</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 8, color:'#000' }}>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc', backgroundColor:'#fff', color: '#000' }}
              required
            />
          </label>
          <label style={{ display: 'block', marginBottom: 8, color:'#000'  }}>
            Source:
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Salary, Freelance"
              style={{ width: '100%', padding: '8px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc', backgroundColor:'#fff', color:'#000' }}
              required
            />
          </label>
          <label style={{ display: 'block', marginBottom: 16, color:'#000'  }}>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0"
              min="0"
              step="0.01"
              style={{ width: '100%', padding: '8px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc', backgroundColor:'#fff', color:'#000' }}
              required
            />
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 24,
              fontWeight: '500',
              cursor: 'pointer',
              color:'#000' 
            }}
          >
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              style={{ cursor: 'pointer', color:'#000', backgroundColor:'#fff' }}
            />
            Recurring
          </label>
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
            Add Income
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeModal;
