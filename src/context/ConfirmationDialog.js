import React from 'react';
import '../styles/components/ConfirmationDialog.css'; 

const ConfirmationDialog = ({ show, onConfirm, onCancel, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="confirmation-dialog-overlay">
      <div className="confirmation-dialog">
        <p>{message}</p>
        <div className="confirmation-dialog-actions">
          <button onClick={onConfirm} className="btn btn-danger">Confirm</button>
          <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
