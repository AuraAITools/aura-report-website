import { ArrowRightIcon } from "@radix-ui/react-icons";
import starImage from "@/app/assets/star.png";
import springImage from "@/app/assets/spring.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { signIn } from "next-auth/react";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  return (
    <section
      ref={sectionRef}
      className='bg-gradient-to-b from-white to-[#FF6900] py-24 overflow-x-clip'
    >
      <div className='section-heading relative'>
        <h2 className='section-title'>Sign up today</h2>
        <p className='section-description mt-5 text-wh'>
          Supercharge your tuition center with the enterprise resource
          management and analytics to make data-driven decisions you deserve
        </p>
        <motion.img
          src={starImage.src}
          alt={"Star Image"}
          width={360}
          style={{
            translateY,
          }}
          className='absolute -left-[350px] -top-[137px]'
        />
        <motion.img
          src={springImage.src}
          alt={"SpringImage"}
          width={360}
          style={{ translateY }}
          className='absolute -right-[331px] -top-[19px]'
        />
      </div>
      <div className='flex gap-2 mt-10 justify-center'>
        <button
          className='btn btn-primary'
          onClick={() => signIn("keycloak", { callbackUrl: "/home" })}
        >
          Try it now
        </button>
        <button className='btn btn-text'>
          Learn more<span></span>
          <ArrowRightIcon className='h-5 w-5' />
        </button>
      </div>
    </section>
  );
};
