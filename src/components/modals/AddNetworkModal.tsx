import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { useProjectStore } from '../../store/projectStore';

interface AddNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const AddNetworkModal: React.FC<AddNetworkModalProps> = ({ isOpen, onClose, projectId }) => {
  const [name, setName] = useState('');
  const [subnets, setSubnets] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addNetwork } = useProjectStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Network name is required';
    if (!subnets.trim()) newErrors.subnets = 'At least one subnet is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Split subnets by commas or new lines and trim whitespace
      const subnetList = subnets
        .split(/[,\n]/)
        .map(subnet => subnet.trim())
        .filter(subnet => subnet.length > 0);
      
      addNetwork(projectId, {
        name,
        subnets: subnetList,
      });
      
      toast.success('Network added successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to add network');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSubnets('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Network">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="network-name" className="block text-sm font-medium text-gray-700">
              Network Name *
            </label>
            <input
              type="text"
              id="network-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="e.g., Production VPC"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="subnets" className="block text-sm font-medium text-gray-700">
              Subnets * (one per line or comma-separated)
            </label>
            <textarea
              id="subnets"
              value={subnets}
              onChange={(e) => setSubnets(e.target.value)}
              rows={3}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.subnets ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="e.g., 10.0.0.0/24, 10.0.1.0/24"
            />
            {errors.subnets && <p className="mt-1 text-sm text-red-600">{errors.subnets}</p>}
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
            {isSubmitting ? 'Adding...' : 'Add Network'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddNetworkModal; 