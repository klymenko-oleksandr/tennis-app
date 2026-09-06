import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CourtCard, CourtCardAdmin } from './court-card';

const meta = {
  title: 'Baseline/CourtCard',
  component: CourtCard,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['compact', 'full'] },
    surface: { control: 'select', options: ['Clay', 'Hard', 'Grass', 'Carpet'] },
  },
  args: {
    name: 'Pechersk Tennis Club',
    surface: 'Clay',
    area: 'Pechersk',
    distance: '1.2 km',
    rating: '4.8',
    reviews: 126,
    price: '480 ₴/h',
    nextSlot: 'Next slot · Today 18:00',
    variant: 'full',
  },
} satisfies Meta<typeof CourtCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {};

export const Compact: Story = {
  args: { variant: 'compact', nextSlot: undefined },
};

export const Favouritable: Story = {
  render: (args) => {
    function Controlled() {
      const [fav, setFav] = useState(false);
      return <CourtCard {...args} favourited={fav} onFavoriteToggle={() => setFav((f) => !f)} />;
    }
    return <Controlled />;
  },
};

export const Admin: Story = {
  render: () => {
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <div className="w-72">
          <CourtCardAdmin
            name="Court 1"
            surface="Clay"
            indoor
            open={open}
            rate="480 ₴/h"
            bookedToday={7}
            utilisation="72%"
            onToggleOpen={setOpen}
            onEdit={() => undefined}
            onBlockHours={() => undefined}
          />
        </div>
      );
    }
    return <Controlled />;
  },
};

export const Rail: Story = {
  render: () => (
    <div className="flex gap-3.5 overflow-x-auto p-1">
      <CourtCard
        variant="compact"
        name="Pechersk Tennis Club"
        surface="Clay"
        area="Pechersk"
        distance="1.2 km"
        rating="4.8"
        price="480 ₴/h"
      />
      <CourtCard
        variant="compact"
        name="Obolon Sport Complex"
        surface="Hard"
        area="Obolon"
        distance="3.4 km"
        rating="4.6"
        price="400 ₴/h"
      />
      <CourtCard
        variant="compact"
        name="Podil Lawn Courts"
        surface="Grass"
        area="Podil"
        distance="2.1 km"
        rating="4.9"
        price="650 ₴/h"
      />
    </div>
  ),
};
