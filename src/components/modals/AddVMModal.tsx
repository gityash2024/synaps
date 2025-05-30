import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { useProjectStore } from '../../store/projectStore';

interface AddVMModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const AddVMModal: React.FC<AddVMModalProps> = ({ isOpen, onClose, projectId }) => {
  const { addVirtualMachine, loadVMSizes, loadOSList, loadSubnets, loadSecurityGroups, vmSizes, osList, subnets, securityGroups, projects } = useProjectStore();
  
  // Get current project to find platform and region
  const currentProject = projects.find(p => p.id === projectId);
  const platformId = currentProject?.platformId;
  const regionId = currentProject?.regionId;

  const [name, setName] = useState('');
  const [subnetId, setSubnetId] = useState('');
  const [securityGroupId, setSecurityGroupId] = useState('');
  const [publicIp, setPublicIp] = useState(true);
  const [enableDataDisk, setEnableDataDisk] = useState(false);
  const [diskSize, setDiskSize] = useState(50);
  const [osId, setOsId] = useState('');
  const [instanceTypeId, setInstanceTypeId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load VM sizes, OS list, subnets, and security groups when modal opens
  useEffect(() => {
    if (isOpen && platformId && regionId) {
      loadVMSizes(platformId);
      loadOSList(platformId);
      loadSubnets(platformId, regionId);
      loadSecurityGroups(platformId, regionId);
    }
  }, [isOpen, platformId, regionId, loadVMSizes, loadOSList, loadSubnets, loadSecurityGroups]);

  // Set default values when data loads
  useEffect(() => {
    if (vmSizes.length > 0 && !instanceTypeId) {
      setInstanceTypeId(vmSizes[0].id);
    }
  }, [vmSizes, instanceTypeId]);

  useEffect(() => {
    if (osList.length > 0 && !osId) {
      setOsId(osList[0].id);
    }
  }, [osList, osId]);

  useEffect(() => {
    if (subnets.length > 0 && !subnetId) {
      setSubnetId(subnets[0].id);
    }
  }, [subnets, subnetId]);

  useEffect(() => {
    if (securityGroups.length > 0 && !securityGroupId) {
      setSecurityGroupId(securityGroups[0].id);
    }
  }, [securityGroups, securityGroupId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'VM name is required';
    if (!subnetId) newErrors.subnetId = 'Subnet is required';
    if (!instanceTypeId) newErrors.instanceTypeId = 'Instance type is required';
    if (!osId) newErrors.osId = 'Operating system is required';
    if (enableDataDisk) {
      if (diskSize < 10) newErrors.diskSize = 'Disk size must be at least 10 GB';
      if (diskSize > 1000) newErrors.diskSize = 'Disk size cannot exceed 1000 GB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Find selected OS and instance type for display
      const selectedOS = osList.find(os => os.id === osId);
      const selectedInstanceType = vmSizes.find(vm => vm.id === instanceTypeId);
      
      // Prepare VM configuration with dynamic values
      const vmConfig = {
        instanceTypeId,
        osId,
        publicIp: publicIp ? 'true' : 'false',
        dataDisk: enableDataDisk ? 'true' : 'false',
        dataDiskSize: enableDataDisk ? diskSize.toString() : '0',
        subnetId,
        securityGroupId,
      };
      
      await addVirtualMachine(projectId, {
        name,
        networkId: subnetId, // Use subnet ID as network ID for compatibility
        diskSize: enableDataDisk ? diskSize : 0,
        os: selectedOS?.type === 'linux' ? 'Ubuntu' : 'Windows Server',
        cpu: selectedInstanceType?.Display_name || '2 vCPU',
        ram: '4 GB', // Default, could be parsed from Display_name
        status: 'Pending',
        type: selectedInstanceType?.value || 'Unknown',
      }, vmConfig);
      
      toast.success('Virtual machine deployment initiated!');
      handleClose();
    } catch (error) {
      toast.error('Failed to deploy virtual machine');
      console.error('VM deployment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSubnetId('');
    setSecurityGroupId('');
    setPublicIp(true);
    setEnableDataDisk(false);
    setDiskSize(50);
    setOsId('');
    setInstanceTypeId('');
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
            <label htmlFor="subnet" className="block text-sm font-medium text-gray-700">
              Subnet *
            </label>
            <select
              id="subnet"
              value={subnetId}
              onChange={(e) => setSubnetId(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.subnetId ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            >
              <option value="">Select subnet...</option>
              {subnets.map((subnet) => (
                <option key={subnet.id} value={subnet.id}>
                  {subnet.name}
                </option>
              ))}
            </select>
            {errors.subnetId && <p className="mt-1 text-sm text-red-600">{errors.subnetId}</p>}
            {platformId && regionId && subnets.length === 0 && (
              <p className="mt-1 text-sm text-gray-500">Loading subnets...</p>
            )}
          </div>

          <div>
            <label htmlFor="security-group" className="block text-sm font-medium text-gray-700">
              Security Group
            </label>
            <select
              id="security-group"
              value={securityGroupId}
              onChange={(e) => setSecurityGroupId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={securityGroups.length === 0}
            >
              <option value="">Select security group...</option>
              {securityGroups.map((sg) => (
                <option key={sg.id} value={sg.id}>
                  {sg.name}
                </option>
              ))}
            </select>
            {platformId && regionId && securityGroups.length === 0 && (
              <p className="mt-1 text-sm text-gray-500">Loading security groups...</p>
            )}
          </div>

          <div>
            <label htmlFor="os" className="block text-sm font-medium text-gray-700">
              Operating System *
            </label>
            <select
              id="os"
              value={osId}
              onChange={(e) => setOsId(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.osId ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              disabled={osList.length === 0}
            >
              <option value="">Select operating system...</option>
              {osList.map((os) => (
                <option key={os.id} value={os.id}>
                  {os.Display_name}
                </option>
              ))}
            </select>
            {errors.osId && <p className="mt-1 text-sm text-red-600">{errors.osId}</p>}
            {platformId && osList.length === 0 && (
              <p className="mt-1 text-sm text-gray-500">Loading operating systems...</p>
            )}
          </div>

          <div>
            <label htmlFor="instance-type" className="block text-sm font-medium text-gray-700">
              Instance Type *
            </label>
            <select
              id="instance-type"
              value={instanceTypeId}
              onChange={(e) => setInstanceTypeId(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.instanceTypeId ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              disabled={vmSizes.length === 0}
            >
              <option value="">Select instance type...</option>
              {vmSizes.map((vmSize) => (
                <option key={vmSize.id} value={vmSize.id}>
                  {vmSize.Display_name}
                </option>
              ))}
            </select>
            {errors.instanceTypeId && <p className="mt-1 text-sm text-red-600">{errors.instanceTypeId}</p>}
            {platformId && vmSizes.length === 0 && (
              <p className="mt-1 text-sm text-gray-500">Loading instance types...</p>
            )}
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={publicIp}
                onChange={(e) => setPublicIp(e.target.checked)}
                className="rounded border-gray-300 text-primary-teal focus:ring-primary-teal mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Assign Public IP</span>
            </label>
            <p className="mt-1 text-xs text-gray-500">VM will be accessible from the internet when enabled</p>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enableDataDisk}
                onChange={(e) => setEnableDataDisk(e.target.checked)}
                className="rounded border-gray-300 text-primary-teal focus:ring-primary-teal mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Add Data Disk</span>
            </label>
            <p className="mt-1 text-xs text-gray-500">Additional storage disk for your applications and data</p>
          </div>

          {enableDataDisk && (
            <div>
              <label htmlFor="disk-size" className="block text-sm font-medium text-gray-700">
                Data Disk Size (GB) *
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
          )}
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
            disabled={isSubmitting || subnets.length === 0 || !instanceTypeId || !osId}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-darkBlue bg-primary-mint hover:bg-primary-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-colors font-montserrat ${
              (isSubmitting || subnets.length === 0 || !instanceTypeId || !osId) ? 'opacity-70 cursor-not-allowed' : ''
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