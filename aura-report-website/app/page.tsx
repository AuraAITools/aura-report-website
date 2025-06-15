"use client";
import { CallToAction } from "@/features/landing-page/CallToAction";
import { Footer } from "@/features/landing-page/Footer";
import Header from "@/features/landing-page/Header";
import Hero from "@/features/landing-page/Hero";
import LogoTicker from "@/features/landing-page/LogoTicker";
import { Pricing } from "@/features/landing-page/Pricing";
import ProductShowcaseResourceManagement from "@/features/landing-page/ProductShowcaseResourceManagement";
import ProductShowcaseAnalytics from "@/features/landing-page/ProductShowcaseAnalytics";
import { Testimonials } from "@/features/landing-page/Testimonials";
import ProductShowcaseStudentMobileApp from "@/features/landing-page/ProductShowcaseStudentMobileApp";

export default function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <ProductShowcaseResourceManagement />
      <ProductShowcaseAnalytics />
      <ProductShowcaseStudentMobileApp />
      <Pricing />
      {/* <Testimonials /> */}
      {/* <LogoTicker /> */}
      <CallToAction />
      <Footer />
    </>
  );
}
