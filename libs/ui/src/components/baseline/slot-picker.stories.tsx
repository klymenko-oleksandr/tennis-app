import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SlotPicker, type TimeSlot } from './slot-picker';

const sampleSlots: TimeSlot[] = [
  { time: '09:00', status: 'available' },
  { time: '10:00', status: 'booked' },
  { time: '11:00', status: 'available' },
  { time: '12:00', status: 'unavailable' },
  { time: '13:00', status: 'available' },
  { time: '14:00', status: 'available' },
  { time: '15:00', status: 'booked' },
  { time: '16:00', status: 'available' },
];

const meta = {
  title: 'Baseline/SlotPicker',
  component: SlotPicker,
  tags: ['autodocs'],
  args: { slots: sampleSlots },
} satisfies Meta<typeof SlotPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    function Controlled() {
      const [value, setValue] = useState<string | undefined>('11:00');
      return <SlotPicker {...args} value={value} onValueChange={setValue} />;
    }
    return <Controlled />;
  },
};

export const AllAvailable: Story = {
  args: {
    slots: sampleSlots.map((s) => ({ ...s, status: 'available' })),
  },
};

export const AllBooked: Story = {
  args: {
    slots: sampleSlots.map((s) => ({ ...s, status: 'booked' })),
  },
};
