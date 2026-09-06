import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kicker } from './kicker';

const meta = {
  title: 'Baseline/Kicker',
  component: Kicker,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['muted', 'brand', 'onDark'] },
    children: { control: 'text' },
  },
  args: { children: 'Next up · Today', tone: 'muted' },
} satisfies Meta<typeof Kicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const OnDark: Story = {
  render: (args) => (
    <div className="rounded-xl bg-sidebar p-4">
      <Kicker {...args} tone="onDark" />
    </div>
  ),
};
