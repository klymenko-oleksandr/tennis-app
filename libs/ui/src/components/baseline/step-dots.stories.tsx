import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepDots } from './step-dots';

const meta = {
  title: 'Baseline/StepDots',
  component: StepDots,
  tags: ['autodocs'],
  argTypes: {
    step: { control: { type: 'number', min: 1, max: 3 } },
  },
  args: { step: 2, totalSteps: 3 },
} satisfies Meta<typeof StepDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onBack: () => undefined },
};

export const FirstStepNoBack: Story = {
  args: { step: 1 },
};

export const AllSet: Story = {
  args: { step: 3, label: 'All set' },
};
