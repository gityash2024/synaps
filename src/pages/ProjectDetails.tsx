import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore, Network, VirtualMachine, DataDisk, SecurityResource, BackupResource, StorageResource } from '../store/projectStore';
import ServiceCatalogModal from '../components/modals/ServiceCatalogModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { 
  PlusIcon, 
  ServerIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  ArchiveBoxIcon,
  CircleStackIcon, 
  DocumentDuplicateIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colorMap: Record<string, string> = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    created: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
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
  const { setSelectedProject, selectedProject, removeResource, loading, error } = useProjectStore();
  
  const [isServiceCatalogOpen, setIsServiceCatalogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('network');
  const [refreshing, setRefreshing] = useState(false);
  
  const [resourceToRemove, setResourceToRemove] = useState<{
    type: 'network' | 'virtualMachine' | 'dataDisk' | 'securityResource' | 'backupResource' | 'storageResource';
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId, setSelectedProject]);

  const handleRefresh = async () => {
    if (projectId) {
      setRefreshing(true);
      try {
        await setSelectedProject(projectId);
        toast.success('Project refreshed successfully');
      } catch (error) {
        toast.error('Failed to refresh project');
      } finally {
        setRefreshing(false);
      }
    }
  };

  const tabs = [
    { id: 'network', label: 'Network', icon: <GlobeAltIcon className="h-5 w-5" /> },
    { id: 'compute', label: 'Compute', icon: <ServerIcon className="h-5 w-5" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheckIcon className="h-5 w-5" /> },
    { id: 'backup', label: 'Backup', icon: <ArchiveBoxIcon className="h-5 w-5" /> },
    { id: 'database', label: 'Database', icon: <CircleStackIcon className="h-5 w-5" /> },
    { id: 'storage', label: 'Storage', icon: <DocumentDuplicateIcon className="h-5 w-5" /> },
  ];

  const confirmResourceRemoval = (type: 'network' | 'virtualMachine' | 'dataDisk' | 'securityResource' | 'backupResource' | 'storageResource', id: string, name: string) => {
    setResourceToRemove({ type, id, name });
  };

  const handleResourceRemove = async () => {
    if (resourceToRemove && projectId) {
      try {
        await removeResource(projectId, resourceToRemove.type, resourceToRemove.id);
        toast.success(`${resourceToRemove.name} removed successfully`);
        setResourceToRemove(null);
      } catch (error) {
        toast.error(`Failed to remove ${resourceToRemove.name}`);
      }
    }
  };

  const renderTabContent = () => {
    if (!selectedProject) return null;

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
                      <tr key={network.id} className="hover:bg-gray-50 transition-colors">
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
                            onClick={() => confirmResourceRemoval('network', network.id, network.name)}
                            className="text-secondary-coral hover:text-red-700 font-medium font-montserrat transition-colors"
                            title="Remove network"
                          >
                            <TrashIcon className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <GlobeAltIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No networks configured</h3>
                <p className="text-sm text-gray-500 mb-4">Add a network from the service catalog to get started.</p>
                <button
                  onClick={() => setIsServiceCatalogOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-darkBlue bg-primary-mint hover:bg-primary-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Network
                </button>
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
                        Instance Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Public IP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Data Disk Size
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
                    {selectedProject.virtualMachines.map((vm: VirtualMachine) => {
                      // Try to parse details for additional info
                      let publicIP = 'N/A';
                      let instanceId = 'N/A';
                      let dataEBSSize = vm.diskSize;
                      
                      try {
                        const details = JSON.parse(vm.details || '{}');
                        publicIP = details.PublicIP || 'N/A';
                        instanceId = details.InstanceId || 'N/A';
                        dataEBSSize = parseInt(details.DataEBSSize) || vm.diskSize;
                      } catch (e) {
                        // Use defaults if parsing fails
                      }

                      return (
                        <tr key={vm.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div>
                              <div>{vm.name}</div>
                              {instanceId !== 'N/A' && (
                                <div className="text-xs text-gray-500">{instanceId}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${vm.os === 'Ubuntu' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                              {vm.os}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vm.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              publicIP !== 'N/A' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {publicIP}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dataEBSSize} GB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={vm.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <button
                              onClick={() => confirmResourceRemoval('virtualMachine', vm.id, vm.name)}
                              className="text-secondary-coral hover:text-red-700 font-medium font-montserrat transition-colors"
                              title="Remove virtual machine"
                            >
                              <TrashIcon className="h-5 w-5 inline" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <ServerIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No virtual machines configured</h3>
                <p className="text-sm text-gray-500 mb-4">Deploy a VM from the service catalog to get started.</p>
                <button
                  onClick={() => setIsServiceCatalogOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-darkBlue bg-primary-mint hover:bg-primary-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Deploy VM
                </button>
              </div>
            )}
          </div>
        );
      case 'storage':
        return (
          <div className="space-y-6">
            {/* Storage Resources Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Resources</h3>
              {selectedProject.storageResources.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedProject.storageResources.map((storage: StorageResource) => (
                        <tr key={storage.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {storage.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {storage.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={storage.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(storage.creationDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <button
                              onClick={() => confirmResourceRemoval('storageResource', storage.id, storage.name)}
                              className="text-secondary-coral hover:text-red-700 font-medium font-montserrat transition-colors"
                              title="Remove storage"
                            >
                              <TrashIcon className="h-5 w-5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No storage resources configured
                </div>
              )}
            </div>

            {/* Data Disks Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Disks</h3>
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
                        <tr key={disk.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {disk.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {disk.size} GB
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <button
                              onClick={() => confirmResourceRemoval('dataDisk', disk.id, disk.name)}
                              className="text-secondary-coral hover:text-red-700 font-medium font-montserrat transition-colors"
                              title="Remove disk"
                            >
                              <TrashIcon className="h-5 w-5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No data disks configured
                </div>
              )}
            </div>

            {selectedProject.storageResources.length === 0 && selectedProject.dataDisks.length === 0 && (
              <div className="p-6 text-center">
                <DocumentDuplicateIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No storage configured</h3>
                <p className="text-sm text-gray-500 mb-4">Add storage from the service catalog to get started.</p>
                <button
                  onClick={() => setIsServiceCatalogOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-darkBlue bg-primary-mint hover:bg-primary-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Storage
                </button>
              </div>
            )}
          </div>
        );
      case 'security':
        return (
          <div className="space-y-4">
            {selectedProject.securityResources.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProject.securityResources.map((security: SecurityResource) => (
                      <tr key={security.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {security.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {security.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={security.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(security.creationDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => confirmResourceRemoval('securityResource', security.id, security.name)}
                            className="text-secondary-coral hover:text-red-700 font-medium font-montserrat transition-colors"
                            title="Remove security resource"
                          >
                            <TrashIcon className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <ShieldCheckIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No security resources configured</h3>
                <p className="text-sm text-gray-500 mb-4">Add security resources from the service catalog.</p>
                <button
                  onClick={() => setIsServiceCatalogOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-darkBlue bg-primary-mint hover:bg-primary-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Security
                </button>
              </div>
            )}
          </div>
        );
      case 'backup':
        return (
          <div className="space-y-4">
            {selectedProject.backupResources.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProject.backupResources.map((backup: BackupResource) => (
                      <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {backup.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            {backup.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={backup.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(backup.creationDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => confirmResourceRemoval('backupResource', backup.id, backup.name)}
                            className="text-secondary-coral hover:text-red-700 font-medium font-montserrat transition-colors"
                            title="Remove backup resource"
                          >
                            <TrashIcon className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <ArchiveBoxIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No backup resources configured</h3>
                <p className="text-sm text-gray-500 mb-4">Add backup resources from the service catalog.</p>
                <button
                  onClick={() => setIsServiceCatalogOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-darkBlue bg-primary-mint hover:bg-primary-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Backup
                </button>
              </div>
            )}
          </div>
        );
      case 'database':
        return (
          <div className="p-6 text-center">
            <CircleStackIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No database resources configured</h3>
            <p className="text-sm text-gray-500 mb-4">Add database resources from the service catalog.</p>
            <button
              onClick={() => setIsServiceCatalogOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-darkBlue bg-primary-mint hover:bg-primary-teal hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Database
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading && !selectedProject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-12">
            <Loader size="lg" text="Loading project details..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Project</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="px-4 py-2 text-primary-teal border border-primary-teal rounded-md hover:bg-primary-mint hover:bg-opacity-10 font-montserrat"
              >
                Back to Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Project Not Found</h3>
            <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or has been deleted.</p>
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold font-montserrat text-primary-darkBlue mr-4">
            {selectedProject.name}
          </h1>
          {(loading || refreshing) && <Loader size="sm" color="primary" />}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 text-primary-teal border border-primary-teal rounded-md hover:bg-primary-mint hover:bg-opacity-10 font-montserrat transition-colors disabled:opacity-50"
          >
            <svg className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
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

      {(loading || refreshing) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <Loader size="sm" color="primary" />
            <span className="ml-3 text-blue-700 text-sm">Refreshing project resources...</span>
          </div>
        </div>
      )}

      <section className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 font-montserrat">Project Information</h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 font-montserrat">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedProject.description || 'No description provided'}</dd>
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
            {selectedProject.creationDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500 font-montserrat">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(selectedProject.creationDate).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 flex items-center text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-teal text-primary-darkBlue'
                    : 'border-transparent text-gray-500 hover:text-primary-darkBlue hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.id === 'network' && selectedProject.networks.length > 0 && (
                  <span className="ml-2 bg-primary-mint text-primary-darkBlue text-xs px-2 py-0.5 rounded-full">
                    {selectedProject.networks.length}
                  </span>
                )}
                {tab.id === 'compute' && selectedProject.virtualMachines.length > 0 && (
                  <span className="ml-2 bg-primary-mint text-primary-darkBlue text-xs px-2 py-0.5 rounded-full">
                    {selectedProject.virtualMachines.length}
                  </span>
                )}
                {tab.id === 'storage' && (selectedProject.storageResources.length > 0 || selectedProject.dataDisks.length > 0) && (
                  <span className="ml-2 bg-primary-mint text-primary-darkBlue text-xs px-2 py-0.5 rounded-full">
                    {selectedProject.storageResources.length + selectedProject.dataDisks.length}
                  </span>
                )}
                {tab.id === 'security' && selectedProject.securityResources.length > 0 && (
                  <span className="ml-2 bg-primary-mint text-primary-darkBlue text-xs px-2 py-0.5 rounded-full">
                    {selectedProject.securityResources.length}
                  </span>
                )}
                {tab.id === 'backup' && selectedProject.backupResources.length > 0 && (
                  <span className="ml-2 bg-primary-mint text-primary-darkBlue text-xs px-2 py-0.5 rounded-full">
                    {selectedProject.backupResources.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
              <Loader size="md" text="Loading resources..." />
            </div>
          )}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <ServiceCatalogModal
        isOpen={isServiceCatalogOpen}
        onClose={() => setIsServiceCatalogOpen(false)}
        projectId={projectId || ''}
      />

      {resourceToRemove && (
        <ConfirmationModal
          isOpen={!!resourceToRemove}
          onClose={() => setResourceToRemove(null)}
          onConfirm={handleResourceRemove}
          title="Remove Resource"
          message={`Are you sure you want to remove ${resourceToRemove.name}? This action cannot be undone.`}
          confirmButtonText="Remove"
          confirmButtonClass="bg-secondary-coral hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default ProjectDetails;