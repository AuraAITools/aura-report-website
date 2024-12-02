"use client";
import { useNotifications } from "@/components/notifications/notification-store";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // if a session exists in the browser, redirect authenticated user to homepage
  // if (session && session.user) {
  //   router.push('/home')
  // }

  return (
    <main className="bg-slate-200 min-h-screen">
      <div className="flex gap-2">
        <Image
          src="/logo.png"
          alt="Aura Logo"
          className="animate-spin-slow"
          width={50}
          height={50}
        />
        <Image src="/wordmark.png" alt="Aura wordmark" width={80} height={50} />
        <div className="ml-auto" />
        <button>
          <Link href={"/pricing"}>Pricing</Link>
        </button>
        <button className="mr-2">
          <Link href={"/support"}>Support</Link>
        </button>
        <button onClick={() => signIn("keycloak")} className="rounded-full">
          Signup
        </button>
        <button onClick={() => signOut()} className="rounded-full">
          logout
        </button>
        <button
          onClick={() => {
            useNotifications.getState().addNotification({
              type: "success",
              title: "Error",
              message: "test",
            });
          }}
          className="rounded-full"
        >
          notification
        </button>
      </div>
    </main>
  );
}
