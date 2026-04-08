'use client';
import { Form, Input, Select, Button, Upload, Space, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Deck, DeckCard, DeckFormat, FORMAT_RULES } from '@/types';
import { CardSearchInput } from '@/components/CardSearchInput';
import { DeckCardList } from '@/components/DeckCardList';

const FORMAT_OPTIONS = (Object.keys(FORMAT_RULES) as DeckFormat[]).map(f => ({
  label: FORMAT_RULES[f].label,
  value: f,
}));

interface Props {
  initialDeck?: Deck;
  onSubmit: (data: Partial<Deck>) => Promise<void>;
}

export function DeckForm({ initialDeck, onSubmit }: Props) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [cards, setCards] = useState<DeckCard[]>(initialDeck?.cards || []);
  const [coverImage, setCoverImage] = useState(initialDeck?.coverImage || '');
  const [loading, setLoading] = useState(false);

  const handleAddCard = (card: DeckCard) => {
    setCards(prev => {
      const existing = prev.find(c => c.name === card.name && c.set === card.set);
      if (existing) {
        return prev.map(c =>
          c.id === existing.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, card];
    });
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, quantity: qty } : c));
  };

  const handleRemoveCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const totalCards = cards.reduce((s, c) => s + c.quantity, 0);
  const totalPrice = cards.reduce((s, c) => s + c.price * c.quantity, 0);

  const handleFinish = async (values: { name: string; format: DeckFormat }) => {
    const format = values.format;
    const rules = FORMAT_RULES[format];
    if (totalCards < rules.min) {
      message.error(`${format} requires at least ${rules.min} cards. You have ${totalCards}.`);
      return;
    }
    if (totalCards > rules.max) {
      message.error(`${format} allows at most ${rules.max} cards. You have ${totalCards}.`);
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ ...values, coverImage, cards });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (info: { file: { originFileObj?: File } & Partial<File> }) => {
    const file = (info.file.originFileObj || info.file) as File;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCoverImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
    return false;
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: initialDeck?.name, format: initialDeck?.format || 'Standard' }}
        onFinish={handleFinish}
      >
        <Form.Item name="name" label="Deck Name" rules={[{ required: true }]}>
          <Input size="large" placeholder="My Awesome Deck" />
        </Form.Item>
        <Form.Item name="format" label="Format" rules={[{ required: true }]}>
          <Select size="large" options={FORMAT_OPTIONS} />
        </Form.Item>
        <Form.Item label="Cover Image">
          <Space>
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageUpload}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
            </Upload>
            {coverImage && (
              <img src={coverImage} alt="cover" style={{ height: 60, borderRadius: 4 }} />
            )}
          </Space>
        </Form.Item>

        <Typography.Title level={4}>
          Card Search
          <Typography.Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal', marginLeft: 16 }}>
            {totalCards} cards · ${totalPrice.toFixed(2)}
          </Typography.Text>
        </Typography.Title>
        
        <CardSearchInput onAddCard={handleAddCard} />

        {cards.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <DeckCardList
              cards={cards}
              editable
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveCard={handleRemoveCard}
            />
          </div>
        )}

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              {initialDeck ? 'Save Changes' : 'Create Deck'}
            </Button>
            <Button onClick={() => router.back()} size="large">Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
}
