import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthShell } from './auth-shell';
import { StepDots } from './step-dots';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Baseline/AuthShell',
  component: AuthShell,
  tags: ['autodocs'],
  args: {
    headline: 'Book courts across Kyiv in seconds',
    subhead: 'Join thousands of players finding courts, coaches, and hitting partners.',
    stats: [
      { value: '40+', label: 'Courts' },
      { value: '2.4k', label: 'Players' },
      { value: '18', label: 'Coaches' },
    ],
  },
} satisfies Meta<typeof AuthShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignupStep: Story = {
  render: (args) => (
    <AuthShell {...args} footer="Need help? Contact support">
      <StepDots step={1} totalSteps={3} className="mb-8" />
      <h1 className="text-xl font-semibold text-foreground">Create your account</h1>
      <div className="mt-6 flex flex-col gap-4">
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@example.com" className="mt-1.5" />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" className="mt-1.5" />
        </div>
        <Button size="lg" className="mt-2">
          Continue
        </Button>
      </div>
    </AuthShell>
  ),
};
