'use client';
import { ConfigProvider, Layout, theme } from 'antd';
import { AuthProvider } from './AuthProvider';
import { NavBar } from './NavBar';
import { ReactNode } from 'react';

const { Content } = Layout;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#722ed1',
          borderRadius: 8,
        },
      }}
    >
      <AuthProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <NavBar />
          <Content style={{ padding: '24px' }}>
            {children}
          </Content>
        </Layout>
      </AuthProvider>
    </ConfigProvider>
  );
}
