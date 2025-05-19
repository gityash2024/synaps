import React, { useState } from 'react';

// Mock data
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Active' },
];

const mockSettings = [
  { id: 'notif', name: 'Email Notifications', enabled: true, description: 'Send email notifications for important events' },
  { id: 'mfa', name: 'Multi-Factor Authentication', enabled: false, description: 'Require MFA for all users' },
  { id: 'apiAccess', name: 'API Access', enabled: true, description: 'Allow access to the Synaps API' },
  { id: 'audit', name: 'Audit Logging', enabled: true, description: 'Log all user actions for security auditing' },
];

const usageData = {
  projects: 12,
  vms: 45,
  storage: '1.2 TB',
  networks: 8,
  activeUsers: 15,
};

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => {
  return (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
        active
          ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'usage'>('users');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>
      
      <div className="flex space-x-2 mb-4">
        <Tab
          label="User Management"
          active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
        />
        <Tab
          label="System Settings"
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
        <Tab
          label="Usage Statistics"
          active={activeTab === 'usage'}
          onClick={() => setActiveTab('usage')}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {activeTab === 'users' && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">User Management</h2>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
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
                  {mockUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">System Settings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mockSettings.map((setting) => (
                <div key={setting.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <span className="relative">
                        <span className={`block w-10 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                        <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${setting.enabled ? 'translate-x-4' : ''}`}></span>
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'usage' && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Usage Statistics</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="px-6 py-4 border-t">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Generate Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin; 