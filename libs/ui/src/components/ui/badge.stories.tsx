import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    children: { control: 'text' },
  },
  args: { children: 'NTRP 4.0', variant: 'default' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const).map(
        (variant) => (
          <Badge key={variant} {...args} variant={variant}>
            {variant}
          </Badge>
        )
      )}
    </div>
  ),
};
