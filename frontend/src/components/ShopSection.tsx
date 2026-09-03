'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import shopCartImg from "@/assets/shop-cart-marketplace.jpg";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
});

const shopCategories = [
  { label: "Prescription Diets & Kibble", href: "/services/shop/food" },
  { label: "Vet Pharmacy & Meds", href: "/services/shop/pharma" },
  { label: "Vitamins & Supplements", href: "/services/shop/supplements" },
  { label: "Durable Toys & Treats", href: "/services/shop/essentials" },
  { label: "Leashes, Collars & Gear", href: "/services/shop/accessories" },
];

const ShopSection = () => (
  <section id="shop" className="relative py-12 lg:py-16">
    <div className="container mx-auto px-6 lg:px-20">
      
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: The Card (Holding the Text & CTA - Height matched to image) */}
        <motion.div
          {...mp(0)}
          className="lg:col-span-7 bg-white rounded-tl-[1rem] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] p-8 sm:p-12 lg:p-14 border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[420px] sm:min-h-[500px] lg:min-h-[540px] order-2 lg:order-1"
        >
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em] mb-4">
              Discover & buy from top pet food, pharmacy & gear brands.
            </h2>
            
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed max-w-xl mb-8">
              A curated marketplace of vet approved nutrition, prescription medicines, organic wellness treats, and premium accessories with fast doorstep delivery.
            </p>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2.5">
              {shopCategories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-slate-100/90 text-slate-700 border border-slate-200/60 shadow-xs hover:border-slate-900 hover:text-slate-900 hover:bg-white transition-all duration-200"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8">
            <Link
              href="/services/shop"
              className="inline-flex items-center gap-2.5 w-fit px-6 py-3.5 bg-slate-900 text-white text-sm font-semibold rounded-tl-[20px] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] hover:bg-slate-800 transition-all duration-300 group/btn shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span>Explore Shop</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1 ml-0.5" />
            </Link>
          </div>
        </motion.div>

        {/* Right Side: The Detached Shaped Image (OUTSIDE That Card) */}
        <motion.div
          {...mp(0.15)}
          className="lg:col-span-5 flex justify-center items-center relative order-1 lg:order-2 py-4"
        >
          <div className="relative w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px] flex justify-center items-center">
            {/* Soft Pastel Mint/Cyan Accent Circle behind bottom-left */}
            <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#bde4e9] z-0 pointer-events-none shadow-xs" />

            {/* Asymmetric Organic Shaped Photo Container (Bigger, Borderless) */}
            <div className="relative z-10 w-full h-[420px] sm:h-[500px] lg:h-[540px] rounded-tl-[4rem] rounded-tr-[11rem] rounded-br-[10rem] rounded-bl-[3rem] overflow-hidden shadow-2xl bg-slate-100">
              <Image
                src={shopCartImg}
                alt="Shopping cart filled with premium pet food and veterinary essentials"
                fill
                quality={95}
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 1000px"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  </section>
);

export default ShopSection;
