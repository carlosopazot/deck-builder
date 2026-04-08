'use client';
import { Layout, Button, Space, Typography, Menu } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

const { Header } = Layout;
const { Title } = Typography;

export function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const menuItems = user ? [
    { key: '/', label: 'Home', onClick: () => router.push('/') },
    { key: '/decks', label: 'My Decks', onClick: () => router.push('/decks') },
  ] : [];

  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1a2e' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Title level={4} style={{ color: 'white', margin: 0 }}>⚔️ MTG Deck Builder</Title>
        {user && (
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={menuItems}
            style={{ background: 'transparent', borderBottom: 'none', color: 'white' }}
            theme="dark"
          />
        )}
      </div>
      <Space>
        {user ? (
          <>
            <Typography.Text style={{ color: 'rgba(255,255,255,0.8)' }}>
              {user.name}
            </Typography.Text>
            <Button onClick={handleLogout} type="default">Logout</Button>
          </>
        ) : (
          <>
            <Button onClick={() => router.push('/login')}>Login</Button>
            <Button type="primary" onClick={() => router.push('/register')}>Register</Button>
          </>
        )}
      </Space>
    </Header>
  );
}
