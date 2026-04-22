import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Orbs */}
      <div className="floating-orb w-[500px] h-[500px] bg-primary/30 -top-40 -left-40" />
      <div className="floating-orb w-[400px] h-[400px] bg-secondary/30 top-1/3 -right-32" />
      <div className="floating-orb w-[300px] h-[300px] bg-accent/20 bottom-0 left-1/3" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Empowering Communities Worldwide
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="gradient-text">ImpactSphere</span>
            <br />
            <span className="text-foreground">Empowering NGOs</span>
            <br />
            <span className="text-muted-foreground text-3xl sm:text-4xl lg:text-5xl font-medium">Digitally</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Transparent Donations · Food Support · Talent for All
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/donate"
              className="glow-button px-8 py-4 rounded-2xl font-semibold text-primary-foreground inline-flex items-center justify-center gap-2 text-lg"
            >
              <Heart size={20} />
              Donate Now
            </Link>
            <Link
              to="/volunteer"
              className="glow-button-outline px-8 py-4 rounded-2xl font-semibold text-foreground inline-flex items-center justify-center gap-2 text-lg"
            >
              <Users size={20} />
              Join as Volunteer
            </Link>
          </motion.div>
        </div>

        {/* Floating 3D Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
              {[
                { icon: "🌍", title: "Global Reach", desc: "150+ countries impacted" },
                { icon: "💎", title: "Transparent", desc: "100% donation tracking" },
                { icon: "⚡", title: "Real-time", desc: "Live progress updates" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  className="text-center p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
