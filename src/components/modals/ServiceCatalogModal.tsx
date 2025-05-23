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

// Mock catalog data
const catalogData = [
  {
    id: 'compute',
    name: 'Compute',
    icon: <ServerIcon className="w-8 h-8 text-primary-mint" />,
    resources: [
      { id: 'vm', name: 'Virtual Machine', description: 'Deploy a new virtual machine', icon: <ServerIcon className="w-6 h-6" /> }
    ]
  },
  {
    id: 'network',
    name: 'Network',
    icon: <GlobeAltIcon className="w-8 h-8 text-primary-mint" />,
    resources: [
      { id: 'network', name: 'Network', description: 'Create a new virtual network', icon: <GlobeAltIcon className="w-6 h-6" /> }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    icon: <ShieldCheckIcon className="w-8 h-8 text-primary-mint" />,
    resources: [
      { id: 'firewall', name: 'Firewall', description: 'Set up firewall rules', icon: <ShieldCheckIcon className="w-6 h-6" /> }
    ]
  },
  {
    id: 'backup',
    name: 'Backup',
    icon: <ArchiveBoxIcon className="w-8 h-8 text-primary-mint" />,
    resources: [
      { id: 'backup', name: 'Backup Policy', description: 'Configure backup policies', icon: <ArchiveBoxIcon className="w-6 h-6" /> }
    ]
  },
  {
    id: 'database',
    name: 'Database',
    icon: <CircleStackIcon className="w-8 h-8 text-primary-mint" />,
    resources: [
      { id: 'db', name: 'Database', description: 'Deploy a new database', icon: <CircleStackIcon className="w-6 h-6" /> }
    ]
  },
  {
    id: 'storage',
    name: 'Storage',
    icon: <DocumentDuplicateIcon className="w-8 h-8 text-primary-mint" />,
    resources: [
      { id: 'disk', name: 'Data Disk', description: 'Add a new data disk', icon: <DocumentDuplicateIcon className="w-6 h-6" /> }
    ]
  }
];

const ServiceCatalogModal: React.FC<ServiceCatalogModalProps> = ({ isOpen, onClose, projectId }) => {
  const { projects } = useProjectStore();
  const project = projects.find(p => p.id === projectId);
  const networks = project?.networks || [];
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddNetworkModal, setShowAddNetworkModal] = useState(false);
  const [showAddVMModal, setShowAddVMModal] = useState(false);
  const [showAddDiskModal, setShowAddDiskModal] = useState(false);

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
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {catalogData.map(category => (
              <div 
                key={category.id} 
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${selectedCategory === category.id ? 'border-primary-mint bg-mint-50' : 'border-gray-200'}`}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              >
                <div className="flex items-center space-x-3">
                  {category.icon}
                  <span className="text-lg font-medium">{category.name}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedCategory && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">
                {catalogData.find(c => c.id === selectedCategory)?.name} Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catalogData.find(c => c.id === selectedCategory)?.resources.map(resource => (
                  <div 
                    key={resource.id}
                    className="flex p-4 border border-gray-200 rounded-lg hover:border-primary-mint hover:bg-mint-50 cursor-pointer transition-colors"
                    onClick={() => handleResourceClick(selectedCategory, resource.id)}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {resource.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{resource.name}</h4>
                      <p className="text-sm text-gray-500">{resource.description}</p>
                    </div>
                    <div className="ml-auto self-center">
                      <PlusIcon className="w-5 h-5 text-gray-400 hover:text-primary-mint" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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