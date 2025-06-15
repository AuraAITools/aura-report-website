"use client";
import React from "react";
import acmeLogo from "@/app/assets/logo-acme.png";
import quantumLogo from "@/app/assets/logo-quantum.png";
import echoLogo from "@/app/assets/logo-echo.png";
import celestialLogo from "@/app/assets/logo-celestial.png";
import pulseLogo from "@/app/assets/logo-pulse.png";
import apexLogo from "@/app/assets/logo-apex.png";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LogoTicker() {
  return (
    <div className='py-8 bg-white p-4 md:py-12'>
      <div className='flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]'>
        <motion.div
          className='flex gap-14 flex-none'
          animate={{
            x: "-50%",
          }}
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <Image src={acmeLogo} alt={"Acme Logo"} />
          <Image src={quantumLogo} alt={"quantumLogo"} />
          <Image src={echoLogo} alt={"echoLogo"} />
          <Image src={celestialLogo} alt={"celestialLogo"} />
          <Image src={pulseLogo} alt={"pulseLogo"} />
          <Image src={apexLogo} alt={"apexLogo"} />
          {/* Second set of logos for animation */}
          <Image src={acmeLogo} alt={"Acme Logo"} />
          <Image src={quantumLogo} alt={"quantumLogo"} />
          <Image src={echoLogo} alt={"echoLogo"} />
          <Image src={celestialLogo} alt={"celestialLogo"} />
          <Image src={pulseLogo} alt={"pulseLogo"} />
          <Image src={apexLogo} alt={"apexLogo"} />
        </motion.div>
      </div>
    </div>
  );
}
