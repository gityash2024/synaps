import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { useProjectStore, Platform, mockPlatforms, mockRegions, ProjectType } from '../../store/projectStore';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('AWS');
  const [region, setRegion] = useState<string>('');
  const [projectType, setProjectType] = useState<ProjectType>('default');
  const [billingOrganization, setBillingOrganization] = useState('');
  const [owner, setOwner] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Available regions for selected platform
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  
  // Update regions when platform changes
  useEffect(() => {
    if (platform && mockRegions[platform]) {
      const regions = mockRegions[platform];
      setAvailableRegions(regions);
      setRegion(regions[0]);
    } else {
      setAvailableRegions([]);
      setRegion('');
    }
  }, [platform]);

  const { addProject } = useProjectStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Project name is required';
    if (!platform) newErrors.platform = 'Platform is required';
    if (!region) newErrors.region = 'Region is required';
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
        region,
        projectType,
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
    setRegion('');
    setProjectType('default');
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-montserrat">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal sm:text-sm`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 font-montserrat">
              Platform *
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.platform ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal sm:text-sm`}
            >
              {mockPlatforms.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.platform && <p className="mt-1 text-sm text-red-600">{errors.platform}</p>}
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 font-montserrat">
              Region *
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.region ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal sm:text-sm`}
              disabled={availableRegions.length === 0}
            >
              {availableRegions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
          </div>

          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 font-montserrat">
              Project Type
            </label>
            <select
              id="projectType"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal sm:text-sm"
            >
              <option value="default">Default</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label htmlFor="billing" className="block text-sm font-medium text-gray-700 font-montserrat">
              Billing Organization *
            </label>
            <input
              type="text"
              id="billing"
              value={billingOrganization}
              onChange={(e) => setBillingOrganization(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.billingOrganization ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal sm:text-sm`}
            />
            {errors.billingOrganization && <p className="mt-1 text-sm text-red-600">{errors.billingOrganization}</p>}
          </div>

          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-gray-700 font-montserrat">
              Owner *
            </label>
            <input
              type="text"
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.owner ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal sm:text-sm`}
            />
            {errors.owner && <p className="mt-1 text-sm text-red-600">{errors.owner}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 font-montserrat">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal sm:text-sm"
            />
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
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal; 