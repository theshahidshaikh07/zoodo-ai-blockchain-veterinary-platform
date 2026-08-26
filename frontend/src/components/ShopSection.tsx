'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Pill, Bone, Sparkles } from "lucide-react";
import petFoodImg from "@/assets/shop-petfood.png";
import pharmacyImg from "@/assets/shop-pharmacy.png";
import essentialsImg from "@/assets/shop-essentials.png";

const mp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const categories = [
  {
    id: "food",
    label: "Pet Food",
    icon: Bone,
    tagline: "Nutrition crafted for every breed & stage",
    image: petFoodImg,
    href: "/shop/food",
    span: "md:col-span-2 lg:col-span-2 lg:row-span-2",
    size: "large",
  },
  {
    id: "pharmacy",
    label: "Pet Pharmacy",
    icon: Pill,
    tagline: "Vet-approved medicines & supplements",
    image: pharmacyImg,
    href: "/shop/pharmacy",
    span: "",
    size: "small",
  },
  {
    id: "essentials",
    label: "Essentials & Toys",
    icon: Sparkles,
    tagline: "Everything they love, curated for joy",
    image: essentialsImg,
    href: "/shop/essentials",
    span: "",
    size: "small",
  },
];

const ShopSection = () => (
  <section id="shop" className="relative py-24 lg:py-32">
    <div className="absolute top-0 left-0 right-0 h-px bg-slate-100" />

    <div className="container mx-auto px-8 lg:px-20">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10 lg:mb-12">
        <motion.div {...mp(0)} className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5" />
            Zoodo Shop
          </div>
          <h2 className="text-4xl lg:text-[3.25rem] font-bold text-slate-900 leading-[1.05] tracking-tight">
            Everything they need.
            <br />
            <span className="text-primary">In one basket.</span>
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            From vet-formulated nutrition to premium toys — curated
            by pet experts, delivered to your door.
          </p>
        </motion.div>

        <motion.div {...mp(0.1)}>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors duration-200"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Shop All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4"
        style={{ gridAutoRows: "240px" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            {...mp(0.08 + i * 0.08)}
            className={`${cat.span} group relative overflow-hidden rounded-[1.75rem]`}
          >
            <Link href={cat.href} className="block w-full h-full">
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 66vw"
              />
              {/* Unified dark gradient — no per-tile color accents */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1.5">
                  <cat.icon className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{cat.label}</span>
                </div>
                <h3 className={`font-bold text-white leading-snug ${cat.size === "large" ? "text-2xl lg:text-[1.6rem]" : "text-base lg:text-lg"}`}>
                  {cat.tagline}
                </h3>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
                  Shop now
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ShopSection;
