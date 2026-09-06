import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from './sidebar';
import { Avatar, AvatarFallback } from './avatar';

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminNav: Story = {
  render: () => (
    <SidebarProvider>
      <div className="h-[420px] w-64">
        <Sidebar collapsible="none" className="h-full">
          <SidebarHeader className="px-3 py-4 text-sm font-semibold text-sidebar-foreground">
            Baseline Admin
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Manage</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Overview</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Bookings</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Courts</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Coaches</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Pricing</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="flex flex-row items-center gap-2 px-3 py-3">
            <Avatar size="sm">
              <AvatarFallback>OK</AvatarFallback>
            </Avatar>
            <span className="text-sm text-sidebar-foreground">Oleksandr K.</span>
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  ),
};
