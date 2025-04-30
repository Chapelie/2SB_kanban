import React from 'react';
import { Outlet } from 'react-router-dom';

const SettingsLayout: React.FC = () => {
  return (
    <div className="flex flex-col p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h1>
      <div className="bg-white rounded-lg shadow-md p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;