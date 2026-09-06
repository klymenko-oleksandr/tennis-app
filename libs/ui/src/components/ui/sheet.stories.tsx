import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from './sheet';
import { Button } from './button';

const meta = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BookingDrawer: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button>Open booking</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Booking #1042</SheetTitle>
          <SheetDescription>Pechersk Tennis Club · Today, 18:00–19:00</SheetDescription>
        </SheetHeader>
        <div className="px-4 text-sm text-muted-foreground">
          Player, contact and payment details go here.
        </div>
        <SheetFooter>
          <Button variant="secondary">Reschedule</Button>
          <SheetClose asChild>
            <Button variant="destructive">Cancel booking</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
