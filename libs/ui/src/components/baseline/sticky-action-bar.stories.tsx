import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickyActionBar } from './sticky-action-bar';

const meta = {
  title: 'Baseline/StickyActionBar',
  component: StickyActionBar,
  tags: ['autodocs'],
} satisfies Meta<typeof StickyActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CourtDetail: Story = {
  args: { ctaLabel: 'Book a court', price: '480 ₴/h' },
  render: (args) => (
    <div className="w-96 overflow-hidden rounded-xl border border-border">
      <StickyActionBar {...args} />
    </div>
  ),
};

export const BookingFlow: Story = {
  args: { ctaLabel: 'Continue to payment', summaryLabel: '1h · Pechersk Tennis Club', total: '480 ₴' },
  render: (args) => (
    <div className="w-96 overflow-hidden rounded-xl border border-border">
      <StickyActionBar {...args} />
    </div>
  ),
};
