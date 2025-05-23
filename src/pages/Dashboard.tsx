import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';

// Mock data
const usageData = {
  projects: 12,
  vms: 45,
  storage: '1.2 TB',
  networks: 8,
  activeUsers: 15,
};

// Enhanced mock chart data
const mockChartData = {
  resourceUsage: [
    { name: 'Jan', cpu: 65, memory: 45, storage: 30 },
    { name: 'Feb', cpu: 70, memory: 50, storage: 35 },
    { name: 'Mar', cpu: 75, memory: 60, storage: 40 },
    { name: 'Apr', cpu: 85, memory: 65, storage: 50 },
    { name: 'May', cpu: 90, memory: 70, storage: 55 },
    { name: 'Jun', cpu: 95, memory: 75, storage: 60 },
  ],
  projectActivity: [
    { name: 'Mon', deployments: 8, updates: 12 },
    { name: 'Tue', deployments: 10, updates: 8 },
    { name: 'Wed', deployments: 12, updates: 15 },
    { name: 'Thu', deployments: 7, updates: 10 },
    { name: 'Fri', deployments: 9, updates: 11 },
    { name: 'Sat', deployments: 4, updates: 6 },
    { name: 'Sun', deployments: 3, updates: 5 },
  ],
  storageDistribution: [
    { name: 'Images', value: 35 },
    { name: 'Videos', value: 25 },
    { name: 'Documents', value: 20 },
    { name: 'Backups', value: 15 },
    { name: 'Other', value: 5 },
  ],
  serverLoad: [
    { name: 'Server 1', value: 85 },
    { name: 'Server 2', value: 75 },
    { name: 'Server 3', value: 92 },
    { name: 'Server 4', value: 65 },
    { name: 'Server 5', value: 78 },
  ]
};

// Custom colors
const colors = {
  cpu: '#3B82F6', // blue
  memory: '#10B981', // green
  storage: '#8B5CF6', // purple
  deployments: '#4F46E5', // indigo
  updates: '#F59E0B', // amber
  pieColors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'],
  radialColors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899']
};

// Modern chart components using Recharts
const ResourceUsageChart: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-gray-700 text-lg font-medium mb-4">Resource Usage Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={mockChartData.resourceUsage}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.cpu} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.cpu} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.memory} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.memory} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.storage} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.storage} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => [`${value}%`, '']}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          <Area 
            type="monotone" 
            dataKey="cpu" 
            name="CPU" 
            stroke={colors.cpu} 
            fillOpacity={1} 
            fill="url(#colorCpu)" 
            animationDuration={1500}
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="memory" 
            name="Memory" 
            stroke={colors.memory} 
            fillOpacity={1} 
            fill="url(#colorMemory)" 
            animationDuration={1500}
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="storage" 
            name="Storage" 
            stroke={colors.storage} 
            fillOpacity={1} 
            fill="url(#colorStorage)" 
            animationDuration={1500}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const ProjectActivityChart: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-gray-700 text-lg font-medium mb-4">Weekly Project Activity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={mockChartData.projectActivity}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          <Bar 
            dataKey="deployments" 
            name="Deployments" 
            fill={colors.deployments} 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
          <Bar 
            dataKey="updates" 
            name="Updates" 
            fill={colors.updates} 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const StorageDistributionChart: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-gray-700 text-lg font-medium mb-4">Storage Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={mockChartData.storageDistribution}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
            animationDuration={1500}
          >
            {mockChartData.storageDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors.pieColors[index % colors.pieColors.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Percentage']}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ServerLoadChart: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-gray-700 text-lg font-medium mb-4">Server Load</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="20%" 
          outerRadius="80%" 
          barSize={20} 
          data={mockChartData.serverLoad}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            label={{ position: 'insideStart', fill: '#333', fontSize: 12 }}
            background
            dataKey="value"
            animationDuration={1500}
          >
            {mockChartData.serverLoad.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors.radialColors[index % colors.radialColors.length]} 
                name={entry.name}
              />
            ))}
          </RadialBar>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Server Load']}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatCard: React.FC<{ 
  title: string; 
  value: number | string; 
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}> = ({
  title,
  value,
  color,
  bgColor,
  icon,
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
          <p className={`${color} text-2xl font-bold`}>{value}</p>
        </div>
        <div className={`rounded-full p-3 ${bgColor} bg-opacity-40`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ 
  project: any;
}> = ({ project }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
          ${project.status === 'Active' ? 'bg-green-100 text-green-800' : 
            project.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'}`}
        >
          {project.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <span className="inline-block bg-blue-100 rounded-full p-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </span>
          {project.owner}
        </div>
        <Link to={`/projects/${project.id}`} 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
    <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 text-xs text-gray-500">
      Platform: {project.platform}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { projects } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const navigate = useNavigate();

  const totalProjects = projects.length;
  const activeProjects = projects.filter(project => project.status === 'Active').length;
  const pendingProjects = projects.filter(project => project.status === 'Pending').length;

  return (
    <div className="pb-8 relative">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md mb-8 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Synapse Dashboard</h1>
        <p className="text-blue-100 mb-6">Manage and monitor your cloud infrastructure projects</p>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors shadow-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Projects" 
          value={totalProjects} 
          color="text-blue-600" 
          bgColor="bg-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard 
          title="Active Projects" 
          value={activeProjects} 
          color="text-green-600" 
          bgColor="bg-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          title="Pending Projects" 
          value={pendingProjects} 
          color="text-amber-600" 
          bgColor="bg-white"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Usage Statistics Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">System Usage Statistics</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate Report
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-blue-500 text-sm font-medium uppercase tracking-wide">Projects</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold text-blue-800">{usageData.projects}</span>
              <span className="ml-2 text-sm text-blue-600">Total</span>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <div className="text-indigo-500 text-sm font-medium uppercase tracking-wide">Virtual Machines</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold text-indigo-800">{usageData.vms}</span>
              <span className="ml-2 text-sm text-indigo-600">Running</span>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="text-purple-500 text-sm font-medium uppercase tracking-wide">Storage Used</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold text-purple-800">{usageData.storage}</span>
            </div>
          </div>
          <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
            <div className="text-pink-500 text-sm font-medium uppercase tracking-wide">Networks</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold text-pink-800">{usageData.networks}</span>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="text-green-500 text-sm font-medium uppercase tracking-wide">Active Users</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold text-green-800">{usageData.activeUsers}</span>
              <span className="ml-2 text-sm text-green-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section - First row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ResourceUsageChart />
        <ProjectActivityChart />
      </div>

      {/* Chart Section - Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StorageDistributionChart />
        <ServerLoadChart />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="p-6">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-base font-medium text-gray-900 mb-1">No projects found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first project</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Project
                </button>
              </div>
            )}
          </div>
        ) : (
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
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
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
                        <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-900 flex items-center">
                          View
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-base font-medium text-gray-900 mb-1">No projects found</h3>
                        <p className="text-sm text-gray-500 mb-4">Get started by creating your first project</p>
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Create Project
                        </button>
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
    </div>
  );
};

export default Dashboard; 