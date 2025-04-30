import React from 'react';
import NotificationSettings from '../../components/settings/NotificationSettings';
import SettingsLayout from './SettingsLayout';

const NotificationsPage: React.FC = () => {
  return (
    <SettingsLayout>
      <NotificationSettings />
    </SettingsLayout>
  );
};

export default NotificationsPage;