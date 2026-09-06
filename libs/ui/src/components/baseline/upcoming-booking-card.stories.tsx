import type { Meta, StoryObj } from '@storybook/react-vite';
import { UpcomingBookingCard } from './upcoming-booking-card';

const meta = {
  title: 'Baseline/UpcomingBookingCard',
  component: UpcomingBookingCard,
  tags: ['autodocs'],
  args: {
    court: 'Pechersk Tennis Club',
    when: 'Today',
    time: '18:00–19:00',
    detail: 'Court 2',
  },
} satisfies Meta<typeof UpcomingBookingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hero: Story = {
  render: (args) => (
    <div className="w-96">
      <UpcomingBookingCard {...args} />
    </div>
  ),
};

export const Compact: Story = {
  render: (args) => (
    <div className="w-72">
      <UpcomingBookingCard {...args} variant="compact" />
    </div>
  ),
};
