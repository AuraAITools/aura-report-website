import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import AuraLogo from "@/app/assets/logo.png";
import AuraWordMark from "@/app/assets/wordmark.png";

export default function Header() {
  return (
    <header className='sticky top-0 backdrop-blur-sm z-20'>
      <div className='flex items-center justify-between px-2 py-2'>
        <div className='flex items-center justify-center'>
          <Image
            src={AuraLogo}
            alt='Aura Logo'
            className='animate-spin-slow'
            width={40}
            height={40}
          />
          <Image
            src={AuraWordMark}
            alt='Aura wordmark'
            width={40}
            height={40}
          />
        </div>
        <HamburgerMenuIcon className='h-5 w-5 md:hidden' />
        <nav className='hidden md:flex items-center gap-6 text-black/60'>
          <Link className='btn btn-text' href={"/pricing"}>
            Pricing
          </Link>
          <Link className='btn btn-text' href={"/support"}>
            Support
          </Link>
          <button
            onClick={() => signIn("keycloak", { callbackUrl: "/home" })}
            className='btn btn-primary'
          >
            <span>Login</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
