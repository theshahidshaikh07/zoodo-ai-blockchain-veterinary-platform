import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import NoSSR from "./NoSSR";
import Link from "next/link";
import Image from "next/image";
import zoodoLogo from "@/assets/zoodo.png";
import zoodoLightLogo from "@/assets/Zoodo-light.png";

const Header = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (mounted) {
      const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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
    { name: "Home", href: "#hero" },
    { name: "Services", href: "#services" },
    { name: "Community", href: "#community" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-card border-b border-border/30 shadow-elegant backdrop-blur-xl' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-22 lg:h-24 py-5 md:py-6 lg:py-7">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative group-hover:scale-105 transition-all duration-300">
              <Image
                src={mounted && resolvedTheme === 'dark' ? zoodoLightLogo : zoodoLogo}
                alt="Zoodo"
                width={120}
                height={40}
                className="h-3 md:h-4 lg:h-5 w-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item, index) => (
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
                {/* Background highlight like Sign In button */}
                <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 ease-out"></div>
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
            {/* Theme Toggle - Wrapped in NoSSR */}
            <NoSSR fallback={
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:bg-primary/10 hover:scale-105 transition-all duration-300 relative group"
              >
                <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </Button>
            }>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hover:bg-primary/10 hover:scale-105 transition-all duration-300 relative group"
              >
                {mounted && resolvedTheme === 'dark' ? (
                  <Sun className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 group-hover:rotate-180 transition-all duration-300" />
                ) : (
                  <Moon className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 group-hover:rotate-180 transition-all duration-300" />
                )}
              </Button>
            </NoSSR>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-2"
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
                <Link href="/register">Get Started</Link>
              </Button>
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
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm font-medium text-foreground hover:text-primary hover:scale-105 transition-all duration-300 py-2 px-3 rounded-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-border/30">
                <div className="flex flex-col space-y-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300"
                    asChild
                  >
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="justify-start bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-glow transition-all duration-300"
                    asChild
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
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