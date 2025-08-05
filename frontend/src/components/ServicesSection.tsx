import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Stethoscope, Building2, Video, Heart, MapPin, Clock, Star, ArrowRight, Zap, Search, UserCheck, Users, Search as MagnifyingGlass, MapPin as Location, Video as TeleIcon, GraduationCap
} from "lucide-react";
import serviceFindVet from "@/assets/service-find-vet.jpg";
import serviceClinicHospital from "@/assets/vetic.jpg";
import serviceTeleconsultation from "@/assets/service-teleconsultation.jpg";
import servicePetTrainer from "@/assets/service-pet-trainer.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    title: "Find Vet",
    description: "Connect with verified veterinarians in your area. Get instant access to qualified pet healthcare professionals.",
    image: serviceFindVet,
    color: "zoodo-green",
    icon: Stethoscope,
    animatedIcon: Search,
    headingIcon: MagnifyingGlass,
    features: ["Verified Vets", "Instant Booking", "24/7 Support"]
  },
  {
    title: "Clinic & Hospital",
    description: "Discover top-rated pet clinics and hospitals with advanced medical facilities and expert care teams.",
    image: serviceClinicHospital,
    color: "zoodo-blue",
    icon: Building2,
    animatedIcon: MapPin,
    headingIcon: Location,
    features: ["Advanced Facilities", "Expert Teams", "Emergency Care"]
  },
  {
    title: "Teleconsultation",
    description: "Get professional veterinary advice from the comfort of your home through secure video consultations.",
    image: serviceTeleconsultation,
    color: "zoodo-purple",
    icon: Video,
    animatedIcon: Clock,
    headingIcon: TeleIcon,
    features: ["Video Consultations", "Secure Platform", "Prescription Service"]
  },
  {
    title: "Pet Trainer",
    description: "Connect with certified pet trainers for behavioral training, obedience classes, and specialized care.",
    image: servicePetTrainer,
    color: "zoodo-orange",
    icon: Heart,
    animatedIcon: UserCheck,
    headingIcon: GraduationCap,
    features: ["Certified Trainers", "Behavioral Training", "Obedience Classes"]
  }
];

const ServicesSection = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { elementRef: servicesRef, isVisible: servicesVisible } = useScrollAnimation();

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zoodo-purple/5 via-zoodo-blue/5 to-zoodo-pink/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 space-y-6 scroll-fade-in ${headerVisible ? 'animate' : ''}`}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-primary/10 border-2 border-primary/30 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2 text-primary" />
            Our Services
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
            <span className="block lg:inline">Comprehensive </span>
            <span className="gradient-text">pet care services</span><br className="hidden lg:block" />
            <span className="mt-1 sm:mt-2 lg:mt-0 lg:inline block">at your fingertips</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            From finding the right veterinarian to emergency care and training, we've got all your pet's needs covered.
          </p>
        </div>

        {/* Services Grid */}
        <div 
          ref={servicesRef}
          className={`grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-20 max-w-7xl mx-auto scroll-fade-in ${servicesVisible ? 'animate' : ''}`}
        >
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative glass-card rounded-3xl hover:shadow-2xl transition-all duration-700 hover:scale-105 overflow-hidden border border-border/20 hover:border-primary/30 scroll-scale-in scroll-stagger-${index + 1} ${servicesVisible ? 'animate' : ''}`}
            >
              {/* Service Image */}
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {/* Main Icon */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-elegant group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all duration-300 flex items-center">
                  {service.title === "Find Vet" && (
                    <MagnifyingGlass className="w-5 h-5 mr-2 text-primary group-hover:scale-110 group-hover:animate-pulse transition-all duration-300" />
                  )}
                  {service.title === "Clinic & Hospital" && (
                    <Location className="w-5 h-5 mr-2 text-primary group-hover:scale-110 group-hover:animate-bounce transition-all duration-300" />
                  )}
                  {service.title === "Teleconsultation" && (
                    <TeleIcon className="w-5 h-5 mr-2 text-primary group-hover:scale-110 group-hover:animate-ping transition-all duration-300" />
                  )}
                  {service.title === "Pet Trainer" && (
                    <GraduationCap className="w-5 h-5 mr-2 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  )}
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {service.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="w-full group/btn text-sm py-3 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 cursor-pointer hover:cursor-pointer text-white font-medium rounded-md flex items-center justify-center relative z-10"
                  style={{ cursor: 'pointer !important' }}
                  onClick={() => {
                    // TODO: Add navigation to specific service pages
                    console.log(`Navigate to ${service.title} service`);
                  }}
                >
                  Explore Service
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-3 p-6 glass-card rounded-2xl fade-up hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl lg:text-4xl font-bold text-zoodo-purple group-hover:scale-110 transition-transform">500+</div>
            <div className="text-sm text-muted-foreground">Verified Vets</div>
          </div>
          <div className="text-center space-y-3 p-6 glass-card rounded-2xl fade-up hover:scale-105 transition-all duration-300 group" style={{ animationDelay: '100ms' }}>
            <div className="text-3xl lg:text-4xl font-bold text-zoodo-blue group-hover:scale-110 transition-transform">100+</div>
            <div className="text-sm text-muted-foreground">Partner Clinics</div>
          </div>
          <div className="text-center space-y-3 p-6 glass-card rounded-2xl fade-up hover:scale-105 transition-all duration-300 group" style={{ animationDelay: '200ms' }}>
            <div className="text-3xl lg:text-4xl font-bold text-zoodo-pink group-hover:scale-110 transition-transform">24/7</div>
            <div className="text-sm text-muted-foreground">Teleconsultation</div>
          </div>
          <div className="text-center space-y-3 p-6 glass-card rounded-2xl fade-up hover:scale-105 transition-all duration-300 group" style={{ animationDelay: '300ms' }}>
            <div className="text-3xl lg:text-4xl font-bold text-zoodo-orange group-hover:scale-110 transition-transform">200+</div>
            <div className="text-sm text-muted-foreground">Certified Trainers</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;