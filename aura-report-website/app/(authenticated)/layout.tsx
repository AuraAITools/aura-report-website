"use client";
import Authorization from "@/components/providers/Authorization";
import { InstitutionsAndOutletsProvider } from "@/components/providers/InstitutionsAndOutletsProvider";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import { SidebarFeature } from "@/features/navigation-bars/SidebarFeature";
import TopMenuBar from "@/features/navigation-bars/topbar/TopMenuBar";
import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <ProgressBar />;
  }

  return (
    <Authorization allowedRoles={[]}>
      <InstitutionsAndOutletsProvider>
        <div className='flex'>
          <div className='flex bg-gray-50'>
            <SidebarFeature />
          </div>
          <div className='flex flex-col w-full'>
            <TopMenuBar
              profileCard={{
                name: session?.user.name || "fetching",
                // profileUrl:
                // "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80",
              }}
            />
            <div className='w-full bg-gray-100 p-4'>{children}</div>
          </div>
        </div>
      </InstitutionsAndOutletsProvider>
    </Authorization>
  );
}
