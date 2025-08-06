import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddIncomeModal.css';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncome: (income: {
    date: string;
    source: string;
    amount: number;
    is_recurring: boolean;
  }) => void;
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onAddIncome }) => {
  const [date, setDate] = useState<Date | null>(null);
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [show, setShow] = useState(isOpen);
  const [animateOut, setAnimateOut] = useState(false);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimateOut(false);
    } else if (show) {
      setAnimateOut(true);
      const timeout = setTimeout(() => setShow(false), 350);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !source || amount === '') {
      alert('Please fill out all fields');
      return;
    }
    onAddIncome({
      date: date.toISOString().split('T')[0],
      source: capitalizeFirstLetter(source.trim()),
      amount: Number(amount),
      is_recurring: isRecurring,
    });
    setDate(null);
    setSource('');
    setAmount('');
    setIsRecurring(false);
    onClose();
  };

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setShow(false);
      onClose();
    }, 350);
  };

  return (
    <div
      className={`modal-overlay${animateOut ? ' modal-overlay-exit' : ' modal-overlay-enter'}`}
      onClick={handleClose}
    >
      <div
        className={`modal-card${animateOut ? ' modal-card-exit' : ' modal-card-enter'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          aria-label="Close modal"
          type="button"
          onClick={handleClose}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 6L16 16M16 6L6 16"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h2 className="modal-title">Add Income</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label" style={{ position: 'relative' }}>
            Date:
            <div className="modal-datepicker-wrapper">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="MM/dd/yyyy"
                placeholderText="mm/dd/yyyy"
                className="modal-input modal-datepicker-input"
                calendarClassName="modal-datepicker-calendar"
                popperClassName="modal-datepicker-popper"
                showPopperArrow={false}
              />
              <span className="modal-datepicker-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="5"
                    width="14"
                    height="12"
                    rx="3"
                    stroke="#a18aff"
                    strokeWidth="1.5"
                  />
                  <path d="M7 3V6" stroke="#a18aff" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M13 3V6" stroke="#a18aff" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="7" y="9" width="2" height="2" rx="1" fill="#a18aff" />
                </svg>
              </span>
            </div>
          </label>
          <label className="modal-label">
            Source:
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Salary, Freelance"
              className="modal-input"
              required
            />
          </label>
          <label className="modal-label">
            Amount ($):
            <div className="modal-number-input-wrapper">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                min="0"
                step="0.01"
                className="modal-input modal-number-input"
                required
              />
              <div className="modal-number-btns">
                <button
                  type="button"
                  className="modal-number-btn modal-number-btn-up"
                  tabIndex={-1}
                  onClick={() => setAmount((prev) => (prev === '' ? 1 : Number(prev) + 1))}
                  aria-label="Increment"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 9l4-4 4 4"
                      stroke="#a18aff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="modal-number-btn modal-number-btn-down"
                  tabIndex={-1}
                  onClick={() =>
                    setAmount((prev) => (prev === '' ? 0 : Math.max(0, Number(prev) - 1)))
                  }
                  aria-label="Decrement"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 7l4 4 4-4"
                      stroke="#a18aff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </label>
          <label className="modal-checkbox-label">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="modal-checkbox"
            />
            <span className="custom-checkbox" aria-hidden="true"></span>
            Recurring
          </label>
          <button type="submit" className="modal-submit-btn">
            <span className="modal-btn-text">Add Income</span>
            <span className="modal-btn-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 10.5L9 14.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeModal;
