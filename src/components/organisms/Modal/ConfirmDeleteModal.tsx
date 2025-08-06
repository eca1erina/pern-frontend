import React, { useEffect, useState } from 'react';
import './AddIncomeModal.css';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemDescription?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemDescription = 'this',
}) => {
  const [show, setShow] = useState(isOpen);
  const [animateOut, setAnimateOut] = useState(false);

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

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setShow(false);
      onClose();
    }, 350);
  };

  const handleOverlayClick = () => handleClose();

  return (
    <div
      className={`modal-overlay${animateOut ? ' modal-overlay-exit' : ' modal-overlay-enter'}`}
      onClick={handleOverlayClick}
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
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M6 6L16 16M16 6L6 16"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="modal-title">Confirm Deletion</h2>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
          Are you sure you want to delete {itemDescription}?
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={handleClose}
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              backgroundColor: '#e5e7eb',
              color: '#333',
              border: 'none',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              handleClose();
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
