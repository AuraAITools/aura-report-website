"use client";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { AvatarProfile } from "@/components/ui/AvatarProfile";
import { SimpleDropdownMenu } from "@/components/ui/dropdown-menus/simple-dropdown/SimpleDropdownMenu";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Menubar from "@radix-ui/react-menubar";
import { signOut } from "next-auth/react";
type TopMenuBarProps = {
  profileCard: AvatarCardProps;
};
export default function TopMenuBar({ profileCard }: TopMenuBarProps) {
  const {
    institutions,
    currentInstitution,
    currentOutlet,
    currentOutlets,
    changeCurrentOutlet,
    changeCurrentInstitution,
    status,
  } = useInstitutionAndOutletsContext();

  if (status === "pending") {
    return <ProgressBar />;
  }
  return (
    <Menubar.Root className='flex w-full h-16 gap-2 items-center sticky top-0 overflow-hidden px-4 py-1.5 shadow-lg'>
      <Menubar.Menu>
        <SearchBar />
        <SimpleDropdownMenu
          focusedOption={{
            title: !!currentInstitution
              ? currentInstitution.name
              : "loading...",
            onClick: () => {
              !!currentInstitution &&
                changeCurrentInstitution(currentInstitution);
            },
          }}
          options={institutions.map((i) => ({
            title: i.name,
            onClick: () => changeCurrentInstitution(i),
          }))}
        />
        <div className='flex-auto' />
        <SimpleDropdownMenu
          focusedOption={{
            title: !!currentOutlet ? currentOutlet.name : "no outlets yet",
            onClick: () => {
              !!currentOutlet && changeCurrentOutlet(currentOutlet);
            },
          }}
          options={currentOutlets.map((o) => ({
            title: o.name,
            onClick: () => changeCurrentOutlet(o),
          }))}
        />
        <div className='mr-auto'></div>
        <Menubar.Trigger>
          <AvatarCard {...profileCard} />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content>
            <Menubar.Item asChild>
              <button
                className='min-w-[160px] p-2 bg-orange-300 hover:bg-orange-400 rounded-md text-white'
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
              >
                logout
              </button>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

export function SearchBar() {
  return (
    <div className='flex bg-gray-200 rounded-full h-12 py-1 px-1 items-center gap-4 w-64 max-h-10'>
      <MagnifyingGlassIcon className='size-6' />
      <input
        className='bg-inherit text-gray-400'
        type='text'
        id='firstName'
        placeholder='Search'
      />
    </div>
  );
}

type AvatarCardProps = {
  name: string;
  profileUrl?: string;
};
export function AvatarCard({ name, profileUrl }: AvatarCardProps) {
  return (
    <div className='sm:min-w-[140px] flex gap-4 items-center rounded-md ring-1 p-2 ring-gray-300'>
      <AvatarProfile name={name} fallback={""} />
      <p className='text-[14px] flex-1 text-center'>{name}</p>
    </div>
  );
}
