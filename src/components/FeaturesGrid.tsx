import { motion } from "framer-motion";
import { Shield, Utensils, Star, Users, Calendar, Baby } from "lucide-react";

const features = [
  { icon: Shield, title: "Donation Transparency", desc: "Track every rupee with blockchain-backed transparency and real-time reporting.", color: "from-primary/20 to-primary/5" },
  { icon: Utensils, title: "Annadanam", desc: "Schedule and manage food donation programs across multiple locations.", color: "from-accent/20 to-accent/5" },
  { icon: Star, title: "Talent Showcase", desc: "Discover and spotlight hidden talents from communities we serve.", color: "from-secondary/20 to-secondary/5" },
  { icon: Users, title: "Volunteer System", desc: "Connect passionate volunteers with meaningful opportunities.", color: "from-primary/20 to-accent/5" },
  { icon: Calendar, title: "Event Management", desc: "Organize impactful events with integrated registration and tracking.", color: "from-secondary/20 to-primary/5" },
  { icon: Baby, title: "Child Tracking", desc: "Monitor education and health progress of supported children.", color: "from-accent/20 to-secondary/5" },
];

const FeaturesGrid = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to run a modern, transparent, and impactful NGO
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover rounded-2xl p-8 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
