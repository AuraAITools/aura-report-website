"use client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import React from "react";
import cogImage from "@/app/assets/cog.png";
import cylinderImage from "@/app/assets/cylinder.png";
import noodleImage from "@/app/assets/noodle.png";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { signIn } from "next-auth/react";

export default function Hero() {
  const heroRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("Scroll Progress:", latest);
  });
  return (
    <section
      ref={heroRef}
      className='pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#FF6900,#EAEEFE_70%)] overflow-x-clip'
    >
      <div className='p-4'>
        <div className='md:flex'>
          {/* ensure that the text section is a fixed defined width of 478px */}
          <div className='md:w-[600px]'>
            <div className='tag'>Version Beta 1</div>
            <h1 className='text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#cd6e0f] text-transparent bg-clip-text'>
              Organise your Resources
            </h1>
            <p className='text-xl text-[#cd6e0f] tracking-tight mt-6'>
              Celebrate the joy of accomplishment with an app designed to train
              your progress, motivate your efforts and help you achieve your
              goals.
            </p>
            <div className='flex gap-1 items-center mt-[30px]'>
              <button
                onClick={() => signIn("keycloak", { callbackUrl: "/home" })}
                className='btn btn-primary'
              >
                Try Beta Version
              </button>
              <button className='btn btn-text gap-1'>
                <span>Learn More</span>
                <ArrowRightIcon className='h-5 w-5' />
              </button>
            </div>
          </div>
          <div className='mt-20 md:mt-0 md:h-[648px] md:flex-1 relative'>
            <motion.img
              src={cogImage.src}
              alt='cog image'
              className='md:absolute md:h-full md:w-auto md:max-w-none md:-right-96'
              animate={{
                y: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 2,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src={cylinderImage.src}
              alt='cylinder image'
              width={220}
              height={220}
              className='hidden md:block -top-8 -left-0 md:absolute'
              style={{
                translateY: translateY,
              }}
            />
            <motion.img
              src={noodleImage.src}
              alt='Noodle image'
              className='hidden lg:block absolute top-[524px] left-[448px] rotate-[30deg]'
              width={220}
              height={220}
              style={{
                rotate: 30,
                translateY: translateY,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
