import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from './button';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DatePicker: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Pick a date</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm text-muted-foreground">
        Date navigation / calendar content goes here.
      </PopoverContent>
    </Popover>
  ),
};
