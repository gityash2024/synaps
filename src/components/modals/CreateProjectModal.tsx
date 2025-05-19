import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { useProjectStore, Platform } from '../../store/projectStore';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('AWS');
  const [billingOrganization, setBillingOrganization] = useState('');
  const [owner, setOwner] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { addProject } = useProjectStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Project name is required';
    if (!platform) newErrors.platform = 'Platform is required';
    if (!billingOrganization.trim()) newErrors.billingOrganization = 'Billing organization is required';
    if (!owner.trim()) newErrors.owner = 'Owner is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      addProject({
        name,
        platform,
        billingOrganization,
        owner,
        description,
        status: 'Active',
      });
      
      toast.success('Project created successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to create project');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setPlatform('AWS');
    setBillingOrganization('');
    setOwner('');
    setDescription('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
              Platform *
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.platform ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            >
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="Private Cloud">Private Cloud</option>
              <option value="VMware">VMware</option>
            </select>
            {errors.platform && <p className="mt-1 text-sm text-red-600">{errors.platform}</p>}
          </div>

          <div>
            <label htmlFor="billing" className="block text-sm font-medium text-gray-700">
              Billing Organization *
            </label>
            <input
              type="text"
              id="billing"
              value={billingOrganization}
              onChange={(e) => setBillingOrganization(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.billingOrganization ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.billingOrganization && <p className="mt-1 text-sm text-red-600">{errors.billingOrganization}</p>}
          </div>

          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
              Owner *
            </label>
            <input
              type="text"
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.owner ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.owner && <p className="mt-1 text-sm text-red-600">{errors.owner}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal; 