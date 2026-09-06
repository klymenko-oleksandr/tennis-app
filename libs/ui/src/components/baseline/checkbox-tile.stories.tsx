import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxTile } from './checkbox-tile';

const meta = {
  title: 'Baseline/CheckboxTile',
  component: CheckboxTile,
  tags: ['autodocs'],
  args: { label: 'Racket rental', description: '+60 ₴' },
} satisfies Meta<typeof CheckboxTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <CheckboxTile {...args} checked={checked} onCheckedChange={setChecked} />;
    }
    return <Controlled />;
  },
};

export const AddOnsList: Story = {
  render: () => {
    function Controlled() {
      const [state, setState] = useState({ racket: true, balls: false });
      return (
        <div className="flex w-72 flex-col gap-2">
          <CheckboxTile
            label="Racket rental"
            description="+60 ₴"
            checked={state.racket}
            onCheckedChange={(v) => setState((s) => ({ ...s, racket: v }))}
          />
          <CheckboxTile
            label="Ball tube"
            description="+90 ₴"
            checked={state.balls}
            onCheckedChange={(v) => setState((s) => ({ ...s, balls: v }))}
          />
        </div>
      );
    }
    return <Controlled />;
  },
};
