import type { Meta, StoryObj } from '@storybook/react-vite';
import { OccupancyChart, type OccupancyBar } from './occupancy-chart';

const data: OccupancyBar[] = [2, 3, 4, 5, 4, 3, 4, 5, 4, 5, 6, 6, 5, 4, 2].map((booked, i) => ({
  hour: `${(7 + i).toString().padStart(2, '0')}`,
  booked,
}));

const meta = {
  title: 'Baseline/OccupancyChart',
  component: OccupancyChart,
  tags: ['autodocs'],
  args: { data, courtCount: 6 },
} satisfies Meta<typeof OccupancyChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminOverview: Story = {
  render: (args) => (
    <div className="w-[520px] rounded-xl border border-border bg-card p-5">
      <OccupancyChart {...args} />
    </div>
  ),
};
