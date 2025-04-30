import React from 'react';
import SettingsLayout from './SettingsLayout';
import AccountSettings from '../../components/settings/AccountSettings';

const AccountPage: React.FC = () => {
  return (
    <SettingsLayout>
      <AccountSettings />
    </SettingsLayout>
  );
};

export default AccountPage;