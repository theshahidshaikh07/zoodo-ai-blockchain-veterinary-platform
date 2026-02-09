'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import NoSSR from "./NoSSR";
import Link from "next/link";
import Image from "next/image";

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

  const navItems = [
    { name: "Home", href: "#hero", type: "anchor" as const },
    {
      name: "Services",
      href: "#services",
      type: "anchor" as const,
      subItems: [
        { name: "Find Vet", href: "/services/find-vets" },
        { name: "Veterinary Clinics", href: "/services/find-hospitals" },
        { name: "Teleconsultation", href: "/services/find-vets?type=online" },
        { name: "Pet Training", href: "/services/find-trainers" },
      ]
    },
    { name: "Community", href: "#community", type: "anchor" as const },
    { name: "About", href: "/about", type: "route" as const },
    { name: "Contact", href: "/contact", type: "route" as const },
  ];

  const handleSubmenuToggle = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-22 lg:h-24 py-5 md:py-6 lg:py-7">
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
                  src="/Zoodo.png"
                  alt="Zoodo"
                  width={120}
                  height={40}
                  className="h-3 md:h-4 lg:h-5 w-auto"
                  priority
                />
              </div>
              <span className="ml-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                BETA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.subItems ? (
                    // Dropdown Trigger & Menu
                    <>
                      <button
                        className="relative flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 py-2 px-3 rounded-lg group"
                      >
                        <span className="relative z-10 flex items-center">
                          {item.name}
                          <svg className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>

                      {/* Dropdown Content */}
                      <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 min-w-[220px]">
                        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl p-2 overflow-hidden">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : item.type === 'route' ? (
                    <Link
                      href={item.href}
                      className="relative text-sm font-medium text-foreground hover:text-primary hover:scale-105 transition-all duration-300 py-2 px-3 rounded-lg block"
                    >
                      <span className="relative z-10 block">
                        {item.name}
                      </span>
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="relative text-sm font-medium text-foreground hover:text-primary hover:scale-105 transition-all duration-300 py-2 px-3 rounded-lg block"
                    >
                      <span className="relative z-10 block">
                        {item.name}
                      </span>
                    </a>
                  )}
                  {/* Hover Background - Only for non-dropdown items or main trigger */}
                  <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 ease-out -z-10"></div>
                </div>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
              {/* Theme Toggle - Wrapped in NoSSR */}
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

              {/* CTA Buttons */}
              <div className="flex items-center space-x-2 lg:space-x-3">
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
                      className="hidden md:flex hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-2"
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
                      className="hidden md:flex hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-2"
                      asChild
                    >
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-2"
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
            <div className="container mx-auto px-6 py-4 flex flex-col h-full">
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
                              animate={{ rotate: openSubmenu === item.name ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="absolute w-[1.5px] h-3.5 bg-current rounded-full"
                            />
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Submenu */}
                    <AnimatePresence>
                      {item.subItems && openSubmenu === item.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 px-4 pb-6 space-y-3">
                            {item.subItems.map((subItem, subIndex) => (
                              <motion.div
                                key={subItem.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: subIndex * 0.05 }}
                              >
                                <Link
                                  href={subItem.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex items-center text-sm text-muted-foreground/80 hover:text-foreground transition-colors"
                                >
                                  <ChevronRight className="w-3.5 h-3.5 mr-2" />
                                  {subItem.name}
                                </Link>
                              </motion.div>
                            ))}
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