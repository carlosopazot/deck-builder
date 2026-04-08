'use client';
import { Button, Space, Typography, Tag, Statistic, Row, Col, Card, Spin } from 'antd';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useDeck } from '@/hooks/useDeck';
import { DeckCardList } from '@/components/DeckCardList';

export default function DeckDetailPage() {
  const params = useParams();
  const { deck, loading } = useDeck(params.id as string);
  const router = useRouter();

  if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }} />;
  if (!deck) return <Typography.Text>Deck not found</Typography.Text>;

  const totalCards = deck.cards.reduce((s, c) => s + c.quantity, 0);
  const totalPrice = deck.cards.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/decks')}>Back to Decks</Button>
      
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            {deck.coverImage ? (
              <img src={deck.coverImage} alt={deck.name} style={{ width: '100%', borderRadius: 8 }} />
            ) : (
              <div style={{ height: 200, background: 'linear-gradient(135deg, #1a1a2e, #16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, borderRadius: 8 }}>⚔️</div>
            )}
          </Col>
          <Col xs={24} md={18}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Typography.Title level={2} style={{ margin: 0 }}>{deck.name}</Typography.Title>
                <Tag color="blue" style={{ marginTop: 8 }}>{deck.format}</Tag>
              </div>
              <Row gutter={16}>
                <Col>
                  <Statistic title="Total Cards" value={totalCards} />
                </Col>
                <Col>
                  <Statistic title="Total Price" value={`$${totalPrice.toFixed(2)}`} />
                </Col>
              </Row>
              <Button type="primary" icon={<EditOutlined />} onClick={() => router.push(`/decks/${deck.id}/edit`)}>
                Edit Deck
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card title="Cards">
        {deck.cards.length === 0 ? (
          <Typography.Text type="secondary">No cards in this deck.</Typography.Text>
        ) : (
          <DeckCardList cards={deck.cards} />
        )}
      </Card>
    </Space>
  );
}
