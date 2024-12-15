import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarShelfItemProps } from "@/components/sidebar/SidebarShelfItem";
import { generateKey } from "@/utils/id";
import {
  ActivityLogIcon,
  BellIcon,
  CalendarIcon,
  ClipboardCopyIcon,
  ClipboardIcon,
  CubeIcon,
  EyeOpenIcon,
  FileTextIcon,
  FontStyleIcon,
  GearIcon,
  HandIcon,
  HomeIcon,
  IdCardIcon,
  MixerVerticalIcon,
  PersonIcon,
  RowSpacingIcon,
  RulerHorizontalIcon,
  SewingPinFilledIcon,
} from "@radix-ui/react-icons";

const sidebarShelfItemConfigurations: SidebarShelfItemProps[] = [
  {
    icon: <HomeIcon />,
    href: "/home",
  },
  {
    icon: <EyeOpenIcon />,
    href: "/analytics",
  },
  {
    icon: <BellIcon />,
    href: "/announcements",
  },
  {
    icon: <CalendarIcon />,
    href: "/calendar",
  },
  {
    icon: <SewingPinFilledIcon />,
    href: "/outlets",
  },
  {
    icon: <MixerVerticalIcon />,
    href: "/levels",
  },
  {
    icon: <FontStyleIcon />,
    href: "/subjects",
  },
  {
    icon: <RulerHorizontalIcon />,
    href: "/classes",
  },
  {
    icon: <ClipboardIcon />,
    href: "/lessons",
  },
  {
    icon: <HandIcon />,
    href: "/students",
  },
  {
    icon: <PersonIcon />,
    href: "/parents",
  },
  {
    icon: <IdCardIcon />,
    href: "/educators",
  },
  {
    icon: <ClipboardCopyIcon />,
    href: "/staff",
  },
  {
    icon: <GearIcon />,
    href: "/settings",
  },
];

export function SidebarFeature() {
  return (
    <Sidebar>
      <Sidebar.Shelf>
        <Sidebar.ExpandButton />
        {sidebarShelfItemConfigurations.map((shelfItem, idx) => (
          <Sidebar.ShelfItem
            key={generateKey("shelf_item", shelfItem.href, idx.toString())}
            {...shelfItem}
          />
        ))}
      </Sidebar.Shelf>
      <Sidebar.ExpandedContent>
        <Sidebar.Group groupName='MANAGE INSTITUTION' showSeparator>
          <Sidebar.Item
            title='Analytics'
            href='/analytics'
            leftIcon={<EyeOpenIcon className='size-6' />}
          />
          <Sidebar.Item
            title='Announcements'
            href='/announcements'
            leftIcon={<BellIcon className='size-6' />}
          />
          <Sidebar.Item
            title='Calendar'
            href='/calendar'
            leftIcon={<CalendarIcon className='size-6' />}
          />
          <Sidebar.Item
            title='Outlets'
            href='/outletes'
            leftIcon={<SewingPinFilledIcon className='size-6' />}
          />
        </Sidebar.Group>
        <Sidebar.Group groupName='MANAGE EDUCATION' showSeparator>
          <Sidebar.Item
            title='Levels'
            href='/levels'
            leftIcon={<RowSpacingIcon className='size-6' />}
          />
          <Sidebar.Item
            title='Subjects'
            href='/subjects'
            leftIcon={<FileTextIcon className='size-6' />}
          />
          <Sidebar.Item
            title='Classes'
            href='/classes'
            leftIcon={<ActivityLogIcon className='size-6' />}
          />
          <Sidebar.Item
            title='Lessons'
            href='/lessons'
            leftIcon={<CubeIcon className='size-6' />}
          />
        </Sidebar.Group>
        <Sidebar.Group groupName='MANAGE PEOPLE' showSeparator>
          <Sidebar.Item
            title='Students'
            href='/students'
            leftIcon={<HandIcon className='size-6' />}
          />
          <Sidebar.Item
            title='Parents'
            href='/parents'
            leftIcon={<PersonIcon className='size-6' />}
          />
          <Sidebar.Item
            title='Educators'
            href='/educators'
            leftIcon={<IdCardIcon className='size-6' />}
          />
          <Sidebar.Item
            title='Staff & Admin'
            href='/staff'
            leftIcon={<ClipboardCopyIcon className='size-6' />}
          />
        </Sidebar.Group>
        <Sidebar.Group groupName='SETTINGS' showSeparator>
          <Sidebar.Item
            title='Settings'
            href='/settings'
            leftIcon={<GearIcon className='size-6' />}
          />
        </Sidebar.Group>
      </Sidebar.ExpandedContent>
    </Sidebar>
  );
}
