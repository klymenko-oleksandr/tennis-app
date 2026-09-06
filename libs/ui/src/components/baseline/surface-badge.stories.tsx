import type { Meta, StoryObj } from '@storybook/react-vite';
import { SurfaceBadge, type CourtSurface } from './surface-badge';

const surfaces: CourtSurface[] = ['Clay', 'Hard', 'Grass', 'Carpet'];

const meta = {
  title: 'Baseline/SurfaceBadge',
  component: SurfaceBadge,
  tags: ['autodocs'],
  argTypes: {
    surface: { control: 'select', options: surfaces },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { surface: 'Clay', size: 'md' },
} satisfies Meta<typeof SurfaceBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllSurfaces: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {surfaces.map((surface) => (
        <SurfaceBadge key={surface} {...args} surface={surface} />
      ))}
    </div>
  ),
};
