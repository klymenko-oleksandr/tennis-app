import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignupSignin: Story = {
  render: () => (
    <Tabs defaultValue="signup" className="w-80">
      <TabsList className="w-full">
        <TabsTrigger value="signup">Create account</TabsTrigger>
        <TabsTrigger value="signin">Sign in</TabsTrigger>
      </TabsList>
      <TabsContent value="signup" className="pt-4 text-sm text-muted-foreground">
        Signup form goes here.
      </TabsContent>
      <TabsContent value="signin" className="pt-4 text-sm text-muted-foreground">
        Signin form goes here.
      </TabsContent>
    </Tabs>
  ),
};

export const UpcomingPast: Story = {
  render: () => (
    <Tabs defaultValue="upcoming" className="w-80">
      <TabsList className="w-full">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="pt-4 text-sm text-muted-foreground">
        No upcoming bookings.
      </TabsContent>
      <TabsContent value="past" className="pt-4 text-sm text-muted-foreground">
        No past bookings.
      </TabsContent>
    </Tabs>
  ),
};
