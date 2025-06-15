"use client";
import { CheckIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { generateKey } from "@/utils/id";
const pricingTiers = [
  {
    title: "Feature set 1",
    monthlyPrice: 400,
    buttonText: "Get started for free",
    popular: false,
    inverse: false,
    features: [
      "Resource management",
      "Manage center outlets",
      "Manage students",
      "Manage educators",
      "Manage lessons",
    ],
  },
  {
    title: "Add on Feature set 2 & 3",
    monthlyPrice: 699,
    buttonText: "Sign up now",
    popular: true,
    inverse: true,
    features: [
      "Resource management",
      "Manage center outlets",
      "Manage students",
      "Manage educators",
      "Manage lessons",
      "student performance dashboard",
      "analytics",
    ],
  },
  {
    title: "Coming soon",
    monthlyPrice: 999,
    buttonText: "Sign up now",
    popular: false,
    inverse: false,
    features: [
      "Resource management",
      "Manage center outlets",
      "Manage students",
      "Manage educators",
      "Manage lessons",
      "student performance dashboard",
      "analytics",
      "ai capabilities (coming soon)",
      "ai capabilities (coming soon)",
      "ai capabilities (coming soon)",
    ],
  },
];

export const Pricing = () => {
  return (
    <section className='py-24 bg-white'>
      <div className='section-heading'>
        <h2 className='section-title'>Pricing (tbc)</h2>
        <p className='section-description mt-5'>
          Choose the plan that fits your needs. Whether you're just starting out
          or need advanced features, we have a plan for you.
        </p>
      </div>
      <div className='flex flex-col lg:flex-row lg:items-end lg:justify-center gap-6 items-center mt-10'>
        {pricingTiers.map(
          (
            { title, monthlyPrice, buttonText, popular, inverse, features },
            idx,
          ) => (
            <div
              key={generateKey("_card", idx.toString(), idx.toString())}
              className={twMerge(
                "card",
                inverse === true && "border-black bg-black text-white",
              )}
            >
              <div className='flex justify-between'>
                <h3
                  className={twMerge(
                    "text-lg font-bold text-black/50",
                    inverse === true && "text-white/60",
                  )}
                >
                  {title}
                </h3>
                {popular === true && (
                  <div className='inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20 items-center'>
                    <motion.span
                      animate={{
                        backgroundPositionX: "-100%",
                      }}
                      transition={{
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop",
                        duration: 1,
                      }}
                      className='bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] [background-size:200%] text-transparent bg-clip-text font-medium'
                    >
                      Popular
                    </motion.span>
                  </div>
                )}
              </div>
              <div className='flex items-baseline gap-1 mt-[30px]'>
                <span className='text-4xl font-bold tracking-tighter leading-none'>
                  ${monthlyPrice}
                </span>
                <span className='tracking-tight font-bold text-black/50'>
                  /month
                </span>
              </div>
              <button
                className={twMerge(
                  "btn btn-primary w-full mt-[30px]",
                  inverse === true && "bg-white text-black",
                )}
                onClick={() => signIn("keycloak", { callbackUrl: "/home" })}
              >
                {buttonText}
              </button>
              <ul className='flex flex-col gap-5 mt-8'>
                {features.map((feature, idx) => (
                  <li
                    key={generateKey("feature_", feature, idx.toString())}
                    className='text-sm flex items-center gap-4'
                  >
                    <CheckIcon className='h-6 w-6' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
      </div>
    </section>
  );
};
