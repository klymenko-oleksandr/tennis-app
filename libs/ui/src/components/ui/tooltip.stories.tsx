import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
import { Button } from './button';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            ?
          </Button>
        </TooltipTrigger>
        <TooltipContent>Cancellation window: 4 hours before start</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
