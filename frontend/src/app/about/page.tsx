'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { HeartPulse, Award, Users2, BrainCircuit, Mail, Linkedin, Github, ArrowRight, Zap, AlertTriangle, Lightbulb } from 'lucide-react';
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
            
            {/* Statistics Section */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="glass-card p-6 rounded-2xl text-center">
                <p className="text-4xl font-bold gradient-text">500+</p>
                <p className="text-muted-foreground">Veterinarians</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <p className="text-4xl font-bold gradient-text">10K+</p>
                <p className="text-muted-foreground">Pets Helped</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <p className="text-4xl font-bold gradient-text">50+</p>
                <p className="text-muted-foreground">Cities</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <p className="text-4xl font-bold gradient-text">24/7</p>
                <p className="text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section ref={storyRef} className={`py-20 scroll-fade-in ${storyVisible ? 'animate' : ''}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Story</h2>
              <p className="mt-2 text-lg text-muted-foreground">Transforming pet healthcare through innovation, compassion, and cutting-edge technology</p>
            </div>
            
            {/* Challenge and Solution Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Challenge Card */}
              <Card className="glass-card hover:glow-effect transition-all duration-300 group border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mr-4">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">The Challenge</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                    Many pet parents find it hard to get timely and affordable veterinary care. Emergency visits are stressful, regular check-ups are costly, and long wait times often delay treatment. Without round-the-clock expert guidance, pets don’t always get the care they deserve, leaving families worried and helpless.                    </p>
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <ul className="text-sm text-primary space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          Limited access to emergency veterinary care
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          High costs preventing regular check-ups
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          Long wait times for appointments
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          Lack of 24/7 expert guidance
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Solution Card */}
              <Card className="glass-card hover:glow-effect transition-all duration-300 group border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mr-4">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Our Solution</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                    Zoodo makes pet healthcare simple, accessible, and supportive. With instant AI health checks, 24/7 access to trusted vets, and affordable online consultations, pet parents can make quick, informed decisions. A friendly community platform also ensures knowledge and care are always within reach.                    </p>
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <ul className="text-sm text-primary space-y-2">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          AI-powered instant health assessments
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          24/7 access to certified veterinarians
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          Affordable telemedicine consultations
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          Supportive community platform
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <HeartPulse className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Compassionate Care</h3>
                    <p className="text-muted-foreground leading-relaxed">Every pet deserves loving, professional care. We bridge the gap between pet parents and veterinary experts.</p>
                </div>
                <div className="glass-card p-8 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-6 mx-auto">
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
                        <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Innovation</h3>
                    <p className="text-muted-foreground leading-relaxed">Leveraging cutting-edge AI technology to make veterinary care more accessible and efficient.</p>
                </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section ref={teamRef} className={`py-20 scroll-fade-in ${teamVisible ? 'animate' : ''}`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/30 text-sm font-medium text-primary mb-4">
                <Users2 className="w-4 h-4 mr-2" />
                Our Team
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals behind Zoodo's mission
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Shahid Shaikh */}
                <Card className="glass-card hover:glow-effect transition-all duration-300 group border-2 border-primary/10 hover:border-primary/30">
                  <div className="relative overflow-hidden">
                    <div className="relative h-80 sm:h-72 md:h-64 overflow-hidden">
                      <Image
                        src={shahidImage}
                        alt="Shahid Shaikh"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        layout="fill"
                      />
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold text-foreground mb-2">Shahid Shaikh</h3>
                      <p className="text-primary font-medium mb-3">Founder & CEO</p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        Visionary leader with 8+ years in healthcare technology, passionate about revolutionizing pet care through AI innovation.
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Github className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>

                {/* Aayushee Dhanokar */}
                <Card className="glass-card hover:glow-effect transition-all duration-300 group border-2 border-primary/10 hover:border-primary/30">
                  <div className="relative overflow-hidden">
                    <div className="relative h-80 sm:h-72 md:h-64 overflow-hidden">
                      <Image
                        src={aayusheeImage}
                        alt="Aayushee Dhanokar"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        layout="fill"
                      />
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold text-foreground mb-2">Aayushee Dhanokar</h3>
                      <p className="text-primary font-medium mb-3">CTO & Co-Founder</p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        AI/ML expert driving our cutting-edge diagnostic technology, passionate about creating intelligent solutions for veterinary care.
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Github className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>

                {/* Khushi Mishra */}
                <Card className="glass-card hover:glow-effect transition-all duration-300 group border-2 border-primary/10 hover:border-primary/30">
                  <div className="relative overflow-hidden">
                    <div className="relative h-80 sm:h-72 md:h-64 overflow-hidden">
                      <Image
                        src={khushiImage}
                        alt="Khushi Mishra"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        layout="fill"
                      />
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold text-foreground mb-2">Khushi Mishra</h3>
                      <p className="text-primary font-medium mb-3">Head of Operations</p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        Operations strategist ensuring seamless user experiences, expert in scaling healthcare platforms and community building.
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                          <Github className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
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