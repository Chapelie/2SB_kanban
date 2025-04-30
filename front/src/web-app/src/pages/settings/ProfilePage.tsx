import React from 'react';
import SettingsLayout from './SettingsLayout';
import ProfileSettings from '../../components/settings/ProfileSettings';

const ProfilePage: React.FC = () => {
  return (
    <SettingsLayout>
      <ProfileSettings />
    </SettingsLayout>
  );
};

export default ProfilePage;