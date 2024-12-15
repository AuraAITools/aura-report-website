"use client";
import Authorization from "@/components/providers/Authorization";
import { InstitutionProvider } from "@/components/providers/InstitutionProvider";
import { SidebarFeature } from "@/features/navigation-bars/SidebarFeature";
import TopMenuBar from "@/features/navigation-bars/topbar/TopMenuBar";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Authorization allowedRoles={[]}>
      <InstitutionProvider>
        <div className='flex'>
          <div className='flex bg-gray-50'>
            <SidebarFeature />
          </div>
          <div className='flex flex-col w-full'>
            <TopMenuBar />
            <div className='w-full h-full bg-gray-100 p-4'> {children}</div>
          </div>
        </div>
      </InstitutionProvider>
    </Authorization>
  );
}
