import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore, Network, VirtualMachine, DataDisk } from '../store/projectStore';
import ServiceCatalogModal from '../components/modals/ServiceCatalogModal';
import { 
  PlusIcon, 
  ServerIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  ArchiveBoxIcon,
  CircleStackIcon, 
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colorMap: Record<string, string> = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  };

  const color = colorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
      {status}
    </span>
  );
};

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { setSelectedProject, selectedProject, removeResource } = useProjectStore();
  
  // Service Catalog Modal
  const [isServiceCatalogOpen, setIsServiceCatalogOpen] = useState(false);
  // Currently active tab
  const [activeTab, setActiveTab] = useState('network');

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId, setSelectedProject]);

  if (!selectedProject) {
    return (
      <div className="p-6 bg-white shadow rounded-lg">
        <p className="text-gray-500">Project not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Tabs config for the different sections
  const tabs = [
    { id: 'network', label: 'Network', icon: <GlobeAltIcon className="h-5 w-5" /> },
    { id: 'compute', label: 'Compute', icon: <ServerIcon className="h-5 w-5" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheckIcon className="h-5 w-5" /> },
    { id: 'backup', label: 'Backup', icon: <ArchiveBoxIcon className="h-5 w-5" /> },
    { id: 'database', label: 'Database', icon: <CircleStackIcon className="h-5 w-5" /> },
    { id: 'storage', label: 'Storage', icon: <DocumentDuplicateIcon className="h-5 w-5" /> },
  ];

  const handleResourceRemove = (resourceType: 'network' | 'virtualMachine' | 'dataDisk', resourceId: string) => {
    if (projectId) {
      removeResource(projectId, resourceType, resourceId);
    }
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'network':
        return (
          <div className="space-y-4">
            {selectedProject.networks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Network Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Subnets
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProject.networks.map((network: Network) => (
                      <tr key={network.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {network.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex flex-wrap gap-1">
                            {network.subnets.map((subnet, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {subnet}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => handleResourceRemove('network', network.id)}
                            className="text-secondary-coral hover:text-red-700 font-medium font-montserrat"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">
                No networks configured. Add a network from the service catalog.
              </div>
            )}
          </div>
        );
      case 'compute':
        return (
          <div className="space-y-4">
            {selectedProject.virtualMachines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        OS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        CPU / RAM
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProject.virtualMachines.map((vm: VirtualMachine) => (
                      <tr key={vm.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vm.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vm.os}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vm.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vm.cpu} / {vm.ram}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={vm.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => handleResourceRemove('virtualMachine', vm.id)}
                            className="text-secondary-coral hover:text-red-700 font-medium font-montserrat"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">
                No virtual machines configured. Add a VM from the service catalog.
              </div>
            )}
          </div>
        );
      case 'storage':
        return (
          <div className="space-y-4">
            {selectedProject.dataDisks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Size (GB)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProject.dataDisks.map((disk: DataDisk) => (
                      <tr key={disk.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {disk.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {disk.size} GB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => handleResourceRemove('dataDisk', disk.id)}
                            className="text-secondary-coral hover:text-red-700 font-medium font-montserrat"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">
                No storage disks configured. Add storage from the service catalog.
              </div>
            )}
          </div>
        );
      case 'security':
        return (
          <div className="p-6 text-center text-sm text-gray-500">
            No security resources configured. Add security resources from the service catalog.
          </div>
        );
      case 'backup':
        return (
          <div className="p-6 text-center text-sm text-gray-500">
            No backup resources configured. Add backup resources from the service catalog.
          </div>
        );
      case 'database':
        return (
          <div className="p-6 text-center text-sm text-gray-500">
            No database resources configured. Add database resources from the service catalog.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-montserrat text-primary-darkBlue">
          {selectedProject.name}
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsServiceCatalogOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Resource
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 text-primary-teal border border-primary-teal rounded-md hover:bg-primary-mint hover:bg-opacity-10 font-montserrat"
          >
            Back to Projects
          </button>
        </div>
      </div>

      {/* Project Information */}
      <section className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 font-montserrat">Project Information</h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 font-montserrat">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedProject.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 font-montserrat">Billing Organization</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedProject.billingOrganization}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 font-montserrat">Owner</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedProject.owner}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 font-montserrat">Platform</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedProject.platform}</dd>
            </div>
            {selectedProject.region && (
              <div>
                <dt className="text-sm font-medium text-gray-500 font-montserrat">Region</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedProject.region}</dd>
              </div>
            )}
            {selectedProject.projectType && (
              <div>
                <dt className="text-sm font-medium text-gray-500 font-montserrat">Project Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{selectedProject.projectType}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500 font-montserrat">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={selectedProject.status} />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 flex items-center text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-teal text-primary-darkBlue'
                    : 'text-gray-500 hover:text-primary-darkBlue hover:border-b-2 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Service Catalog Modal */}
      <ServiceCatalogModal
        isOpen={isServiceCatalogOpen}
        onClose={() => setIsServiceCatalogOpen(false)}
        projectId={projectId || ''}
      />
    </div>
  );
};

export default ProjectDetails; 