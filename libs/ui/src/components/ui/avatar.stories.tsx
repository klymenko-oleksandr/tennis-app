import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
  },
  args: { size: 'default' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialsFallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>OK</AvatarFallback>
    </Avatar>
  ),
};

export const WithImage: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://i.pravatar.cc/128?img=12" alt="Player avatar" />
      <AvatarFallback>OK</AvatarFallback>
    </Avatar>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>OK</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};
