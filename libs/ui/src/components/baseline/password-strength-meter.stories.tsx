import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordStrengthMeter } from './password-strength-meter';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'Baseline/PasswordStrengthMeter',
  component: PasswordStrengthMeter,
  tags: ['autodocs'],
} satisfies Meta<typeof PasswordStrengthMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeToSeeStrength: Story = {
  render: () => {
    function Controlled() {
      const [password, setPassword] = useState('');
      return (
        <div className="w-72">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <PasswordStrengthMeter password={password} />
        </div>
      );
    }
    return <Controlled />;
  },
};
