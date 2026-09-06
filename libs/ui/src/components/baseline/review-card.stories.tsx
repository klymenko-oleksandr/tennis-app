import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReviewCard } from './review-card';

const meta = {
  title: 'Baseline/ReviewCard',
  component: ReviewCard,
  tags: ['autodocs'],
  args: {
    name: 'Olena K.',
    when: '3 days ago',
    rating: '5.0',
    text: 'Great court, well maintained. The lines were freshly painted and the surface played fast and true.',
  },
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-96">
      <ReviewCard {...args} />
    </div>
  ),
};
