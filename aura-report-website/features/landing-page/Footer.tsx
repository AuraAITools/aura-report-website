import Image from "next/image";
import SocialX from "@/app/assets/social-x.svg";
import SocialInsta from "@/app/assets/social-insta.svg";
import SocialLinkedIn from "@/app/assets/social-linkedin.svg";
import SocialPin from "@/app/assets/social-pin.svg";
import SocialYoutube from "@/app/assets/social-youtube.svg";
import AuraLogo from "@/app/assets/logo.png";

export const Footer = () => {
  return (
    <footer className='bg-black text-[#BCBCBC] text-sm py-10 text-center overflow-x-clip'>
      <div className='inline-flex relative before:content-[""] before:top-2 before:bottom-0 before:h-full before:bg-[linear-gradient([to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE])] before:absolute'>
        <Image
          src={AuraLogo}
          alt='Aura Logo'
          width={40}
          height={40}
          className='relative'
        />
      </div>
      <nav className='flex flex-col md:flex-row md:justify-center gap-6 mt-6'>
        <a href='#'>About</a>
        <a href='#'>Features</a>
        <a href='#'>Customers</a>
        <a href='#'>Pricing</a>
        <a href='#'>Help</a>
        <a href='#'>Careers</a>
      </nav>
      <div className='flex justify-center gap-6 mt-6'>
        <SocialX />
        <SocialInsta />
        <SocialLinkedIn />
        <SocialPin />
        <SocialYoutube />
      </div>
      <p className='mt-6'>&copy; 2025 Aura, Inc. All rights reserved.</p>
    </footer>
  );
};
