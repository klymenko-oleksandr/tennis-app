import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './slider';

const meta = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: { defaultValue: [50], max: 100, step: 1, disabled: false },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Slider {...args} className="w-72" />,
};

export const MaxPrice: Story = {
  render: () => {
    function Controlled() {
      const [value, setValue] = useState([800]);
      return (
        <div className="w-72 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Max price
            </span>
            <span className="font-semibold">{value[0]} ₴/h</span>
          </div>
          <Slider value={value} onValueChange={setValue} max={1500} step={10} />
        </div>
      );
    }
    return <Controlled />;
  },
};
