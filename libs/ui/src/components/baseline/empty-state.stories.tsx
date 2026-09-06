import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heart } from 'lucide-react';
import { EmptyState } from './empty-state';

const meta = {
  title: 'Baseline/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {
  render: () => (
    <div className="w-80">
      <EmptyState icon={<Heart className="size-10" />} description="Nothing saved here yet" />
    </div>
  ),
};

export const BoxedWithCta: Story = {
  render: () => (
    <div className="w-80">
      <EmptyState
        title="Nothing saved yet"
        description="Courts you favourite will show up here."
        ctaLabel="Explore courts"
        onCta={() => undefined}
      />
    </div>
  ),
};
