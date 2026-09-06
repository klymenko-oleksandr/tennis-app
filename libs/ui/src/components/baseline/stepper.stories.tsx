import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './stepper';

const meta = {
  title: 'Baseline/Stepper',
  component: Stepper,
  tags: ['autodocs'],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Players: Story = {
  render: () => {
    function Controlled() {
      const [value, setValue] = useState(2);
      return <Stepper value={value} onValueChange={setValue} min={1} max={4} />;
    }
    return <Controlled />;
  },
};
