"use client";
import { Calendar, Home, Inbox, LogOut, User } from "lucide-react";
import Link from "next/link";
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

const NAV_ITEMS = [
  {
    title: "Create Intents",
    url: "/dashboard/intents",
    icon: Home,
  },
  {
    title: "Seeker Intent",
    url: "/dashboard/seekers",
    icon: Inbox,
  },
  {
    title: "Provider Intent",
    url: "/dashboard/providers",
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
        console.error("Error fetching user details:", error);
      }
    };
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  return (
    <Sidebar className="h-screen w-72 bg-white shadow-lg flex flex-col">
      <SidebarContent className="flex-grow">
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold text-primary-600 px-4 py-6 border-b border-gray-200">
            Intentify
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-2">
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-primary-50 transition-colors duration-200 group"
                    >
                      <item.icon className="w-5 h-5 text-primary-500 group-hover:text-primary-600" />
                      <span className="text-gray-700 font-medium group-hover:text-primary-600">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className=" border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-primary-100 p-2 rounded-full">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{email}</p>
            <p className="text-xs text-gray-500">Logged in</p>
          </div>
        </div>
        <button
          className="w-full flex text-black p-1 py-2.5 mb-2 items-center justify-center bg-black hover:bg-primary-700 text-sm text-white rounded-md transition-colors duration-200"
          onClick={() => logOut()}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </Sidebar>
  );
}
