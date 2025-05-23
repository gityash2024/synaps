import React from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonClass = 'bg-primary-mint hover:bg-primary-teal'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="py-3">
        <p className="text-gray-700">{message}</p>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal font-montserrat"
        >
          {cancelButtonText}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${confirmButtonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-colors font-montserrat`}
        >
          {confirmButtonText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal; 