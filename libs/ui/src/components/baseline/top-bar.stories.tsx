import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopBar } from './top-bar';

const meta = {
  title: 'Baseline/TopBar',
  component: TopBar,
  tags: ['autodocs'],
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const App: Story = {
  args: { variant: 'app', ctaLabel: 'Find a hit', hasUnread: true },
};

export const Admin: Story = {
  args: {
    variant: 'admin',
    title: 'Bookings',
    subtitle: '41 bookings today',
    ctaLabel: 'New booking',
    onExport: () => undefined,
  },
};
