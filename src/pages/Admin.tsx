import React, { useState } from 'react';
import UserFormModal from '../components/modals/UserFormModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Define user interface
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

// Define setting interface
interface Setting {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

// Mock data
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Active' },
];

const initialSettings = [
  { id: 'notif', name: 'Email Notifications', enabled: true, description: 'Send email notifications for important events' },
  { id: 'mfa', name: 'Multi-Factor Authentication', enabled: false, description: 'Require MFA for all users' },
  { id: 'apiAccess', name: 'API Access', enabled: true, description: 'Allow access to the Synapses API' },
  { id: 'audit', name: 'Audit Logging', enabled: true, description: 'Log all user actions for security auditing' },
];

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
          ? 'bg-white text-primary-teal border-t border-l border-r border-gray-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  
  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [settingsChanged, setSettingsChanged] = useState(false);

  const handleAddUser = () => {
    setCurrentUser(undefined);
    setModalMode('add');
    setUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setModalMode('edit');
    setUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setDeleteModalOpen(true);
  };

  const saveUser = (user: User) => {
    if (modalMode === 'add') {
      setUsers([...users, user]);
    } else {
      setUsers(users.map(u => u.id === user.id ? user : u));
    }
  };

  const confirmDeleteUser = () => {
    if (currentUser) {
      setUsers(users.filter(user => user.id !== currentUser.id));
    }
  };

  const toggleSetting = (id: string) => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
    setSettingsChanged(true);
  };

  const saveSettings = () => {
    console.log('Settings saved:', settings);
    // In a real app, you would send these settings to your backend
    setSettingsChanged(false);
  };

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
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {activeTab === 'users' && (
          <div>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">User Management</h2>
              <button
                className="px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md hover:bg-primary-teal hover:text-white transition-colors font-montserrat"
                onClick={handleAddUser}
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
                  {users.map((user) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <button 
                            className="text-primary-teal hover:text-primary-darkBlue"
                            onClick={() => handleEditUser(user)}
                            title="Edit user"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-secondary-coral hover:text-red-700"
                            onClick={() => handleDeleteUser(user)}
                            title="Delete user"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
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
              {settings.map((setting) => (
                <div key={setting.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => toggleSetting(setting.id)}
                      className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none"
                      role="switch"
                      aria-checked={setting.enabled}
                    >
                      <span className={`${setting.enabled ? 'bg-primary-mint' : 'bg-gray-300'} block w-10 h-6 rounded-full transition-colors`}></span>
                      <span 
                        className={`${setting.enabled ? 'translate-x-4' : 'translate-x-0'} absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform`}
                      ></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t">
              <button
                className={`px-4 py-2 bg-primary-mint text-primary-darkBlue rounded-md transition-colors font-montserrat ${
                  settingsChanged 
                  ? 'hover:bg-primary-teal hover:text-white opacity-100'
                  : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={saveSettings}
                disabled={!settingsChanged}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* User Form Modal */}
      <UserFormModal 
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSave={saveUser}
        user={currentUser}
        mode={modalMode}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        itemName={currentUser ? currentUser.name : ''}
      />
    </div>
  );
};

export default Admin; 