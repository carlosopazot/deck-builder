'use client';
import { Table, Typography, InputNumber, Button, Tabs, Space } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';
import { DeckCard } from '@/types';
import { MAX_CARD_QUANTITY } from '@/lib/constants';

const CARD_GROUPS = [
  { key: 'Commander', match: (t: string) => t.toLowerCase().includes('legendary') && t.toLowerCase().includes('creature') },
  { key: 'Creatures', match: (t: string) => t.toLowerCase().includes('creature') },
  { key: 'Planeswalkers', match: (t: string) => t.toLowerCase().includes('planeswalker') },
  { key: 'Instants', match: (t: string) => t.toLowerCase().includes('instant') },
  { key: 'Sorceries', match: (t: string) => t.toLowerCase().includes('sorcery') },
  { key: 'Enchantments', match: (t: string) => t.toLowerCase().includes('enchantment') },
  { key: 'Artifacts', match: (t: string) => t.toLowerCase().includes('artifact') },
  { key: 'Lands', match: (t: string) => t.toLowerCase().includes('land') },
  { key: 'Other', match: () => true },
];

function groupCards(cards: DeckCard[]) {
  const groups: Record<string, DeckCard[]> = {};
  const assigned = new Set<string>();

  for (const group of CARD_GROUPS) {
    const matching = cards.filter(c => !assigned.has(c.id) && group.match(c.typeLine));
    if (matching.length > 0) {
      groups[group.key] = matching;
      matching.forEach(c => assigned.add(c.id));
    }
  }

  return groups;
}

interface Props {
  cards: DeckCard[];
  editable?: boolean;
  onUpdateQuantity?: (id: string, qty: number) => void;
  onRemoveCard?: (id: string) => void;
}

function getColumns(
  editable: boolean,
  onUpdateQuantity?: (id: string, qty: number) => void,
  onRemoveCard?: (id: string) => void,
): ColumnType<DeckCard>[] {
  const cols: ColumnType<DeckCard>[] = [
    {
      title: 'Qty',
      dataIndex: 'quantity',
      width: 80,
      render: (qty: number, record: DeckCard) =>
        editable ? (
          <InputNumber
            min={1}
            max={MAX_CARD_QUANTITY}
            value={qty}
            size="small"
            onChange={(val) => val && onUpdateQuantity?.(record.id, val)}
          />
        ) : qty,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name: string, record: DeckCard) => (
        <Space>
          {record.imageUrl && (
            <img src={record.imageUrl} alt={name} style={{ width: 24, height: 34, objectFit: 'cover', borderRadius: 2 }} />
          )}
          {name}
        </Space>
      ),
    },
    { title: 'Edition', dataIndex: 'setName', width: 120 },
    { title: 'Mana Cost', dataIndex: 'manaCost', width: 120 },
    {
      title: 'Price',
      dataIndex: 'price',
      width: 80,
      render: (p: number, r: DeckCard) => `$${(p * r.quantity).toFixed(2)}`,
    },
  ];

  if (editable) {
    cols.push({
      title: '',
      dataIndex: 'id',
      width: 40,
      render: (_: string, record: DeckCard) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => onRemoveCard?.(record.id)}
        />
      ),
    });
  }

  return cols;
}

export function DeckCardList({ cards, editable = false, onUpdateQuantity, onRemoveCard }: Props) {
  const groups = groupCards(cards);
  const cols = getColumns(editable, onUpdateQuantity, onRemoveCard);

  const groupedTab = (
    <div>
      {Object.entries(groups).map(([groupName, groupCards]) => (
        <div key={groupName} style={{ marginBottom: 24 }}>
          <Typography.Title level={5} style={{ marginBottom: 8 }}>
            {groupName} ({groupCards.reduce((s, c) => s + c.quantity, 0)})
          </Typography.Title>
          <Table
            dataSource={groupCards}
            columns={cols}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </div>
      ))}
    </div>
  );

  const listTab = (
    <Table
      dataSource={cards}
      columns={cols}
      rowKey="id"
      pagination={false}
      size="small"
    />
  );

  return (
    <Tabs
      items={[
        { key: 'grouped', label: 'Grouped by Type', children: groupedTab },
        { key: 'list', label: 'List View', children: listTab },
      ]}
    />
  );
}
