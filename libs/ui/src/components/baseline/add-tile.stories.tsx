import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddTile } from './add-tile';

const meta = {
  title: 'Baseline/AddTile',
  component: AddTile,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['tile', 'bar'] },
  },
} satisfies Meta<typeof AddTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tile: Story = {
  args: { label: 'Add a court', variant: 'tile' },
  render: (args) => (
    <div className="w-64">
      <AddTile {...args} />
    </div>
  ),
};

export const Bar: Story = {
  args: { label: 'Invite a coach', variant: 'bar' },
  render: (args) => (
    <div className="w-80">
      <AddTile {...args} />
    </div>
  ),
};
