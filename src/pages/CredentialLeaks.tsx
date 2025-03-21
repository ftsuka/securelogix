
import React from 'react';
import { Layout } from '@/components/Dashboard/Layout';
import CredentialLeaksList from '@/components/CredentialLeaks/CredentialLeaksList';

const CredentialLeaks: React.FC = () => {
  return (
    <Layout>
      <CredentialLeaksList />
    </Layout>
  );
};

export default CredentialLeaks;
