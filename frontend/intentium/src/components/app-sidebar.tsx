"use client";
import { Calendar, Home, Inbox, LogOut, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useOkto, OktoContextType } from "okto-sdk-react";
import { useEffect, useState } from "react";

const items = [
  {
    title: "Create Intents",
    url: "#",
    icon: Home,
  },
  {
    title: "Seeker Intent",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Provider Intent",
    url: "#",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const { getUserDetails, logOut, isLoggedIn } = useOkto() as OktoContextType;
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getUserDetails();
        setEmail(details?.email);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  return (
    <Sidebar className="h-screen w-64 bg-gray-900 text-white flex flex-col justify-between">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-semibold px-4 py-2 text-black">
            Intentify
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center space-x-3 px-4 py-2"
                    >
                      <item.icon className="w-5 h-5 text-gray-400" />
                      <span className="text-black">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <User className="w-6 h-6 text-gray-400" />
          <span className="text-sm text-gray-700">{email}</span>
        </div>
        <button
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-sm text-white rounded-md"
          onClick={() => logOut()}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </Sidebar>
  );
}
