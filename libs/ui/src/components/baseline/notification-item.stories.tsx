import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationItem } from './notification-item';

const meta = {
  title: 'Baseline/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  args: {
    icon: '✓',
    iconBg: '#E7F0E9',
    iconColor: '#1F8A5B',
    title: 'Booking confirmed',
    body: 'Pechersk Tennis Club · Today 18:00–19:00',
    when: '2h ago',
    unread: true,
  },
} satisfies Meta<typeof NotificationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const List: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-2">
      <NotificationItem
        icon="✓"
        iconBg="#E7F0E9"
        iconColor="#1F8A5B"
        title="Booking confirmed"
        body="Pechersk Tennis Club · Today 18:00–19:00"
        when="2h ago"
        unread
      />
      <NotificationItem
        icon="★"
        iconBg="#F0F8F4"
        iconColor="#0D5C3A"
        title="New review request"
        body="How was your match with Dmytro?"
        when="1d ago"
      />
    </div>
  ),
};
