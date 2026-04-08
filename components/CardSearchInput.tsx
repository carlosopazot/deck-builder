'use client';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ScryfallCard, DeckCard } from '@/types';
import { useCardSearch } from '@/hooks/useCardSearch';
import { getCardImageUrl, getCardPrice } from '@/services/scryfall/api';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onAddCard: (card: DeckCard) => void;
}

export function CardSearchInput({ onAddCard }: Props) {
  const { results, loading, search } = useCardSearch();
  const [value, setValue] = useState('');

  const options = results.map(card => ({
    value: card.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img
          src={getCardImageUrl(card) || '/placeholder.png'}
          alt={card.name}
          style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 2 }}
        />
        <div>
          <div style={{ fontWeight: 600 }}>{card.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{card.set_name} · {card.mana_cost}</div>
          <div style={{ fontSize: 12, color: '#52c41a' }}>${getCardPrice(card).toFixed(2)}</div>
        </div>
      </div>
    ),
    card,
  }));

  const handleSelect = (_: string, option: { value: string; label: React.ReactNode; card: ScryfallCard }) => {
    const card: ScryfallCard = option.card;
    const deckCard: DeckCard = {
      id: uuidv4(),
      name: card.name,
      set: card.set,
      setName: card.set_name,
      manaCost: card.mana_cost || '',
      typeLine: card.type_line,
      price: getCardPrice(card),
      imageUrl: getCardImageUrl(card),
      quantity: 1,
    };
    onAddCard(deckCard);
    setValue('');
  };

  return (
    <AutoComplete
      options={options}
      onSearch={(val) => { setValue(val); search(val); }}
      onSelect={handleSelect}
      value={value}
      style={{ width: '100%' }}
    >
      <Input
        size="large"
        placeholder="Search for a card..."
        prefix={<SearchOutlined />}
      />
    </AutoComplete>
  );
}
