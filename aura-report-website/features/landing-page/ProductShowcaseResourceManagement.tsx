"use client";
import React, { useRef } from "react";
import productImage from "@/app/assets/feature-1-product-showcase.png";
import pyramidImage from "@/app/assets/pyramid.png";
import tubeImage from "@/app/assets/tube.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
export default function ProductShowcaseResourceManagement() {
  const sectionRef = useRef(null);
  // start end: start of section reaches end of window
  // & end start: end of section reaches start of window
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  return (
    <section
      ref={sectionRef}
      className='bg-gradient-to-b from-[#EAEEFE] to-[#FF6900] py-24 px-2 overflow-x-clip lg:flex lg:items-center'
    >
      <div className='section-heading'>
        <div className='flex justify-center'>
          <div className='tag'>Feature set 1</div>
        </div>
        <h2 className='section-title mt-5'>
          Manage all your resources on one centralised platform
        </h2>
        <p className='section-description mt-4'>
          Empower your tuition center with comprehensive resource management
          capabilities. From scheduling and rescheduling lessons to organizing
          study materials, posting announcements, and managing different outlets
        </p>
      </div>
      <div className='relative'>
        <Image
          src={productImage}
          alt='Product Showcase'
          className='w-full h-auto mt-10 xl:w-[760px] xl:h-[640px] mx-auto rounded-3xl'
        />
        <motion.img
          src={pyramidImage.src}
          alt='Pyramid Image'
          height={262}
          width={262}
          style={{
            translateY,
          }}
          className='hidden absolute -right-36 -top-32 xl:block'
        />
        <motion.img
          src={tubeImage.src}
          alt='Pyramid Image'
          height={248}
          width={248}
          style={{
            translateY,
          }}
          className='hidden absolute -left-36 -top-96 xl:block'
        />
      </div>
    </section>
  );
}
