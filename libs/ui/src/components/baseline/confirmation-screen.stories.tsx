import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmationScreen } from './confirmation-screen';

const meta = {
  title: 'Baseline/ConfirmationScreen',
  component: ConfirmationScreen,
  tags: ['autodocs'],
  args: {
    heading: 'Booking confirmed',
    subline: 'Confirmation code · BK-4821',
    primaryLabel: 'View in my bookings',
    secondaryLabel: 'Back to home',
  },
} satisfies Meta<typeof ConfirmationScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BookingConfirm: Story = {
  render: (args) => (
    <div className="w-96">
      <ConfirmationScreen
        {...args}
        summary={
          <div className="rounded-xl border border-border bg-card p-4 text-left">
            <div className="text-sm font-semibold text-foreground">Pechersk Tennis Club</div>
            <div className="mt-1 text-xs text-neutral-400">Today, 18:00–19:00 · Court 2</div>
          </div>
        }
      />
    </div>
  ),
};
