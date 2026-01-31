'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import NoSSR from "./NoSSR";
import Link from "next/link";
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Settings } from "lucide-react";

interface HeaderProps {
  isScrolled?: boolean;
}

const Header = ({ isScrolled: externalIsScrolled }: HeaderProps = {}) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    if (pathname !== '/') {
      router.push('/' + href);
      return;
    }
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const headerHeight = 96; // Approximate header height
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }

    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", href: "#hero", type: "anchor" as const },
    { name: "Services", href: "#services", type: "anchor" as const },
    { name: "Community", href: "#community", type: "anchor" as const },
    { name: "About", href: "/about", type: "route" as const },
    { name: "Contact", href: "/contact", type: "route" as const },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
      ? 'glass-card border-b border-border/30 shadow-elegant backdrop-blur-xl'
      : 'bg-transparent border-b border-transparent'
      }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-22 lg:h-24 py-5 md:py-6 lg:py-7">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
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
              item.type === 'route' ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-sm font-medium text-foreground hover:text-primary hover:scale-105 transition-all duration-300 group py-2 px-3 rounded-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10 block">
                    {item.name}
                  </span>
                  <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 ease-out"></div>
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="relative text-sm font-medium text-foreground hover:text-primary hover:scale-105 transition-all duration-300 group py-2 px-3 rounded-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10 block">
                    {item.name}
                  </span>
                  <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 ease-out"></div>
                </a>
              )
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
                    className="bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-glow transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-2"
                    asChild
                  >
                    <Link href="/role-selection">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-8 h-8 md:w-10 md:h-10 hover:bg-primary/10 hover:scale-105 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 md:h-6 md:w-6" />
              ) : (
                <Menu className="h-5 w-5 md:h-6 md:w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden glass-card border border-border/30 rounded-2xl mt-4 p-6 shadow-elegant backdrop-blur-xl">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                item.type === 'route' ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium text-foreground hover:text-primary hover:scale-105 transition-all duration-300 py-2 px-3 rounded-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-sm font-medium text-foreground hover:text-primary hover:scale-105 transition-all duration-300 py-2 px-3 rounded-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.name}
                  </a>
                )
              ))}
              <div className="pt-4 border-t border-border/30">
                <div className="flex flex-col space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="text-sm text-muted-foreground mb-2">
                        Welcome, {user?.firstName}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300"
                        asChild
                      >
                        <Link href={getDashboardUrl()} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="justify-start hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300"
                        asChild
                      >
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="justify-start bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-glow transition-all duration-300"
                        asChild
                      >
                        <Link href="/role-selection" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;