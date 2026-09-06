import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerCard } from './player-card';

const meta = {
  title: 'Baseline/PlayerCard',
  component: PlayerCard,
  tags: ['autodocs'],
  args: {
    name: 'Sofiia Marchenko',
    area: 'Podil',
    hand: 'Right-handed',
    ntrp: '4.0',
    availability: 'Free evenings',
    note: 'Looking for a consistent hitting partner, 2–3 times a week.',
    stats: [
      { label: 'Matches', value: '24' },
      { label: 'Win rate', value: '62%' },
    ],
  },
} satisfies Meta<typeof PlayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
