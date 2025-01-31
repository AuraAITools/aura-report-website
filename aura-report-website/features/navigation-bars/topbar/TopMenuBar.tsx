"use client";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import { generateKey } from "@/utils/id";
import * as Avatar from "@radix-ui/react-avatar";
import {
  CaretDownIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import * as Menubar from "@radix-ui/react-menubar";
import { signOut } from "next-auth/react";
import { title } from "process";
import { DropdownMenu } from "radix-ui";
type TopMenuBarProps = {
  profileCard: AvatarCardProps;
};
export default function TopMenuBar({ profileCard }: TopMenuBarProps) {
  const {
    institutions,
    currentInstitution,
    currentOutlet,
    currentOutlets,
    status,
    setCurrentOutlet,
    changeCurrentInstitution,
  } = useInstitutionAndOutletsContext();

  if (status === "pending" || currentOutlet === undefined) {
    return <ProgressBar />;
  }

  if (status === "error") {
    throw new Error("failed to load institution and outlet context");
  }

  return (
    <Menubar.Root className='flex w-full h-16 gap-2 items-center sticky top-0 overflow-hidden px-4 py-1.5 shadow-lg'>
      <Menubar.Menu>
        <SearchBar />
        <DropDownMenu
          focusedOption={{
            title: currentInstitution.name,
            onClick: () => changeCurrentInstitution(currentInstitution),
          }}
          options={institutions.map((i) => ({
            title: i.name,
            onClick: () => changeCurrentInstitution(i),
          }))}
        />
        <div className='flex-auto' />
        <DropDownMenu
          focusedOption={{
            title: currentOutlet.name,
            onClick: () => setCurrentOutlet(currentOutlet),
          }}
          options={currentOutlets.map((o) => ({
            title: o.name,
            onClick: () => setCurrentOutlet(o),
          }))}
        />
        <div className='mr-auto'></div>
        <Menubar.Trigger>
          <AvatarCard {...profileCard} />
        </Menubar.Trigger>
        <button
          className='p-2 bg-orange-300 rounded-2xl text-white'
          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
        >
          sign out
        </button>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

export function SearchBar() {
  return (
    <div className='flex bg-gray-200 rounded-full py-1 px-1 items-center gap-4 w-64 max-h-10'>
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
  profileUrl: string;
};
export function AvatarCard({ name, profileUrl }: AvatarCardProps) {
  return (
    <div className='flex gap-4 items-center rounded-xl ring-1 p-2 ring-gray-300'>
      <Avatar.Root className='inline-flex size-[35px] select-none items-center justify-center overflow-hidden rounded-full align-middle ring-2 ring-orange-300'>
        <Avatar.Image
          className='size-full rounded-[inherit] object-cover'
          src={profileUrl}
          alt={name}
        />
        <Avatar.Fallback
          className='flex size-full items-center justify-center text-[15px] font-medium'
          delayMs={600}
        >
          {getFirstCharactersInUpperCase(name)}
        </Avatar.Fallback>
      </Avatar.Root>
      <div className='flex flex-col items-start'>
        <p className='text-[14px]'>{name}</p>
        <p className='text-gray-600 text-[10px]'></p>
      </div>
      <CaretDownIcon className='size-6 ring-1 rounded-full ring-gray-300' />
    </div>
  );
}
type DropDownMenuOptions = {
  title: string;
  onClick: () => void;
};
type DropDownMenuProps = {
  focusedOption: DropDownMenuOptions;
  options: DropDownMenuOptions[];
};
export function DropDownMenu({ focusedOption, options }: DropDownMenuProps) {
  const unfocusedOptions = options.filter(
    (o) => o.title !== focusedOption.title,
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className='inline-flex p-[5px] text-[13px] gap-2 justify-center items-center min-w-[220px] bg-orange-300 text-white rounded-md select-none'
          aria-label='dropdown options'
        >
          {focusedOption.title}
          {options.length > 1 && <ChevronDownIcon className='size-6' />}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]'
          sideOffset={5}
        >
          {unfocusedOptions.map((o, idx) => {
            return (
              <DropdownMenu.Item
                key={generateKey("dropdown", title, idx.toString())}
                className='group relative flex h-[25px] select-none text-black hover:bg-orange-300 hover:text-white items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
                onClick={o.onClick}
              >
                {o.title}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function getFirstCharactersInUpperCase(name: string) {
  return name
    .split(" ")
    .map((c) => c.at(0))
    .join()
    .toUpperCase();
}
