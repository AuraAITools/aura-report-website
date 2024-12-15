"use client";
import * as Avatar from "@radix-ui/react-avatar";
import { CaretDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Menubar from "@radix-ui/react-menubar";
import { signOut } from "next-auth/react";

export default function TopMenuBar() {
  return (
    <Menubar.Root className='flex w-full h-16 gap-2 items-center sticky top-0 overflow-hidden px-4 py-1.5 shadow-lg'>
      <Menubar.Menu>
        <SearchBar />
        <div className='mr-auto'></div>
        <Menubar.Trigger>
          <AvatarCard />
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

export function AvatarCard() {
  return (
    <div className='flex gap-4 items-center rounded-xl ring-1 p-2 ring-gray-300'>
      <Avatar.Root className='inline-flex size-[35px] select-none items-center justify-center overflow-hidden rounded-full align-middle ring-2 ring-orange-300'>
        <Avatar.Image
          className='size-full rounded-[inherit] object-cover'
          src='https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'
          alt='Colm Tuite'
        />
        <Avatar.Fallback
          className='flex size-full items-center justify-center bg-white text-[15px] font-medium'
          delayMs={600}
        >
          CT
        </Avatar.Fallback>
      </Avatar.Root>
      <div className='flex flex-col items-start'>
        <p className='text-[14px]'>User 1</p>
        <p className='text-gray-600 text-[10px]'>Admin</p>
      </div>
      <CaretDownIcon className='size-6 ring-1 rounded-full ring-gray-300' />
    </div>
  );
}
