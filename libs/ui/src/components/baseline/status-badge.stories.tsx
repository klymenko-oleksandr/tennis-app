import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge, type BookingStatus } from './status-badge';

const statuses: BookingStatus[] = ['Confirmed', 'Pending', 'Checked-in', 'No-show', 'Cancelled'];

const meta = {
  title: 'Baseline/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: statuses },
  },
  args: { status: 'Confirmed' },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {statuses.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};
