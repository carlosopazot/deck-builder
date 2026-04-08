'use client';
import { Button, Row, Col, Typography, Space, Empty, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useDecks } from '@/hooks/useDeck';
import { DeckCard } from '@/components/DeckCard';

export default function DecksPage() {
  const { decks, loading, deleteDeck } = useDecks();
  const router = useRouter();

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={2} style={{ margin: 0 }}>My Decks</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/decks/new')}>
          New Deck
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : decks.length === 0 ? (
        <Empty description="No decks yet.">
          <Button type="primary" onClick={() => router.push('/decks/new')}>Create Deck</Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {decks.map(deck => (
            <Col xs={24} sm={12} md={8} lg={6} key={deck.id}>
              <DeckCard deck={deck} onDelete={deleteDeck} />
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
}
