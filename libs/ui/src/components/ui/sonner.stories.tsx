import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import { Toaster } from './sonner';
import { Button } from './button';

const meta = {
  title: 'UI/Toaster (Sonner)',
  component: Toaster,
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BookingConfirmed: Story = {
  render: () => (
    <div>
      <Button onClick={() => toast.success('Booking confirmed · 480 ₴')}>
        Show confirmation toast
      </Button>
      <Toaster position="bottom-right" />
    </div>
  ),
};
