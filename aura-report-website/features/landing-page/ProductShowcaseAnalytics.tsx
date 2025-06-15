"use client";
import React, { useRef } from "react";
import productImage from "@/app/assets/feature-1-product-showcase.png";
import pyramidImage from "@/app/assets/pyramid.png";
import tubeImage from "@/app/assets/tube.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
export default function ProductShowcaseAnalytics() {
  return (
    <section className='bg-gradient-to-b from-[#EAEEFE] to-[#FF6900] py-24 px-2 overflow-x-clip lg:flex lg:items-center flex-row-reverse'>
      <div className='section-heading'>
        <div className='flex justify-center'>
          <div className='tag'>Feature set 2</div>
        </div>
        <h2 className='section-title mt-5'>
          Leverage analytics to monitor business health and make data-driven
          decisions
        </h2>
        <p className='section-description mt-4'>
          Empower your tuition center with to make business critical decisions
          with Aura analytics feature. Monitor metrics and leverage machine
          learning to predict when a student might discontinue with the class
        </p>
      </div>
      <div className='relative'>
        <Image
          src={productImage}
          alt='Product Showcase'
          className='w-full h-auto mt-10 xl:w-[760px] xl:h-[640px] mx-auto rounded-3xl'
        />
      </div>
    </section>
  );
}
