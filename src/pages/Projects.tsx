import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore, Platform, Status } from '../store/projectStore';
import CreateProjectModal from '../components/modals/CreateProjectModal';

const Projects: React.FC = () => {
  const { projects } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');

  // Available platforms and statuses for filters
  const platforms: ('All' | Platform)[] = ['All', 'AWS', 'Azure', 'Private Cloud', 'VMware'];
  const statuses: ('All' | Status)[] = ['All', 'Active', 'Inactive', 'Pending'];

  // Filter projects based on current filter states
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Filter by search query (case insensitive)
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by platform
      const matchesPlatform = platformFilter === 'All' || project.platform === platformFilter;
      
      // Filter by status
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      
      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [projects, searchQuery, platformFilter, statusFilter]);

  // Reset all filters
  const clearFilters = () => {
    setSearchQuery('');
    setPlatformFilter('All');
    setStatusFilter('All');
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-montserrat">Projects</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
        >
          Create Project
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-end space-y-3 md:space-y-0 md:space-x-4">
          {/* Search filter */}
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
          
          {/* Platform filter */}
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
          
          {/* Status filter */}
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
          
          {/* Clear filters button */}
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.platform}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.owner}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/projects/${project.id}`} className="text-primary-teal hover:text-primary-darkBlue font-montserrat">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    {projects.length === 0 
                      ? "No projects found. Create your first project!" 
                      : "No projects match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateProjectModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Projects; 