import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './dropdown-menu';
import { Button } from './button';

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClubSwitcher: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Pechersk Tennis Club</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Switch club</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Pechersk Tennis Club</DropdownMenuItem>
        <DropdownMenuItem>Obolon Sport Complex</DropdownMenuItem>
        <DropdownMenuItem>Podil Lawn Courts</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
