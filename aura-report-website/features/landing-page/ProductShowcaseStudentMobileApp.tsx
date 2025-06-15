"use client";
import React from "react";
import productImage1 from "@/app/assets/student-lesson-list.png";
import productImage2 from "@/app/assets/student-lesson-performance.png";
import Image from "next/image";
export default function ProductShowcaseStudentMobileApp() {
  return (
    <section className='bg-gradient-to-b from-[#EAEEFE] to-[#FF6900] py-24 px-2 overflow-x-clip lg:flex lg:items-center'>
      <div className='section-heading'>
        <div className='flex justify-center'>
          <div className='tag'>Feature set 3 </div>
        </div>
        <h2 className='section-title mt-5'>
          Mobile application to visualise students' performance
        </h2>
        <p className='section-description mt-4'>
          Empower your tuition center's students by helping them visualise their
          performances through metrics to identify strong and weak subjects.
        </p>
      </div>
      <div className='relative'>
        <Image
          src={productImage2}
          alt='Product Showcase 2'
          className='w-full h-auto mt-10 mx-auto xl:w-[400px] xl:h-[720px] mr-[300px] rounded-3xl'
        />
      </div>
    </section>
  );
}
