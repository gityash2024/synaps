import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore, Network, VirtualMachine, DataDisk } from '../store/projectStore';
import AddNetworkModal from '../components/modals/AddNetworkModal';
import AddVMModal from '../components/modals/AddVMModal';
import AddDiskModal from '../components/modals/AddDiskModal';

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
  const { setSelectedProject, selectedProject } = useProjectStore();
  
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isVMModalOpen, setIsVMModalOpen] = useState(false);
  const [isDiskModalOpen, setIsDiskModalOpen] = useState(false);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-montserrat">{selectedProject.name}</h1>
          <div className="flex items-center mt-1 space-x-4">
            <p className="text-sm text-gray-500">{selectedProject.platform}</p>
            <StatusBadge status={selectedProject.status} />
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 text-sm text-primary-teal border border-primary-teal rounded-md hover:bg-primary-mint hover:bg-opacity-10 font-montserrat"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Project Information */}
        <section className="bg-white shadow rounded-lg overflow-hidden">
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
            </dl>
          </div>
        </section>

        {/* Networks Section */}
        <section className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 font-montserrat">Networks</h2>
            <button
              onClick={() => setIsNetworkModalOpen(true)}
              className="px-3 py-1 text-sm text-primary-teal border border-primary-teal rounded-md hover:bg-primary-mint hover:bg-opacity-10 font-montserrat"
            >
              Add Network
            </button>
          </div>
          <div className="overflow-x-auto">
            {selectedProject.networks.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                      Network Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                      Subnets
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
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">
                No networks configured. Add a network to get started.
              </div>
            )}
          </div>
        </section>

        {/* Virtual Machines Section */}
        <section className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 font-montserrat">Virtual Machines</h2>
            <button
              onClick={() => setIsVMModalOpen(true)}
              className="px-3 py-1 text-sm text-primary-teal border border-primary-teal rounded-md hover:bg-primary-mint hover:bg-opacity-10 font-montserrat"
            >
              Add VM
            </button>
          </div>
          <div className="overflow-x-auto">
            {selectedProject.virtualMachines.length > 0 ? (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">
                No virtual machines configured. Deploy a VM to get started.
              </div>
            )}
          </div>
        </section>

        {/* Data Disks Section */}
        <section className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 font-montserrat">Data Disks</h2>
            <button
              onClick={() => setIsDiskModalOpen(true)}
              className="px-3 py-1 text-sm text-primary-teal border border-primary-teal rounded-md hover:bg-primary-mint hover:bg-opacity-10 font-montserrat"
            >
              Add Disk
            </button>
          </div>
          <div className="overflow-x-auto">
            {selectedProject.dataDisks.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                      Size (GB)
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
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">
                No data disks configured. Add a disk to get started.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      {isNetworkModalOpen && (
        <AddNetworkModal
          isOpen={isNetworkModalOpen}
          onClose={() => setIsNetworkModalOpen(false)}
          projectId={selectedProject.id}
        />
      )}

      {isVMModalOpen && (
        <AddVMModal
          isOpen={isVMModalOpen}
          onClose={() => setIsVMModalOpen(false)}
          projectId={selectedProject.id}
          networks={selectedProject.networks}
        />
      )}

      {isDiskModalOpen && (
        <AddDiskModal
          isOpen={isDiskModalOpen}
          onClose={() => setIsDiskModalOpen(false)}
          projectId={selectedProject.id}
        />
      )}
    </div>
  );
};

export default ProjectDetails; 