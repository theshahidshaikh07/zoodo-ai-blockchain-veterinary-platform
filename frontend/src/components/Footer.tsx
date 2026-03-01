'use client';

import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";


const Footer = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = newsletterEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setSubscribeSuccess(false);
      setSubscribeMessage("Please enter a valid email address.");
      return;
    }

    setIsSubscribing(true);
    setSubscribeMessage("");
    setSubscribeSuccess(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot: "" }),
      });

      const data = await response.json().catch(() => ({}));
      const success = Boolean(data?.success);

      setSubscribeSuccess(success);
      setSubscribeMessage(
        typeof data?.message === "string"
          ? data.message
          : success
            ? "Subscribed successfully."
            : "Unable to subscribe right now. Please try again."
      );

      if (success) {
        setNewsletterEmail("");
      }
    } catch {
      setSubscribeSuccess(false);
      setSubscribeMessage("Network error. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const footerLinks = {
    platform: [
      { name: "Features", href: "#features" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "AI Assistant", href: "#ai" },
      { name: "Pricing", href: "#pricing" }
    ],
    community: [
      { name: "Pet Adoption", href: "#adoption" },
      { name: "Events", href: "#events" },
      { name: "Donations", href: "#donations" },
      { name: "Forum", href: "#forum" }
    ],
    support: [
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" }
    ],
    professionals: [
      { name: "For Veterinarians", href: "#vets" },
      { name: "For Trainers", href: "#trainers" },
      { name: "Certification", href: "#certification" },
      { name: "Partner Program", href: "#partners" }
    ]
  };

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaXTwitter, href: "#", label: "X" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
    { icon: FaInstagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="relative overflow-hidden pt-20">
      <div className="bg-[#bde4e9] dark:bg-primary/10 rounded-t-[4rem] lg:rounded-t-[6rem] overflow-hidden relative">
        <div className="container mx-auto px-8 lg:px-20 relative z-10">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-5 gap-12 py-16">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-2">
                <Image
                  src="/pacifico-zoodo.png"
                  alt="Zoodo"
                  width={120}
                  height={40}
                  className="h-5 md:h-6 lg:h-7 w-auto"
                  priority
                />
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                Connecting pet owners with verified healthcare, training, grooming, shopping, and community services in a seamless manner.
              </p>
              <a
                href="mailto:zoodo.care@gmail.com"
                className="pt-2 flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">zoodo.care@gmail.com</span>
              </a>
            </div>

            {/* Company Links */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-slate-900">Company</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professionals Links */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-slate-900">Professionals</h3>
              <ul className="space-y-3">
                {footerLinks.professionals.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Links */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-slate-900">Community</h3>
              <ul className="space-y-3">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-border/20 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900">
                  Stay updated with <span className="gradient-text">Zoodo</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Get the latest updates on pet healthcare innovations, community events, and platform features.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
                <div className="flex-1">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                    disabled={isSubscribing}
                  />
                </div>
                <Button variant="default" size="lg" type="submit" disabled={isSubscribing}>
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
              {subscribeMessage ? (
                <p
                  className={`text-sm mt-3 ${subscribeSuccess ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {subscribeMessage}
                </p>
              ) : null}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-border/20 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              {/* Copyright */}
              <div className="flex items-center justify-center lg:justify-start gap-1 text-[11px] sm:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                <span>© 2026 Zoodo. Made with</span>
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                <span>for pets everywhere.</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 glass-card bg-white/10 dark:bg-black/10 backdrop-blur-md border border-slate-900/10 rounded-lg flex items-center justify-center hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
