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
  <section id="shop" className="relative py-8 lg:py-12">
    <div className="container mx-auto px-6 lg:px-20">
      
      {/* ── Single Panoramic Hero Card ── */}
      <motion.div
        {...mp(0)}
        className="relative overflow-hidden bg-white rounded-tl-[1rem] rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] shadow-xs border border-slate-200/80"
      >
        <div className="grid lg:grid-cols-2 min-h-[420px] lg:min-h-[480px]">
          
          {/* Left Content */}
          <div className="p-8 lg:p-14 flex flex-col justify-center relative z-10 order-2 lg:order-1">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-[0.015em] mb-4">
              Discover & buy from top pet food, pharmacy & gear brands.
            </h2>
            
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed max-w-xl mb-8">
              A curated marketplace of vet approved nutrition, prescription medicines, organic wellness treats, and premium accessories with fast doorstep delivery.
            </p>

            {/* Category badge chips (text-only) */}
            <div className="flex flex-wrap gap-2.5 mb-8">
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

            {/* CTA */}
            <div>
              <Link
                href="/services/shop"
                className="inline-flex items-center gap-2.5 w-fit px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-tl-[99px] rounded-bl-[99px] rounded-br-[99px] rounded-tr-[20px] hover:bg-slate-800 transition-all duration-300 group/btn shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span>Explore Shop</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1 ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative min-h-[300px] lg:min-h-0 order-1 lg:order-2">
            <Image
              src={shopCartImg}
              alt="Shopping cart and basket filled with premium pet food and veterinary essentials"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent w-1/5 hidden lg:block" />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ShopSection;
