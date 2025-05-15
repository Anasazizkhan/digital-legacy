import { useState } from 'react';
import { FaShieldAlt, FaKey, FaLock, FaMobile } from 'react-icons/fa';

const Security = () => {
  const [settings] = useState({
    twoFactor: true,
    passwordLastChanged: '2 weeks ago',
    lastLogin: '1 hour ago',
    activeDevices: 2,
  });

  const securityItems = [
    {
      icon: <FaKey />,
      title: 'Password',
      description: 'Last changed ' + settings.passwordLastChanged,
      action: 'Change',
    },
    {
      icon: <FaMobile />,
      title: 'Two-Factor Authentication',
      description: settings.twoFactor ? 'Enabled' : 'Disabled',
      action: 'Configure',
    },
    {
      icon: <FaLock />,
      title: 'Active Sessions',
      description: settings.activeDevices + ' devices connected',
      action: 'Manage',
    },
  ];

  return (
    <div className="has-navbar-spacing">
      <div className="page-wrapper">
        <div className="page-container">
          <div className="content-container">
            <div className="flex items-center space-x-3 mb-6">
              <FaShieldAlt className="w-6 h-6 text-gray-400" />
              <h1 className="text-2xl font-bold">Security Settings</h1>
            </div>

            <div className="space-y-4">
              {securityItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-black border border-white/5 hover:border-white/10 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-400">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
              <div className="p-4 bg-black border border-white/5">
                <p className="text-sm text-gray-400">
                  Last login: {settings.lastLogin}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security; 