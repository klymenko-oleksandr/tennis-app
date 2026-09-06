import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard } from './stat-card';

const meta = {
  title: 'Baseline/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  args: {
    label: 'Bookings today',
    value: '41',
    delta: '+6',
    deltaDirection: 'up',
    hint: 'vs same day last week',
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AdminOverviewGrid: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5">
      <StatCard label="Bookings today" value="41" delta="+6" hint="vs same day last week" />
      <StatCard label="Revenue today" value="18.4k ₴" delta="+12%" hint="vs same day last week" />
      <StatCard
        label="Cancellations"
        value="3"
        delta="-2"
        deltaDirection="down"
        hint="vs same day last week"
      />
      <StatCard label="Utilisation" value="72%" delta="+4%" hint="7-day average" />
    </div>
  ),
};
