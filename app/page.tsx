'use client';
import { Button, Row, Col, Typography, Space, Empty, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDecks } from '@/hooks/useDeck';
import { DeckCard } from '@/components/DeckCard';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { decks, loading: decksLoading, deleteDeck } = useDecks();
  const router = useRouter();

  if (authLoading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }} />;

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80 }}>
        <Typography.Title>⚔️ MTG Deck Builder</Typography.Title>
        <Typography.Paragraph style={{ fontSize: 18 }}>
          Build and manage your Magic: The Gathering decks
        </Typography.Paragraph>
        <Space>
          <Button type="primary" size="large" onClick={() => router.push('/login')}>Login</Button>
          <Button size="large" onClick={() => router.push('/register')}>Register</Button>
        </Space>
      </div>
    );
  }

  const recentDecks = decks.slice(0, 6);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={2} style={{ margin: 0 }}>Recent Decks</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/decks/new')}>
          New Deck
        </Button>
      </div>

      {decksLoading ? (
        <Spin />
      ) : recentDecks.length === 0 ? (
        <Empty description="No decks yet. Create your first deck!">
          <Button type="primary" onClick={() => router.push('/decks/new')}>Create Deck</Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {recentDecks.map(deck => (
            <Col xs={24} sm={12} md={8} lg={6} key={deck.id}>
              <DeckCard deck={deck} onDelete={deleteDeck} />
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
}
