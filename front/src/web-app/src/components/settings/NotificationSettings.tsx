import React, { useState } from 'react';

const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleEmailChange = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleSmsChange = () => {
    setSmsNotifications(!smsNotifications);
  };

  const handlePushChange = () => {
    setPushNotifications(!pushNotifications);
  };

  const handleSave = () => {
    // Logic to save notification preferences
    console.log('Notification preferences saved:', {
      emailNotifications,
      smsNotifications,
      pushNotifications,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={handleEmailChange}
          className="mr-2"
        />
        <label>Email Notifications</label>
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={smsNotifications}
          onChange={handleSmsChange}
          className="mr-2"
        />
        <label>SMS Notifications</label>
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={pushNotifications}
          onChange={handlePushChange}
          className="mr-2"
        />
        <label>Push Notifications</label>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default NotificationSettings;