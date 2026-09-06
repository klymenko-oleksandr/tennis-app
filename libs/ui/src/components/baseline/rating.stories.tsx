import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating } from './rating';

const meta = {
  title: 'Baseline/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { value: '4.8', reviews: 126, size: 'md' },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutReviews: Story = {
  args: { reviews: undefined },
};
