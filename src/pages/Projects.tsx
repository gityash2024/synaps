import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProjectStore, Platform, Status } from '../store/projectStore';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import Loader from '../components/common/Loader';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

const Projects: React.FC = () => {
  const { projects, deleteProject, loadProjects, loading, error } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const platforms: ('All' | Platform)[] = ['All', 'AWS', 'Azure', 'Private Cloud', 'VMware'];
  const statuses: ('All' | Status)[] = ['All', 'Active', 'Inactive', 'Pending'];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPlatform = platformFilter === 'All' || project.platform === platformFilter;
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      
      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [projects, searchQuery, platformFilter, statusFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setPlatformFilter('All');
    setStatusFilter('All');
  };

  const handleDeleteProject = async () => {
    if (deletingProjectId) {
      try {
        await deleteProject(deletingProjectId);
        toast.success('Project deleted successfully');
        setDeletingProjectId(null);
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadProjects();
      toast.success('Projects refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh projects');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-montserrat">Projects</h1>
        <div className="flex items-center space-x-3">
          {(loading || refreshing) && (
            <Loader size="sm" color="primary" />
          )}
          
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
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
          >
            Create Project
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={handleRefresh} 
                className="mt-1 text-sm text-red-600 hover:text-red-500 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-end space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-teal focus:border-primary-teal"
            />
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">
              Platform
            </label>
            <select
              id="platform"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as Platform | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-teal focus:border-primary-teal"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 font-montserrat">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-teal focus:border-primary-teal"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <button
              onClick={clearFilters}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 font-montserrat">All Projects</h2>
          <span className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
        </div>
        
        {loading && !projects.length ? (
          <div className="p-12">
            <Loader size="lg" text="Loading projects..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-montserrat">
                    Resources
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
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-montserrat">{project.name}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{project.description || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            project.platform === 'AWS' ? 'bg-yellow-500' :
                            project.platform === 'Azure' ? 'bg-blue-500' :
                            project.platform === 'Private Cloud' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}></span>
                          <span className="text-sm text-gray-900">{project.platform}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{project.owner}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-1">
                          {project.networks.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {project.networks.length} Networks
                            </span>
                          )}
                          {project.virtualMachines.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {project.virtualMachines.length} VMs
                            </span>
                          )}
                          {project.dataDisks.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {project.dataDisks.length} Disks
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${project.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            project.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.creationDate ? new Date(project.creationDate).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <Link 
                            to={`/projects/${project.id}`} 
                            className="text-primary-teal hover:text-primary-darkBlue transition-colors"
                            title="View project"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => setDeletingProjectId(project.id)}
                            className="text-secondary-coral hover:text-red-700 transition-colors"
                            title="Delete project"
                            disabled={loading}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          {projects.length === 0 ? 'No projects found' : 'No projects match your filters'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {projects.length === 0 ? 'Create your first project to get started' : 'Try adjusting your search criteria'}
                        </p>
                        {projects.length === 0 ? (
                          <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
                          >
                            Create Project
                          </button>
                        ) : (
                          <button
                            onClick={clearFilters}
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateProjectModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      )}

      {deletingProjectId && (
        <ConfirmationModal
          isOpen={!!deletingProjectId}
          onClose={() => setDeletingProjectId(null)}
          onConfirm={handleDeleteProject}
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone and will remove all associated resources."
          confirmButtonText="Delete"
          confirmButtonClass="bg-secondary-coral hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default Projects;