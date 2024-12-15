"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <div className='flex items-center gap-2 bg-gray-100'>
        <Image
          src='/logo.png'
          alt='Aura Logo'
          className='animate-spin-slow'
          width={50}
          height={50}
        />
        <Image src='/wordmark.png' alt='Aura wordmark' width={80} height={50} />
        <div className='ml-auto' />
        <button className='rounded-2xl bg-orange-300 p-2 text-white min-w-24'>
          <Link href={"/pricing"}>Pricing</Link>
        </button>
        <button className='rounded-2xl bg-orange-300 p-2 text-white min-w-24'>
          <Link href={"/support"}>Support</Link>
        </button>
        <button
          onClick={() => signIn("keycloak", { callbackUrl: "/home" })}
          className='rounded-2xl bg-orange-300 p-2 min-w-24 text-white'
        >
          login
        </button>
      </div>
    </main>
  );
}
