import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './table';
import { StatusBadge } from '../baseline/status-badge';

const meta = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { player: 'Olena K.', when: 'Today, 18:00', court: 'Pechersk Tennis Club', total: '480 ₴', status: 'Confirmed' as const },
  { player: 'Dmytro P.', when: 'Tomorrow, 09:00', court: 'Obolon Sport Complex', total: '400 ₴', status: 'Pending' as const },
  { player: 'Sofiia M.', when: 'Yesterday, 20:00', court: 'Podil Lawn Courts', total: '650 ₴', status: 'No-show' as const },
];

export const BookingsQueue: Story = {
  render: () => (
    <Table className="w-[560px]">
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>When</TableHead>
          <TableHead>Court</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.player}>
            <TableCell className="font-medium">{row.player}</TableCell>
            <TableCell>{row.when}</TableCell>
            <TableCell>{row.court}</TableCell>
            <TableCell>{row.total}</TableCell>
            <TableCell>
              <StatusBadge status={row.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
