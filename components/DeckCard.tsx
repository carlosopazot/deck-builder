'use client';
import { Card, Tag, Typography, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Deck } from '@/types';

interface Props {
  deck: Deck;
  onDelete: (id: string) => void;
}

export function DeckCard({ deck, onDelete }: Props) {
  const router = useRouter();
  const totalCards = deck.cards.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = deck.cards.reduce((sum, c) => sum + c.price * c.quantity, 0);

  return (
    <Card
      hoverable
      cover={
        deck.coverImage
          ? <img alt={deck.name} src={deck.coverImage} style={{ height: 200, objectFit: 'cover' }} />
          : <div style={{ height: 200, background: 'linear-gradient(135deg, #1a1a2e, #16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>⚔️</div>
      }
      actions={[
        <Button key="view" type="link" icon={<EyeOutlined />} onClick={() => router.push(`/decks/${deck.id}`)}>View</Button>,
        <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => router.push(`/decks/${deck.id}/edit`)}>Edit</Button>,
        <Popconfirm key="delete" title="Delete this deck?" onConfirm={() => onDelete(deck.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>,
      ]}
    >
      <Card.Meta
        title={deck.name}
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Tag color="blue">{deck.format}</Tag>
            <Space>
              <Typography.Text type="secondary">{totalCards} cards</Typography.Text>
              <Typography.Text type="success">${totalPrice.toFixed(2)}</Typography.Text>
            </Space>
          </Space>
        }
      />
    </Card>
  );
}
