'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, ShieldCheck, FileCheck2, BookOpen, Soup, Pill, ShoppingBag, Cross, GraduationCap, Scissors, Bath, HeartHandshake, Home, Megaphone, CalendarDays, Users2, MessageCircle } from "lucide-react";
import { useTheme } from "next-themes";
import NoSSR from "./NoSSR";
import Link from "next/link";
import Image from "next/image";

// custom pet food svg imported from assets folder
import petFoodSvg from "../assets/pet-food.svg";

// wrap the svg path in a small component to behave like other icons
const PetFoodIcon = () => (
  <Image
    src={petFoodSvg}
    alt="Pet Food"
    width={20}
    height={20}
    className="mr-2 inline-block"
  />
);

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Settings, Plus, Minus, ChevronRight } from "lucide-react";

interface HeaderProps {
  isScrolled?: boolean;
}

const Header = ({ isScrolled: externalIsScrolled }: HeaderProps = {}) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  // Function to get role-specific dashboard URL
  const getDashboardUrl = () => {
    if (!user) return "/dashboard";

    switch (user.userType) {
      case 'pet_owner':
        return "/dashboard/pet-owner";
      case 'veterinarian':
        return "/dashboard/veterinarian";
      case 'trainer':
        return "/dashboard/trainer";
      case 'hospital':
        return "/dashboard/hospital";
      case 'admin':
        return "/dashboard/admin";
      default:
        return "/dashboard";
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If external scroll state is provided, use it instead of window scroll
    if (externalIsScrolled !== undefined) {
      setIsScrolled(externalIsScrolled);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [externalIsScrolled]);

  const toggleTheme = () => {
    if (mounted) {
      const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    // Close mobile menu immediately
    setIsMenuOpen(false);

    if (pathname !== '/') {
      router.push('/' + href);
      return;
    }

    // Delay scroll to allow mobile menu to close and layout to stabilize
    setTimeout(() => {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);

      if (element) {
        const headerHeight = 80; // Exact header height (h-20)
        const elementPosition = element.offsetTop - headerHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  interface NavItem {
    name: string;
    href: string;
    type?: 'anchor' | 'route';
    icon?: any;
    subItems?: NavItem[];
  }

  const navItems: NavItem[] = [
    {
      name: "Care",
      href: "#care",
      type: "anchor" as const,
      subItems: [
        {
          name: "Veterinary Care",
          href: "#",
          icon: Cross,
          subItems: [
            { name: "Consultation", href: "/services/find-vets" },
            { name: "Emergency", href: "/services/find-hospitals" },
            { name: "Surgery", href: "/services/find-hospitals" },
            { name: "Vaccination", href: "/services/find-hospitals?type=vaccination" },
            { name: "Lab Tests", href: "/services/find-hospitals?type=lab_tests" },
          ]
        },
        {
          name: "Training & Behavior",
          href: "#training-behavior",
          icon: GraduationCap,
          subItems: [
            { name: "Early Development", href: "/services/find-trainers?specialty=early-development" },
            { name: "Basic Training", href: "/services/find-trainers?specialty=basic-training" },
            { name: "Behavior Issues", href: "/services/find-trainers?specialty=behavior-issues" },
            { name: "Anxiety & Stress", href: "/services/find-trainers?specialty=anxiety-stress" },
            { name: "Aggression", href: "/services/find-trainers?specialty=aggression" },
          ]
        },
        {
          name: "Grooming",
          href: "#grooming",
          icon: Bath,
          subItems: [
            { name: "Complete Grooming", href: "/services/find-groomers?service=complete" },
            { name: "Bath & Brush", href: "/services/find-groomers?service=bath-brush" },
            { name: "Styling & Haircuts", href: "/services/find-groomers?service=styling" },
            { name: "Spa & Hygiene", href: "/services/find-groomers?service=spa-hygiene" },
            { name: "Flea & Tick Treatment", href: "/services/find-groomers?service=flea-tick" },
          ]
        },
      ]
    },
    {
      name: "Insurance",
      href: "#",
      type: "route" as const,
      subItems: [
        { name: "Compare Plans", href: "#", icon: ShieldCheck },
        { name: "Claims Support", href: "#", icon: FileCheck2 },
        { name: "Learn Insurance", href: "#", icon: BookOpen },
      ]
    },
    {
      name: "Shop",
      href: "#",
      type: "route" as const,
      subItems: [
        { name: "Pet Food", href: "#", icon: PetFoodIcon },
        { name: "Pet Pharmacy", href: "#", icon: Pill },
        { name: "Pet Essentials", href: "#", icon: ShoppingBag },
      ]
    },
    {
      name: "Community",
      href: "#community",
      type: "anchor" as const,
      subItems: [
        { name: "Pet Adoption", href: "/community/adoption", icon: HeartHandshake },
        { name: "Lost & Found", href: "/community/lost-and-found", icon: Home },
        { name: "Fundraising", href: "/community/fundraising", icon: Megaphone },
        { name: "Events & Meetups", href: "/community/events", icon: CalendarDays },
        { name: "NGOs & Rescues", href: "/community/ngos", icon: Users2 },
        { name: "Discussion Forums", href: "/community/discussion", icon: MessageCircle },
      ]
    },
    { name: "About", href: "/about", type: "route" as const },
  ];

  const handleSubmenuToggle = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-secondary/50 shadow-sm' : 'bg-transparent border-transparent'}`}>
        <div className="container mx-auto px-8 lg:px-20">
          <div className="flex items-center justify-between h-16 py-3 md:py-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group"
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="relative group-hover:scale-105 transition-all duration-300">
                <Image
                  src="/pacifico-zoodo.png"
                  alt="Zoodo"
                  width={180}
                  height={60}
                  className="h-6 md:h-6 lg:h-7 w-auto"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.subItems ? (
                    // Dropdown Trigger & Menu
                    <>
                      <button
                        className="relative flex items-center text-sm font-medium text-slate-900 hover:text-primary transition-colors duration-300 py-2 px-3 rounded-lg group"
                      >
                        <span className="relative z-10 flex items-center">
                          {item.name}
                          <svg className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>

                      {/* Dropdown Content */}
                      <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 w-max">
                        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl p-2">
                          {item.subItems.map((subItem: any) => {
                            if (subItem.subItems) {
                              return (
                                <div key={subItem.name} className="relative group/nested">
                                  <div className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer">
                                    <span className="flex items-center">
                                      {subItem.icon && <subItem.icon className="w-4 h-4 mr-2 text-foreground/65" />}
                                      {subItem.secondaryIcon && <subItem.secondaryIcon className="w-4 h-4 mr-3 text-foreground/65" />}
                                      {subItem.name}
                                    </span>
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                  </div>

                                  {/* Nested Flyout */}
                                  <div className="absolute top-[-8px] left-[calc(100%+12px)] opacity-0 translate-x-2 pointer-events-none group-hover/nested:opacity-100 group-hover/nested:translate-x-0 group-hover/nested:pointer-events-auto transition-all duration-300 w-max z-50">
                                    <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl p-2 relative">
                                      {/* Transparent bridge to prevent menu from closing on gap hover */}
                                      <div className="absolute top-0 -left-4 w-4 h-full" />
                                      {subItem.subItems.map((nestedItem: any) => {
                                        if (nestedItem.subItems) {
                                          return (
                                            <div key={nestedItem.name} className="relative group/supernested">
                                              <div className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                                                <span className="flex items-center">
                                                  {nestedItem.name}
                                                </span>
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                              </div>

                                              {/* Super Nested Flyout (4th level) */}
                                              <div className="absolute top-[-8px] left-[calc(100%+12px)] opacity-0 translate-x-2 pointer-events-none group-hover/supernested:opacity-100 group-hover/supernested:translate-x-0 group-hover/supernested:pointer-events-auto transition-all duration-300 w-max z-[60]">
                                                <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl p-2 relative">
                                                  <div className="absolute top-0 -left-4 w-4 h-full" />
                                                  {nestedItem.subItems.map((superNestedItem: any) => (
                                                    <Link
                                                      key={superNestedItem.name}
                                                      href={superNestedItem.href}
                                                      className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors whitespace-nowrap"
                                                    >
                                                      <span className="flex items-center">
                                                        {superNestedItem.name}
                                                      </span>
                                                    </Link>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }

                                        return (
                                          <Link
                                            key={nestedItem.name}
                                            href={nestedItem.href}
                                            className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors whitespace-nowrap"
                                          >
                                            <span className="flex items-center">
                                              {nestedItem.name}
                                            </span>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-2.5 text-sm font-medium text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              >
                                <span className="flex items-center">
                                  {subItem.icon && <subItem.icon className="w-4 h-4 mr-2 text-foreground/65" />}
                                  {subItem.secondaryIcon && <subItem.secondaryIcon className="w-4 h-4 mr-3 text-foreground/65" />}
                                  {subItem.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : item.type === 'route' ? (
                    <Link
                      href={item.href}
                      className="relative text-sm font-medium text-slate-900 hover:text-primary hover:scale-105 transition-all duration-300 py-2 px-3 rounded-lg block"
                    >
                      <span className="relative z-10 block">
                        {item.name}
                      </span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="relative text-sm font-medium text-slate-900 hover:text-primary hover:scale-105 transition-all duration-300 py-2 px-3 rounded-lg block"
                    >
                      <span className="relative z-10 block">
                        {item.name}
                      </span>
                    </a>
                  )}
                  {/* Hover Background - Only for non-dropdown items or main trigger */}
                  <div className={`absolute inset-0 ${isScrolled ? 'bg-primary/10' : 'bg-white/60'} rounded-lg opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 ease-out -z-10`}></div>
                </div>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3 md:space-x-3 lg:space-x-4">
              {/* Theme Toggle - Hidden as dark mode is disabled
              <NoSSR fallback={
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:bg-primary/10 relative"
                >
                  <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </Button>
              }>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:bg-primary/10 relative"
                >
                  {mounted && resolvedTheme === 'dark' ? (
                    <Sun className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-foreground" />
                  ) : (
                    <Moon className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-foreground" />
                  )}
                </Button>
              </NoSSR>
              */}

              {/* CTA Buttons */}
              <div className={`items-center space-x-2 lg:space-x-3 transition-all duration-300 ${isMenuOpen ? 'hidden lg:flex' : 'flex'}`}>
                {isAuthenticated ? (
                  <>
                    <div className="hidden md:flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Welcome, {user?.firstName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`hidden md:flex ${isScrolled ? 'hover:bg-primary/10' : 'hover:bg-white/60'} hover:text-primary hover:scale-105 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-2`}
                      asChild
                    >
                      <Link href={getDashboardUrl()}>Dashboard</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      className="hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-2"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`hidden md:flex ${isScrolled ? 'hover:bg-primary/10' : 'hover:bg-white/60'} text-slate-900 hover:text-primary hover:scale-105 transition-all duration-300 text-sm font-medium px-3 lg:px-4 py-2 rounded-lg`}
                      asChild
                    >
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-primary hover:bg-primary/90 transition-all duration-300 text-sm font-medium px-6 py-2 rounded-tl-[2rem] rounded-tr-[0.75rem] rounded-br-[2rem] rounded-bl-[2rem] text-white"
                      asChild
                    >
                      <Link href="/role-selection">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center text-foreground focus:outline-none"
                aria-label="Toggle menu"
              >
                <div className="relative w-4 h-3.5">
                  <motion.span
                    animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-0.5 bg-current rounded-full origin-center"
                  />
                  <motion.span
                    animate={isMenuOpen ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute top-[6px] left-0 w-full h-0.5 bg-current rounded-full"
                  />
                  <motion.span
                    animate={isMenuOpen ? { rotate: -45, y: -6, width: "100%" } : { rotate: 0, y: 0, width: "50%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 h-0.5 bg-current rounded-full origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Moved outside header to escape creating a new stacking context that clips fixed children */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[45] bg-background overflow-y-auto pt-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="container mx-auto px-8 py-4 flex flex-col h-full">
              <nav className="flex flex-col space-y-2 flex-shrink-0">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className="border-b border-black/10 dark:border-white/10 last:border-0"
                  >
                    <div className="flex items-center justify-between py-3 group">
                      {item.type === 'route' ? (
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          className="flex-1 text-base font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          {item.name}
                        </a>
                      )}

                      {item.subItems && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSubmenuToggle(item.name);
                          }}
                          className="p-1 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground ml-2 flex-shrink-0"
                        >
                          <div className="relative w-4 h-4 flex items-center justify-center">
                            <span className="absolute w-3.5 h-[1.5px] bg-current rounded-full" />
                            <motion.span
                              animate={{ rotate: openSubmenu?.startsWith(item.name) ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute w-[1.5px] h-3.5 bg-current rounded-full"
                            />
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Submenu */}
                    <AnimatePresence>
                      {item.subItems && openSubmenu?.startsWith(item.name) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 px-4 pb-6 space-y-3">
                            {item.subItems.map((subItem: any, subIndex: number) => {
                              return (
                                <motion.div
                                  key={subItem.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: subIndex * 0.05 }}
                                >
                                  <div className="flex items-center justify-between py-1 group/nested">
                                    <Link
                                      href={subItem.href}
                                      onClick={() => !subItem.subItems && setIsMenuOpen(false)}
                                      className="flex-1 text-sm text-muted-foreground hover:text-foreground transition-colors py-1 flex items-center"
                                    >
                                      {subItem.icon ? (
                                        <span className="flex items-center mr-3">
                                          <subItem.icon className="w-3.5 h-3.5 text-muted-foreground/80" />
                                          {subItem.secondaryIcon && <subItem.secondaryIcon className="w-3.5 h-3.5 ml-1.5 text-muted-foreground/80" />}
                                        </span>
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5 mr-2" />
                                      )}
                                      {subItem.name}
                                    </Link>

                                    {subItem.subItems && (
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setOpenSubmenu(openSubmenu === `${item.name}-${subItem.name}` ? item.name : `${item.name}-${subItem.name}`);
                                        }}
                                        className="p-1 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground ml-2"
                                      >
                                        <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                                          <span className="absolute w-3 h-[1.5px] bg-current rounded-full" />
                                          <motion.span
                                            animate={{ rotate: openSubmenu?.includes(subItem.name) ? 90 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute w-[1.5px] h-3 bg-current rounded-full"
                                          />
                                        </div>
                                      </button>
                                    )}
                                  </div>

                                  {/* Nested Submenu */}
                                  <AnimatePresence>
                                    {subItem.subItems && openSubmenu?.includes(subItem.name) && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                      >
                                        <div className="pl-6 space-y-2 py-2">
                                          {subItem.subItems.map((nestedItem: any) => (
                                            <div key={nestedItem.name} className="flex flex-col">
                                              <div className="flex items-center justify-between">
                                                <Link
                                                  href={nestedItem.href}
                                                  onClick={() => !nestedItem.subItems && setIsMenuOpen(false)}
                                                  className="flex-1 block text-sm text-muted-foreground/80 hover:text-foreground transition-colors py-1.5"
                                                >
                                                  • {nestedItem.name}
                                                </Link>
                                                {nestedItem.subItems && (
                                                  <button
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      e.stopPropagation();
                                                      setOpenSubmenu(
                                                        openSubmenu === `${item.name}-${subItem.name}-${nestedItem.name}`
                                                          ? `${item.name}-${subItem.name}`
                                                          : `${item.name}-${subItem.name}-${nestedItem.name}`
                                                      );
                                                    }}
                                                    className="p-1 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground ml-2"
                                                  >
                                                    <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                                                      <span className="absolute w-3 h-[1.5px] bg-current rounded-full" />
                                                      <motion.span
                                                        animate={{ rotate: openSubmenu?.includes(nestedItem.name) ? 90 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute w-[1.5px] h-3 bg-current rounded-full"
                                                      />
                                                    </div>
                                                  </button>
                                                )}
                                              </div>

                                              {/* Super Nested Menu (4th level) */}
                                              <AnimatePresence>
                                                {nestedItem.subItems && openSubmenu?.includes(nestedItem.name) && (
                                                  <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                  >
                                                    <div className="pl-4 space-y-2 py-1">
                                                      {nestedItem.subItems.map((superNestedItem: any) => (
                                                        <Link
                                                          key={superNestedItem.name}
                                                          href={superNestedItem.href}
                                                          onClick={() => setIsMenuOpen(false)}
                                                          className="block text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors py-1"
                                                        >
                                                          - {superNestedItem.name}
                                                        </Link>
                                                      ))}
                                                    </div>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Footer Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto pt-4 pb-6 space-y-4 flex-shrink-0"
              >
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-4 mb-4 p-4 bg-muted/30 rounded-2xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                        {user?.firstName?.charAt(0) || <User className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="font-medium text-lg">Welcome, {user?.firstName}</div>
                        <div className="text-sm text-muted-foreground">Manage your account</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full text-base h-12 rounded-xl"
                        asChild
                      >
                        <Link href={getDashboardUrl()} onClick={() => setIsMenuOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-base h-12 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full text-sm h-10 rounded-lg border-input"
                      asChild
                    >
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full text-sm h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                      asChild
                    >
                      <Link href="/role-selection" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
