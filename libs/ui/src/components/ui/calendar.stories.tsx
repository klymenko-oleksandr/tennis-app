import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './calendar';

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateNavigation: Story = {
  render: () => {
    function Controlled() {
      const [date, setDate] = useState<Date | undefined>(new Date());
      return (
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl border" />
      );
    }
    return <Controlled />;
  },
};
