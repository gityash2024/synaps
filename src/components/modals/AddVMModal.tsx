import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { useProjectStore, Network, OSType } from '../../store/projectStore';

interface AddVMModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  networks: Network[];
}

const cpuOptions = ['1 vCPU', '2 vCPU', '4 vCPU', '8 vCPU', '16 vCPU'];
const ramOptions = ['2 GB', '4 GB', '8 GB', '16 GB', '32 GB', '64 GB'];

const AddVMModal: React.FC<AddVMModalProps> = ({ isOpen, onClose, projectId, networks }) => {
  const [name, setName] = useState('');
  const [networkId, setNetworkId] = useState(networks.length > 0 ? networks[0].id : '');
  const [diskSize, setDiskSize] = useState(50);
  const [os, setOs] = useState<OSType>('Ubuntu');
  const [cpu, setCpu] = useState(cpuOptions[1]); // Default to 2 vCPU
  const [ram, setRam] = useState(ramOptions[1]); // Default to 4 GB
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addVirtualMachine } = useProjectStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'VM name is required';
    if (!networkId) newErrors.networkId = 'Network is required';
    if (diskSize < 10) newErrors.diskSize = 'Disk size must be at least 10 GB';
    if (diskSize > 1000) newErrors.diskSize = 'Disk size cannot exceed 1000 GB';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      addVirtualMachine(projectId, {
        name,
        networkId,
        diskSize,
        os,
        cpu,
        ram,
        status: 'Pending',
        type: `${os === 'Ubuntu' ? 'Linux' : 'Windows'} Server`,
      });
      
      toast.success('Virtual machine deployment initiated!');
      handleClose();
    } catch (error) {
      toast.error('Failed to deploy virtual machine');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    if (networks.length > 0) {
      setNetworkId(networks[0].id);
    }
    setDiskSize(50);
    setOs('Ubuntu');
    setCpu(cpuOptions[1]);
    setRam(ramOptions[1]);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Deploy Virtual Machine">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="vm-name" className="block text-sm font-medium text-gray-700">
              VM Name *
            </label>
            <input
              type="text"
              id="vm-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="e.g., web-server-1"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="network" className="block text-sm font-medium text-gray-700">
              Network *
            </label>
            <select
              id="network"
              value={networkId}
              onChange={(e) => setNetworkId(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.networkId ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            >
              {networks.length > 0 ? (
                networks.map((network) => (
                  <option key={network.id} value={network.id}>
                    {network.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No networks available. Please create a network first.
                </option>
              )}
            </select>
            {errors.networkId && <p className="mt-1 text-sm text-red-600">{errors.networkId}</p>}
          </div>

          <div>
            <label htmlFor="os" className="block text-sm font-medium text-gray-700">
              Operating System *
            </label>
            <select
              id="os"
              value={os}
              onChange={(e) => setOs(e.target.value as OSType)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Ubuntu">Ubuntu</option>
              <option value="Windows Server">Windows Server</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cpu" className="block text-sm font-medium text-gray-700">
                CPU *
              </label>
              <select
                id="cpu"
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {cpuOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ram" className="block text-sm font-medium text-gray-700">
                RAM *
              </label>
              <select
                id="ram"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {ramOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="disk-size" className="block text-sm font-medium text-gray-700">
              Disk Size (GB) *
            </label>
            <input
              type="number"
              id="disk-size"
              value={diskSize}
              onChange={(e) => setDiskSize(parseInt(e.target.value, 10) || 0)}
              min="10"
              max="1000"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.diskSize ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.diskSize && <p className="mt-1 text-sm text-red-600">{errors.diskSize}</p>}
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
            disabled={isSubmitting || networks.length === 0}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (isSubmitting || networks.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Deploying...' : 'Deploy VM'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVMModal; 