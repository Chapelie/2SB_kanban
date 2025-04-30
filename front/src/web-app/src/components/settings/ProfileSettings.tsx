import React, { useState } from 'react';

const ProfileSettings: React.FC = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    // Logic to save profile settings
    console.log('Profile settings saved:', { name, avatar, bio });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
        <input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows={4}
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white rounded-md px-4 py-2"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfileSettings;