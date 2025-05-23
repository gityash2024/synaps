import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { useProjectStore } from '../../store/projectStore';

interface AddDiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const AddDiskModal: React.FC<AddDiskModalProps> = ({ isOpen, onClose, projectId }) => {
  const [name, setName] = useState('');
  const [size, setSize] = useState(100);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addDataDisk } = useProjectStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Disk name is required';
    if (size < 10) newErrors.size = 'Disk size must be at least 10 GB';
    if (size > 2000) newErrors.size = 'Disk size cannot exceed 2000 GB';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      addDataDisk(projectId, {
        name,
        size
      });
      
      toast.success('Disk added successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to add disk');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSize(100);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Data Disk">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="disk-name" className="block text-sm font-medium text-gray-700">
              Disk Name *
            </label>
            <input
              type="text"
              id="disk-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="e.g., database-storage"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="disk-size" className="block text-sm font-medium text-gray-700">
              Disk Size (GB) *
            </label>
            <input
              type="number"
              id="disk-size"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10) || 0)}
              min="10"
              max="2000"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.size ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal font-montserrat"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-darkBlue bg-primary-mint hover:bg-primary-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-colors font-montserrat ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add Disk'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDiskModal; 