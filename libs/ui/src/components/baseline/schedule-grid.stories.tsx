import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScheduleGrid, ScheduleLegend, type ScheduleRow } from './schedule-grid';

const hours = Array.from({ length: 15 }, (_, i) => `${(7 + i).toString().padStart(2, '0')}:00`);

const rows: ScheduleRow[] = [
  {
    courtName: 'Court 1',
    surface: 'Clay',
    blocks: [
      { start: 8, duration: 1.5, kind: 'booking', title: 'Olena K.', subtitle: '08:00–09:30' },
      { start: 11, duration: 1, kind: 'lesson', title: 'Lesson · A. Melnyk', subtitle: '11:00–12:00' },
      { start: 17, duration: 2, kind: 'booking', title: 'Dmytro P.', subtitle: '17:00–19:00' },
    ],
  },
  {
    courtName: 'Court 2',
    surface: 'Hard',
    blocks: [
      { start: 7, duration: 2, kind: 'maintenance', title: 'Maintenance', subtitle: '07:00–09:00' },
      { start: 14, duration: 1, kind: 'blocked', title: 'Blocked', subtitle: '14:00–15:00' },
      { start: 19, duration: 1.5, kind: 'booking', title: 'Sofiia M.', subtitle: '19:00–20:30' },
    ],
  },
  {
    courtName: 'Court 3',
    surface: 'Grass',
    blocks: [{ start: 9, duration: 1, kind: 'booking', title: 'Andriy T.', subtitle: '09:00–10:00' }],
  },
];

const meta = {
  title: 'Baseline/ScheduleGrid',
  component: ScheduleGrid,
  tags: ['autodocs'],
  args: { hours, startHour: 7, rows },
} satisfies Meta<typeof ScheduleGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminDay: Story = {
  render: (args) => (
    <div className="space-y-3">
      <ScheduleLegend />
      <ScheduleGrid {...args} />
    </div>
  ),
};
