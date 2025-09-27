'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import Image from 'next/image';
import contactImage from '@/assets/contact-hero.jpg';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24 mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-12"
            >
              Have questions or need assistance? We're here to help you with all your pet care needs.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-primary/10 p-4 rounded-full text-primary mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Location</h4>
                <p className="text-muted-foreground text-sm">Pune, India</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-primary/10 p-4 rounded-full text-primary mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Email Us</h4>
                <p className="text-muted-foreground text-sm">zoodo.care@gmail.com</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-primary/10 p-4 rounded-full text-primary mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Call Us</h4>
                <p className="text-muted-foreground text-sm">+91 7620944018</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card p-8 md:p-10 rounded-2xl shadow-lg"
            >
              <div className="text-center mb-10">
                <motion.h2 
                  className="text-3xl font-bold text-foreground mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Let's Talk !
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Have a question or feedback? We'd love to hear from you.
                </motion.p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                      Your Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-2">
                    Subject <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-border focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell us more about how we can help..."
                  />
                </div>
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="h-96 w-full rounded-2xl overflow-hidden shadow-xl relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none"></div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.237496760631!2d73.8341417749604!3d18.51562218256976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1f4c9d6e8b5%3A0x3f4a3c4f9c4f4f4f!2sG.%20H.%20Raisoni%20College%20of%20Engineering%20and%20Management!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-2xl"
            ></iframe>
            <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-4 rounded-lg z-20 shadow-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-medium text-sm">G.H. Raisoni College of Engineering and Management, Wagholi, Pune, Maharashtra 412207</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      </main>
      <Footer />
    </div>
  );
}
