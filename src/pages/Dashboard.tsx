import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import useAnimateOnScroll from '../hooks/useAnimateOnScroll';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';

// Custom colors based on brand guidelines
const chartColors = {
  primary: '#013534', // darkBlue
  mint: '#44D0B6',
  teal: '#117378',
  sage: '#83C149',
  olive: '#324225',
  coral: '#F38D8B',
  sand: '#D3B888',
  beige: '#E7D8AF',
  paleGreen: '#C9D8AB',
};

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
  const chartRef = useAnimateOnScroll<HTMLDivElement>({
    animationClass: 'animate-fade-in',
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <div 
      ref={chartRef}
      className="bg-white p-4 rounded-xl shadow-card border border-gray-100"
    >
      <h3 className="text-gray-700 text-lg font-medium font-montserrat mb-4">Resource Usage Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={mockChartData.resourceUsage}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.mint} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColors.mint} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.teal} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColors.teal} stopOpacity={0.1} />
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
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontFamily: "'Noto Sans', sans-serif"
            }}
            formatter={(value) => [`${value}%`, '']}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '10px', fontFamily: "'Noto Sans', sans-serif" }}
          />
          <Area 
            type="monotone" 
            dataKey="cpu" 
            name="CPU" 
            stroke={chartColors.primary} 
            fillOpacity={1} 
            fill="url(#colorCpu)" 
            animationDuration={1500}
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="memory" 
            name="Memory" 
            stroke={chartColors.mint} 
            fillOpacity={1} 
            fill="url(#colorMemory)" 
            animationDuration={1500}
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="storage" 
            name="Storage" 
            stroke={chartColors.teal} 
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
  const chartRef = useAnimateOnScroll<HTMLDivElement>({
    animationClass: 'animate-fade-in',
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <div 
      ref={chartRef}
      className="bg-white p-4 rounded-xl shadow-card border border-gray-100"
      style={{ animationDelay: '100ms' }}
    >
      <h3 className="text-gray-700 text-lg font-medium font-montserrat mb-4">Weekly Project Activity</h3>
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
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontFamily: "'Noto Sans', sans-serif"
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '10px', fontFamily: "'Noto Sans', sans-serif" }}
          />
          <Bar 
            dataKey="deployments" 
            name="Deployments" 
            fill={chartColors.primary} 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
          <Bar 
            dataKey="updates" 
            name="Updates" 
            fill={chartColors.sage} 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const StorageDistributionChart: React.FC = () => {
  const chartRef = useAnimateOnScroll<HTMLDivElement>({
    animationClass: 'animate-fade-in',
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  const pieColors = [
    chartColors.primary,
    chartColors.mint,
    chartColors.teal,
    chartColors.sage,
    chartColors.coral
  ];

  return (
    <div 
      ref={chartRef}
      className="bg-white p-4 rounded-xl shadow-card border border-gray-100"
    >
      <h3 className="text-gray-700 text-lg font-medium font-montserrat mb-4">Storage Distribution</h3>
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
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Percentage']}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontFamily: "'Noto Sans', sans-serif"
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            wrapperStyle={{ fontFamily: "'Noto Sans', sans-serif" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ServerLoadChart: React.FC = () => {
  const chartRef = useAnimateOnScroll<HTMLDivElement>({
    animationClass: 'animate-fade-in',
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  const radialColors = [
    chartColors.primary,
    chartColors.mint,
    chartColors.teal,
    chartColors.sage,
    chartColors.coral
  ];

  return (
    <div 
      ref={chartRef}
      className="bg-white p-4 rounded-xl shadow-card border border-gray-100"
      style={{ animationDelay: '100ms' }}
    >
      <h3 className="text-gray-700 text-lg font-medium font-montserrat mb-4">Server Load</h3>
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
            label={{ 
              position: 'insideStart', 
              fill: '#333', 
              fontSize: 12,
              fontFamily: "'Noto Sans', sans-serif"
            }}
            background
            dataKey="value"
            animationDuration={1500}
          >
            {mockChartData.serverLoad.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={radialColors[index % radialColors.length]} 
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
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontFamily: "'Noto Sans', sans-serif"
            }}
          />
          <Legend 
            iconSize={10} 
            layout="horizontal" 
            verticalAlign="bottom"
            wrapperStyle={{ fontFamily: "'Noto Sans', sans-serif" }}
          />
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
  delay?: number;
}> = ({
  title,
  value,
  color,
  bgColor,
  icon,
  delay = 0,
}) => {
  const cardRef = useAnimateOnScroll<HTMLDivElement>({
    animationClass: 'animate-slide-up', 
    rootMargin: '0px 0px -50px 0px'
  });

  return (
    <div 
      ref={cardRef}
      className={`${bgColor} rounded-xl shadow-card p-6 transition-all duration-300 hover:shadow-hover border border-gray-100`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-600 text-sm font-montserrat font-medium mb-1">{title}</h3>
          <p className={`${color} text-2xl font-bold font-montserrat`}>{value}</p>
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
  delay?: number;
}> = ({ project, delay = 0 }) => {
  const cardRef = useAnimateOnScroll<HTMLDivElement>({
    animationClass: 'animate-slide-up',
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-xl shadow-card hover:shadow-hover transition-shadow duration-300 overflow-hidden border border-gray-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-primary-darkBlue font-montserrat">{project.name}</h3>
          <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
            ${project.status === 'Active' ? 'bg-secondary-sage bg-opacity-20 text-secondary-olive' : 
              project.status === 'Inactive' ? 'bg-secondary-coral bg-opacity-20 text-secondary-coral' : 
              'bg-secondary-sand bg-opacity-20 text-secondary-brown'}`}
          >
            {project.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <span className="inline-block bg-primary-mint bg-opacity-20 rounded-full p-1 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-teal" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
            {project.owner}
          </div>
          <Link to={`/projects/${project.id}`} 
            className="text-sm font-medium text-primary-teal hover:text-primary-darkBlue flex items-center font-montserrat"
          >
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
};

const Dashboard: React.FC = () => {
  const { projects } = useProjectStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const navigate = useNavigate();

  // Animation refs
  const headerRef = useAnimateOnScroll<HTMLDivElement>({ animationClass: 'animate-fade-in' });
  const statsRef = useAnimateOnScroll<HTMLDivElement>({ 
    animationClass: 'animate-slide-up',
    threshold: 0.2, 
    rootMargin: '0px 0px -50px 0px' 
  });
  const usageStatsRef = useAnimateOnScroll<HTMLDivElement>({ 
    animationClass: 'animate-scale-in',
    threshold: 0.1, 
    rootMargin: '0px 0px -50px 0px' 
  });

  const totalProjects = projects.length;
  const activeProjects = projects.filter(project => project.status === 'Active').length;
  const pendingProjects = projects.filter(project => project.status === 'Pending').length;

  return (
    <div className="pb-8 relative">
      <div 
        ref={headerRef}
        className="bg-gradient-to-r from-primary-darkBlue to-primary-teal rounded-xl shadow-lg mb-8 p-6 text-white"
      >
        <h1 className="text-2xl text-primary-mint font-bold font-montserrat mb-2">Welcome to Synapse Dashboard</h1>
        <p className="text-primary-mint mb-6 opacity-90">Manage and monitor your cloud infrastructure projects</p>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-white transition-colors duration-300 shadow-sm flex items-center font-montserrat font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Project
        </button>
      </div>

      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Projects" 
          value={totalProjects} 
          color="text-primary-darkBlue" 
          bgColor="bg-white"
          delay={100}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard 
          title="Active Projects" 
          value={activeProjects} 
          color="text-primary-teal" 
          bgColor="bg-white"
          delay={200}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          title="Pending Projects" 
          value={pendingProjects} 
          color="text-secondary-coral" 
          bgColor="bg-white"
          delay={300}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Usage Statistics Section */}
      <div 
        ref={usageStatsRef}
        className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100 mb-8"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium font-montserrat text-primary-darkBlue">System Usage Statistics</h2>
          <button
            className="px-4 py-2 bg-primary-teal text-white rounded-md hover:bg-primary-darkBlue transition-colors font-montserrat"
          >
            Generate Report
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-primary-mint bg-opacity-10 rounded-lg p-4 border border-primary-mint border-opacity-20">
            <div className="text-primary-teal text-sm font-montserrat font-medium uppercase tracking-wide">Projects</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold font-montserrat text-primary-darkBlue">{usageData.projects}</span>
              <span className="ml-2 text-sm text-primary-teal">Total</span>
            </div>
          </div>
          <div className="bg-secondary-sage bg-opacity-10 rounded-lg p-4 border border-secondary-sage border-opacity-20">
            <div className="text-secondary-olive text-sm font-montserrat font-medium uppercase tracking-wide">Virtual Machines</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold font-montserrat text-primary-darkBlue">{usageData.vms}</span>
              <span className="ml-2 text-sm text-secondary-olive">Running</span>
            </div>
          </div>
          <div className="bg-secondary-sand bg-opacity-10 rounded-lg p-4 border border-secondary-sand border-opacity-20">
            <div className="text-secondary-brown text-sm font-montserrat font-medium uppercase tracking-wide">Storage Used</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold font-montserrat text-primary-darkBlue">{usageData.storage}</span>
            </div>
          </div>
          <div className="bg-secondary-coral bg-opacity-10 rounded-lg p-4 border border-secondary-coral border-opacity-20">
            <div className="text-secondary-coral text-sm font-montserrat font-medium uppercase tracking-wide">Networks</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold font-montserrat text-primary-darkBlue">{usageData.networks}</span>
            </div>
          </div>
          <div className="bg-secondary-paleGreen bg-opacity-10 rounded-lg p-4 border border-secondary-paleGreen border-opacity-20">
            <div className="text-secondary-olive text-sm font-montserrat font-medium uppercase tracking-wide">Active Users</div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-semibold font-montserrat text-primary-darkBlue">{usageData.activeUsers}</span>
              <span className="ml-2 text-sm text-secondary-olive">Online</span>
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

      <div 
        className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100"
        ref={useAnimateOnScroll<HTMLDivElement>({ animationClass: 'animate-fade-in', threshold: 0.1 })}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-medium font-montserrat text-primary-darkBlue">Recent Projects</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-mint bg-opacity-20 text-primary-teal' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-primary-mint bg-opacity-20 text-primary-teal' : 'text-gray-400 hover:text-gray-600'}`}
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
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} delay={index * 100} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-base font-medium font-montserrat text-primary-darkBlue mb-1">No projects found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first project</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
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
                  <th className="px-6 py-3 text-left text-xs font-medium font-montserrat text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium font-montserrat text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium font-montserrat text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium font-montserrat text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium font-montserrat text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary-darkBlue font-montserrat">{project.name}</div>
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
                          ${project.status === 'Active' ? 'bg-secondary-sage bg-opacity-20 text-secondary-olive' : 
                            project.status === 'Inactive' ? 'bg-secondary-coral bg-opacity-20 text-secondary-coral' : 
                            'bg-secondary-sand bg-opacity-20 text-secondary-brown'}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/projects/${project.id}`} className="text-primary-teal hover:text-primary-darkBlue flex items-center font-montserrat">
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
                        <h3 className="text-base font-medium font-montserrat text-primary-darkBlue mb-1">No projects found</h3>
                        <p className="text-sm text-gray-500 mb-4">Get started by creating your first project</p>
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
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