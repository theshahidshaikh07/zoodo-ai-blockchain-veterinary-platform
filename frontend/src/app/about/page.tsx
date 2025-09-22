'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { HeartPulse, Award, Users2, BrainCircuit, Mail, Linkedin, Twitter, ArrowRight, Zap } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useRouter } from 'next/navigation';
import shahidImage from '@/assets/Shahid-Passport-copy.png';
import aayusheeImage from '@/assets/Aayushee .jpg';
import khushiImage from '@/assets/khushi.jpg';
import { Card, CardContent } from "@/components/ui/card";

const AboutUs: React.FC = () => {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: storyRef, isVisible: storyVisible } = useScrollAnimation();
  const { elementRef: valuesRef, isVisible: valuesVisible } = useScrollAnimation();
  const { elementRef: teamRef, isVisible: teamVisible } = useScrollAnimation();
  const { elementRef: missionRef, isVisible: missionVisible } = useScrollAnimation();
  const router = useRouter();

  const handleExploreServicesClick = () => {
    router.push('/#services');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section ref={heroRef} className={`relative text-center py-20 overflow-hidden scroll-fade-in ${heroVisible ? 'animate' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/30 text-sm font-medium text-primary mb-4">
              <HeartPulse className="w-4 h-4 mr-2" />
              About Zoodo
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Revolutionizing Pet <span className="gradient-text">Healthcare</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              We're on a mission to make quality veterinary care accessible to every pet parent
              through AI-powered diagnostics, expert guidance, and a supportive community.
            </p>
            <Button size="lg" className="mt-8 group" onClick={handleExploreServicesClick}>
              Explore Our Services <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>

        {/* Our Story Section */}
        <section ref={storyRef} className={`py-20 scroll-fade-in ${storyVisible ? 'animate' : ''}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Story</h2>
              <p className="mt-2 text-lg text-muted-foreground">Born from a passion to bridge the gap between pet parents and veterinary expertise</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="glass-card p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-primary mb-2">The Challenge</h3>
                <p className="text-muted-foreground">
                  Too many pet parents struggle to access timely, affordable veterinary care. Emergency visits, long wait times, and high costs create barriers to proper pet healthcare.
                </p>
                <h3 className="text-xl font-bold text-primary mt-6 mb-2">Our Solution</h3>
                <p className="text-muted-foreground">
                  Zoodo leverages advanced AI technology to provide instant health assessments, connects pet parents with certified veterinarians, and builds a supportive community where knowledge and care are shared.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="glass-card p-6 rounded-2xl">
                  <p className="text-4xl font-bold gradient-text">500+</p>
                  <p className="text-muted-foreground">Veterinarians</p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <p className="text-4xl font-bold gradient-text">10K+</p>
                  <p className="text-muted-foreground">Pets Helped</p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <p className="text-4xl font-bold gradient-text">50+</p>
                  <p className="text-muted-foreground">Cities</p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <p className="text-4xl font-bold gradient-text">24/7</p>
                  <p className="text-muted-foreground">Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section ref={valuesRef} className={`py-20 bg-primary/5 scroll-fade-in ${valuesVisible ? 'animate' : ''}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Values</h2>
              <p className="mt-2 text-lg text-muted-foreground">The principles that guide everything we do at Zoodo</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="glass-card p-8 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-zoodo-purple to-zoodo-purple/70 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <HeartPulse className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Compassionate Care</h3>
                    <p className="text-muted-foreground leading-relaxed">Every pet deserves loving, professional care. We bridge the gap between pet parents and veterinary experts.</p>
                </div>
                <div className="glass-card p-8 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-zoodo-blue to-zoodo-blue/70 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Excellence</h3>
                    <p className="text-muted-foreground leading-relaxed">We maintain the highest standards in pet healthcare through continuous innovation and expert partnerships.</p>
                </div>
                <div className="glass-card p-8 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <Users2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Community</h3>
                    <p className="text-muted-foreground leading-relaxed">Building a supportive community where pet parents can share experiences and learn from each other.</p>
                </div>
                <div className="glass-card p-8 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <BrainCircuit className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Innovation</h3>
                    <p className="text-muted-foreground leading-relaxed">Leveraging cutting-edge AI technology to make veterinary care more accessible and efficient.</p>
                </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section ref={teamRef} className={`py-20 scroll-fade-in ${teamVisible ? 'animate' : ''}`}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Team</h2>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals dedicated to revolutionizing pet healthcare
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Main Founder */}
              <div className="mb-16">
                <Card className="glass-card glow-effect overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative h-64 lg:h-[560px] overflow-hidden">
                      <Image
                        src={shahidImage}
                        alt="Shahid Shaikh"
                        className="w-full h-full object-cover"
                        layout="fill"
                      />
                      <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
                    </div>
                    <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm font-medium text-primary mb-4 w-fit">
                        Founder & CEO
                      </div>
                      <h3 className="text-3xl font-bold mb-4">Shahid Shaikh</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Visionary leader with 8+ years in healthcare technology. Passionate about revolutionizing pet care through AI innovation.
                      </p>
                      <div className="flex gap-4">
                        <Button variant="ghost" size="icon">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Twitter className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* Other Team Members */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="glass-card hover:glow-effect transition-all duration-300 scale-on-hover">
                    <div className="relative h-64 overflow-hidden">
                    <Image
                        src={aayusheeImage}
                        alt="Aayushee Dhanokar"
                        className="w-full h-full object-cover"
                        layout="fill"
                    />
                    <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
                    </div>
                    <CardContent className="p-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-xs font-medium text-primary mb-3 w-fit">
                        CTO & Co-Founder
                    </div>
                    <h3 className="text-xl font-bold mb-3">Aayushee Dhanokar</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        Tech expert specializing in AI/ML solutions for healthcare. Leading our cutting-edge diagnostic technology development.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="ghost" size="sm">
                        <Mail className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                        <Linkedin className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                        <Twitter className="w-3 h-3" />
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                <Card className="glass-card hover:glow-effect transition-all duration-300 scale-on-hover">
                    <div className="relative h-64 overflow-hidden">
                    <Image
                        src={khushiImage}
                        alt="Khushi Mishra"
                        className="w-full h-full object-cover"
                        layout="fill"
                    />
                    <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
                    </div>
                    <CardContent className="p-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-xs font-medium text-primary mb-3 w-fit">
                        Head of Operations
                    </div>
                    <h3 className="text-xl font-bold mb-3">Khushi Mishra</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        Operations strategist ensuring seamless user experience. Expert in scaling healthcare platforms and community building.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="ghost" size="sm">
                        <Mail className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                        <Linkedin className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                        <Twitter className="w-3 h-3" />
                        </Button>
                    </div>
                    </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Mission Section */}
        <section ref={missionRef} className={`py-20 bg-primary/5 scroll-fade-in ${missionVisible ? 'animate' : ''}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/30 text-sm font-medium text-primary mb-4">
                <Zap className="w-4 h-4 mr-2" />
                Join Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Join Our Mission</h2>
            <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
              Ready to give your pet the best healthcare experience? Join thousands of pet parents who trust Zoodo for their furry family members.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Button size="lg" className="group">Get Started Today <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></Button>
              <Button size="lg" variant="outline">Contact Us</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;