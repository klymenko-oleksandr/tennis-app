import type { Meta, StoryObj } from '@storybook/react-vite';
import { RevenueChart, type RevenueDay } from './revenue-chart';

const data: RevenueDay[] = [
  { label: 'M', percent: 62 },
  { label: 'T', percent: 71 },
  { label: 'W', percent: 58 },
  { label: 'T', percent: 80 },
  { label: 'F', percent: 94 },
  { label: 'S', percent: 88 },
  { label: 'S', percent: 64 },
];

const meta = {
  title: 'Baseline/RevenueChart',
  component: RevenueChart,
  tags: ['autodocs'],
  args: { total: '84.2k ₴', delta: '+9% vs last week', data },
} satisfies Meta<typeof RevenueChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminOverview: Story = {
  render: (args) => (
    <div className="w-80">
      <RevenueChart {...args} />
    </div>
  ),
};
