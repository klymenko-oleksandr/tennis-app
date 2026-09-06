import type { Meta, StoryObj } from '@storybook/react-vite';
import { CoachCard } from './coach-card';

const meta = {
  title: 'Baseline/CoachCard',
  component: CoachCard,
  tags: ['autodocs'],
  args: {
    name: 'Andriy Melnyk',
    credential: 'ITF Level 2 Coach',
    rating: '4.9',
    reviews: 58,
    price: '900 ₴',
    bio: 'Focused on technique and match strategy. Works with juniors and adult beginners building a first serve.',
    specialties: ['Junior coaching', 'Serve technique', 'Match strategy'],
    slots: [
      { day: 'Today', time: '18:00' },
      { day: 'Tomorrow', time: '09:00' },
      { day: 'Fri', time: '17:30' },
    ],
  },
} satisfies Meta<typeof CoachCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {};

export const Compact: Story = {
  args: { variant: 'compact' },
};
