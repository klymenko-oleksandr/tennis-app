import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoiceChip } from './choice-chip';

const meta = {
  title: 'Baseline/ChoiceChip',
  component: ChoiceChip,
  tags: ['autodocs'],
  args: { children: 'Clay', selected: false },
} satisfies Meta<typeof ChoiceChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SurfaceFilters: Story = {
  render: () => {
    function Controlled() {
      const options = ['Clay', 'Hard', 'Grass', 'Carpet'];
      const [selected, setSelected] = useState('Clay');
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <ChoiceChip key={opt} selected={selected === opt} onClick={() => setSelected(opt)}>
              {opt}
            </ChoiceChip>
          ))}
        </div>
      );
    }
    return <Controlled />;
  },
};

export const NtrpLevels: Story = {
  render: () => {
    function Controlled() {
      const levels = [
        { value: '2.5', label: 'Beginner' },
        { value: '3.0', label: 'Advanced beginner' },
        { value: '3.5', label: 'Intermediate' },
        { value: '4.0', label: 'Consistent' },
        { value: '4.5', label: 'Advanced' },
        { value: '5.0+', label: 'Tournament' },
      ];
      const [selected, setSelected] = useState('4.0');
      return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2">
          {levels.map((lvl) => (
            <ChoiceChip
              key={lvl.value}
              selected={selected === lvl.value}
              onClick={() => setSelected(lvl.value)}
              className="flex-col items-start rounded-xl"
            >
              <span className="text-[15px] font-bold">{lvl.value}</span>
              <span className="block text-[11.5px] opacity-75">{lvl.label}</span>
            </ChoiceChip>
          ))}
        </div>
      );
    }
    return <Controlled />;
  },
};
