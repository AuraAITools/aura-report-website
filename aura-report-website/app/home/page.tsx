"use client";
import Sidebar, {
  SidebarProps,
} from "@/components/ui/navigation-bars/sidebar/Sidebar";
import { SidebarShelf, SidebarShelfProps } from "@/components/ui/navigation-bars/sidebar/SidebarShelf";
import TopToolBar from "@/components/ui/navigation-bars/topbar/TopToolBar";
import { useGetAllInstitutions } from "@/lib/hooks/useInstitutions";
import { BellIcon, CalendarIcon, ClipboardCopyIcon, ClipboardIcon, EyeOpenIcon, FontStyleIcon, GearIcon, HandIcon, HomeIcon, IdCardIcon, MixerVerticalIcon, PersonIcon, RulerHorizontalIcon, SewingPinFilledIcon, SquareIcon } from "@radix-ui/react-icons";
import React from "react";

const sidebarContent: SidebarProps = {
  items: [
    {
      groupName: "MANAGE INSTITUTION",
      showSeparator: true,
      items: [
        {
          title: "Analytics",
          href: "/analytics",
          leftIcon: <EyeOpenIcon className="size-6"/>,
          rightIcon: undefined,
        },
        {
          title: "Announcements",
          href: "/announcements",
          leftIcon: <BellIcon className="size-6"/>,
          rightIcon: undefined,
        },
        {
          title: "Calendar",
          href: "/calendar",
          leftIcon: <CalendarIcon className="size-6"/>,
          rightIcon: undefined,
        },
        {
          title: "Outlets",
          href: "/outlets",
          leftIcon: <SewingPinFilledIcon className="size-6"/>,
          rightIcon: undefined,
        },
      ],
    },
    {
      groupName: "MANAGE EDUCATION",
      showSeparator: true,
      items: [
        {
          title: "Levels",
          href: "/levels",
          leftIcon: <MixerVerticalIcon className="size-6"/>,
          rightIcon: undefined,
        },

        {
          title: "Subjects",
          href: "/subjects",
          leftIcon: <FontStyleIcon className="size-6"/>,
          rightIcon: undefined,
        },
        {
          title: "Classes",
          href: "/classes",
          leftIcon: <RulerHorizontalIcon className="size-6"/>,
          rightIcon: undefined,
        },
        {
          title: "Lessons",
          href: "/lessons",
          leftIcon: <ClipboardIcon className="size-6"/>,
          rightIcon: undefined,
        },
      ],
    },
    {
      groupName: "MANAGE PEOPLE",
      showSeparator: true,
      items: [
        {
          title: "students",
          href: "/students",
          leftIcon: <HandIcon className="size-6"/>,
          rightIcon: undefined,
        },

        {
          title: "parents",
          href: "/parents",
          leftIcon: <PersonIcon className="size-6"/>,
          rightIcon: undefined,
        },
        {
          title: "educators",
          href: "/educators",
          leftIcon: <IdCardIcon className="size-6"/>,
          rightIcon: undefined,
        },
        {
          title: "Staff & Admin",
          href: "/staff",
          leftIcon: <ClipboardCopyIcon className="size-6"/>,
          rightIcon: undefined,
        },
      ],
    },
    {
      groupName: "SETTINGS",
      showSeparator: true,
      items: [
        {
          title: "Settings",
          href: "/settings",
          leftIcon: <GearIcon className="size-6"/>,
          rightIcon: undefined,
        },
      ],
    },
  ],
};

const sidebarShelfIcons: SidebarShelfProps = {
  items: [{
    icon: <HomeIcon/>,
    href: "/home"
  },{
    icon: <EyeOpenIcon/>,
    href: "/analytics"
  },
  {
    icon: <BellIcon/>,
    href: "/announcements"
  },
  {
    icon: <CalendarIcon/>,
    href: "/calendar"
  },
  {
    icon: <SewingPinFilledIcon/>,
    href: "/outlets"
  },
  {
    icon: <MixerVerticalIcon/>,
    href: "/levels"
  },
  {
    icon: <FontStyleIcon/>,
    href: "/subjects"
  },
  {
    icon: <RulerHorizontalIcon/>,
    href: "/classes"
  },
  {
    icon: <ClipboardIcon/>,
    href: "/lessons"
  },
  {
    icon: <HandIcon/>,
    href: "/students"
  },
  {
    icon: <PersonIcon/>,
    href: "/parents"
  },
  {
    icon: <IdCardIcon/>,
    href: "/educators"
  },
  {
    icon: <ClipboardCopyIcon/>,
    href: "/staff"
  },
  {
    icon: <GearIcon/>,
    href: "/settings"
  }]
}
export default function HomePage() {
  const { isPending, data: institutions, error } = useGetAllInstitutions();
  if (isPending) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <SidebarShelf {...sidebarShelfIcons} />
      <Sidebar items={sidebarContent.items} />
      <div className="flex-1 flex-wrap">
        <TopToolBar />
        <div className="p-4">
          <p>Institution page</p>
          {institutions?.map((institution, idx) => {
            return <div>{institution.email}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
