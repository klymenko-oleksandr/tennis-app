import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'soft', 'ghost', 'destructive', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon', 'icon-sm'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Book now · 480 ₴',
    variant: 'default',
    size: 'default',
    disabled: false,
    loading: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['default', 'secondary', 'soft', 'ghost', 'destructive', 'outline'] as const).map(
        (variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant}
          </Button>
        )
      )}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};
