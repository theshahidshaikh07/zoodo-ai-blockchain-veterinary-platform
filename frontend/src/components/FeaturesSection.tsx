import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Calendar, 
  Shield, 
  Users, 
  MapPin, 
  Heart,
  Smartphone,
  ChartBar,
  Clock,
  Award,
  Zap,
  Globe,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Pet Care Assistant",
    description: "Intelligent symptom analysis and personalized care recommendations powered by advanced AI.",
    color: "zoodo-purple"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Book clinic visits, home consultations, or teleconsultations with ease.",
    color: "zoodo-blue"
  },
  {
    icon: Shield,
    title: "Blockchain Records",
    description: "Secure, immutable medical records that you own and control.",
    color: "zoodo-green"
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with pet owners, find adoption opportunities, and join welfare events.",
    color: "zoodo-orange"
  },
  {
    icon: MapPin,
    title: "Location-Based Matching",
    description: "Find the best veterinarians and trainers near you based on reviews and expertise.",
    color: "zoodo-purple"
  },
  {
    icon: Heart,
    title: "Emergency Care",
    description: "24/7 access to emergency veterinary services and immediate care guidance.",
    color: "zoodo-blue"
  }
];

const stats = [
  { icon: Smartphone, label: "Mobile-First Design", value: "100%" },
  { icon: ChartBar, label: "Accuracy Rate", value: "95%" },
  { icon: Clock, label: "Response Time", value: "<30s" },
  { icon: Award, label: "Certified Vets", value: "1000+" },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2 text-primary" />
            Platform Features
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold">
            Supporting the <span className="gradient-text">finest</span> and{" "}
            <span className="gradient-text">smartest</span> features.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We&#39;re revolutionizing pet healthcare with cutting-edge technology that puts your pet&#39;s wellbeing first.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card p-8 rounded-3xl hover:shadow-elegant transition-all duration-500 scale-on-hover fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color} to-${feature.color}/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:gradient-text transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center space-y-3 p-6 glass-card rounded-2xl fade-up hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl lg:text-4xl font-bold">
              Ready to experience the <span className="gradient-text">future</span> of pet care?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of pet owners who trust Zoodo for their pet&#39;s health and wellbeing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" className="group bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300">
              <Globe className="w-5 h-5 mr-2" />
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;