'use client';

import { Heart, Mail, MapPin, Phone, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";


const Footer = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      { name: "Help Center", href: "#help" },
      { name: "Contact Us", href: "#contact" },
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" }
    ],
    professionals: [
      { name: "For Veterinarians", href: "#vets" },
      { name: "For Trainers", href: "#trainers" },
      { name: "Certification", href: "#certification" },
      { name: "Partner Program", href: "#partners" }
    ]
  };

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-t from-card to-background border-t border-border/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zoodo-purple/5 via-transparent to-zoodo-blue/5" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-6 gap-12 py-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/Zoodo.png"
                alt="Zoodo"
                width={120}
                height={40}
                className="h-3 md:h-4 lg:h-5 w-auto"
                priority
              />
            </div>
            <p className="text-muted-foreground max-w-sm">
              Revolutionizing pet healthcare with AI and blockchain technology. Connecting pets, owners, and professionals in one intelligent ecosystem.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-zoodo-blue" />
                <span>zoodo.care@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-zoodo-green" />
                <span>+91 7620944018</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Global Platform</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Professionals Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Professionals</h3>
            <ul className="space-y-3">
              {footerLinks.professionals.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-border/20 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">
                Stay updated with <span className="gradient-text">Zoodo</span>
              </h3>
              <p className="text-muted-foreground">
                Get the latest updates on pet healthcare innovations, community events, and platform features.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                />
              </div>
              <Button variant="default" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border/20 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2025 Zoodo. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for pets everywhere.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
