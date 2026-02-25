'use client';

import { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Your message has been sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.error?.message || data.error || 'Failed to send message.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative transition-colors duration-500">
          <div className="bg-[#bde4e9] dark:bg-primary/10 rounded-b-[4rem] lg:rounded-b-[6rem] overflow-hidden min-h-[85vh] relative flex flex-col justify-center pt-32 lg:pt-40 pb-12">

            <div className="container mx-auto px-8 lg:px-12 relative z-10 w-full xl:max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

                {/* Left Side: Information */}
                <div className="space-y-8 lg:space-y-12 w-full lg:pr-10">
                  <div className="space-y-5">
                    <h1 className="text-[3rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold font-heading text-slate-900 dark:text-white leading-[1.1] tracking-tight whitespace-nowrap">
                      Let's start a <br />
                      <span className="text-slate-500 dark:text-slate-400">conversation.</span>
                    </h1>

                    <div className="flex items-center gap-4 pl-1">
                      <div className="w-[3px] h-12 bg-primary rounded-full flex-shrink-0 opacity-80" />
                      <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 font-medium leading-[1.5] max-w-[420px]">
                        Whether you have questions, feedback, or need premium pet care support. <br />
                        <span className="text-slate-900 dark:text-white font-bold">We're here.</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 pl-1">
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-800 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-0.5 pt-1 sm:pt-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Email Us</h4>
                        <a href="mailto:zoodo.care@gmail.com" className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium hover:text-primary transition-colors">zoodo.care@gmail.com</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-800 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-0.5 pt-1 sm:pt-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Location</h4>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-[280px]">
                          Pune, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="relative w-full max-w-md mx-auto lg:ml-auto lg:mx-0 group mt-10 lg:mt-0">
                  {/* Subtle offset drop shadow background to match About us pattern */}
                  <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/5 rounded-3xl translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 transition-transform duration-300" />

                  <div className="relative bg-white dark:bg-slate-950 border-2 border-transparent dark:border-slate-800 p-6 sm:px-8 sm:pb-8 pt-10 sm:pt-12 rounded-3xl z-10 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">

                      <div className="space-y-1">
                        <label htmlFor="name" className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest ml-1">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 sm:py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner text-sm"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="email" className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest ml-1">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 sm:py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner text-sm"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="subject" className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest ml-1">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 sm:py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner text-sm"
                          placeholder="How can we help?"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="message" className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest ml-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={2}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 sm:py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner text-sm resize-none"
                          placeholder="Tell us what's on your mind..."
                        />
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-11 sm:h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-xl text-sm"
                        >
                          {isLoading ? 'Sending Message...' : 'Send Message'}
                          {!isLoading && <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-8 lg:px-20 max-w-7xl">
            <motion.div
              className="h-[400px] md:h-[500px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-slate-200 dark:border-slate-800 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-slate-900/10 z-10 pointer-events-none transition-colors duration-500 group-hover:bg-transparent"></div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.237496760631!2d73.8341417749604!3d18.51562218256976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1f4c9d6e8b5%3A0x3f4a3c4f9c4f4f4f!2sG.%20H.%20Raisoni%20College%20of%20Engineering%20and%20Management!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="w-full h-full filter grayscale-[0.2] contrast-[1.1]"
              ></iframe>
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-6 rounded-2xl md:rounded-[2rem] z-20 shadow-xl border border-slate-100 dark:border-slate-800 max-w-md">
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-full shrink-0">
                    <MapPin className="w-6 h-6 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Our Headquarters</h4>
                    <p className="font-medium text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      G.H. Raisoni College of Engineering and Management, Wagholi, Pune, Maharashtra 412207
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
