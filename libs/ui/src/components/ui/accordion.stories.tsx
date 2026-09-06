import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterRail: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="surface" className="w-72">
      <AccordionItem value="surface">
        <AccordionTrigger>Surface</AccordionTrigger>
        <AccordionContent>Clay, Hard, Grass, Carpet</AccordionContent>
      </AccordionItem>
      <AccordionItem value="indoor">
        <AccordionTrigger>Indoor / Outdoor</AccordionTrigger>
        <AccordionContent>Indoor, Outdoor</AccordionContent>
      </AccordionItem>
      <AccordionItem value="price">
        <AccordionTrigger>Price</AccordionTrigger>
        <AccordionContent>Up to 1500 ₴/h</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
