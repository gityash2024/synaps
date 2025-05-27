import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';
import AddNetworkModal from './AddNetworkModal';
import AddVMModal from './AddVMModal';
import AddDiskModal from './AddDiskModal';
import { useProjectStore } from '../../store/projectStore';

// Icons
import { 
  ServerIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  ArchiveBoxIcon,
  CircleStackIcon, 
  DocumentDuplicateIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface ServiceCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

// Service catalog data
const catalogData = [
  {
    id: 'compute',
    name: 'Compute',
    icon: <ServerIcon className="w-6 h-6 text-primary-mint" />,
    resources: [
      { id: 'vm', name: 'Virtual Machine', description: 'Deploy a new virtual machine', icon: <ServerIcon className="w-5 h-5" /> }
    ]
  },
  {
    id: 'network',
    name: 'Network',
    icon: <GlobeAltIcon className="w-6 h-6 text-primary-mint" />,
    resources: [
      { id: 'network', name: 'Network', description: 'Create a new virtual network', icon: <GlobeAltIcon className="w-5 h-5" /> }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    icon: <ShieldCheckIcon className="w-6 h-6 text-primary-mint" />,
    resources: [
      { id: 'firewall', name: 'Firewall', description: 'Set up firewall rules', icon: <ShieldCheckIcon className="w-5 h-5" /> }
    ]
  },
  {
    id: 'backup',
    name: 'Backup',
    icon: <ArchiveBoxIcon className="w-6 h-6 text-primary-mint" />,
    resources: [
      { id: 'backup', name: 'Backup Policy', description: 'Configure backup policies', icon: <ArchiveBoxIcon className="w-5 h-5" /> }
    ]
  },
  {
    id: 'database',
    name: 'Database',
    icon: <CircleStackIcon className="w-6 h-6 text-primary-mint" />,
    resources: [
      { id: 'db', name: 'Database', description: 'Deploy a new database', icon: <CircleStackIcon className="w-5 h-5" /> }
    ]
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: <DocumentDuplicateIcon className="w-6 h-6 text-primary-mint" />,
    resources: [
      { id: 'disk', name: 'Data Disk', description: 'Add a new data disk', icon: <DocumentDuplicateIcon className="w-5 h-5" /> }
    ]
  }
];

const ServiceCatalogModal: React.FC<ServiceCatalogModalProps> = ({ isOpen, onClose, projectId }) => {
  const { projects } = useProjectStore();
  const project = projects.find(p => p.id === projectId);
  const networks = project?.networks || [];
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAddNetworkModal, setShowAddNetworkModal] = useState(false);
  const [showAddVMModal, setShowAddVMModal] = useState(false);
  const [showAddDiskModal, setShowAddDiskModal] = useState(false);

  const selectedCategoryData = catalogData.find(cat => cat.id === selectedCategory);

  const handleResourceClick = (categoryId: string, resourceId: string) => {
    switch (resourceId) {
      case 'network':
        setShowAddNetworkModal(true);
        onClose();
        break;
      case 'vm':
        setShowAddVMModal(true);
        onClose();
        break;
      case 'disk':
        setShowAddDiskModal(true);
        onClose();
        break;
      default:
        toast.info('This resource is coming soon!');
        break;
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Service Catalog" size="lg">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Service Category Dropdown */}
            <div>
              <label htmlFor="service-category" className="block text-sm font-medium text-gray-700 mb-2">
                Select Service Category
              </label>
              <select
                id="service-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-teal focus:border-primary-teal"
              >
                <option value="">Choose a service category...</option>
                {catalogData.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Right side - Available Resources */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Resources
              </label>
              <div className="border border-gray-200 rounded-md min-h-[200px] p-4">
                {selectedCategoryData ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 mb-4">
                      {selectedCategoryData.icon}
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedCategoryData.name} Resources
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {selectedCategoryData.resources.map(resource => (
                        <div 
                          key={resource.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-mint hover:bg-mint-50 cursor-pointer transition-colors"
                          onClick={() => handleResourceClick(selectedCategory, resource.id)}
                        >
                          <div className="flex items-center space-x-3">
                            {resource.icon}
                            <div>
                              <h4 className="font-medium text-gray-900">{resource.name}</h4>
                              <p className="text-sm text-gray-500">{resource.description}</p>
                            </div>
                          </div>
                          <PlusIcon className="w-5 h-5 text-gray-400 hover:text-primary-mint" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      Select a service category to view available resources
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <AddNetworkModal 
        isOpen={showAddNetworkModal}
        onClose={() => setShowAddNetworkModal(false)}
        projectId={projectId}
      />

      <AddVMModal
        isOpen={showAddVMModal}
        onClose={() => setShowAddVMModal(false)}
        projectId={projectId}
        networks={networks}
      />

      <AddDiskModal
        isOpen={showAddDiskModal}
        onClose={() => setShowAddDiskModal(false)}
        projectId={projectId}
      />
    </>
  );
};

export default ServiceCatalogModal;