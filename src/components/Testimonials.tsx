import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", role: "Donor", text: "ImpactSphere made it so easy to track where my donations go. I can see the real impact in real-time. Truly transparent!" },
  { name: "Rahul Verma", role: "Volunteer", text: "The volunteer management system is incredible. I got matched with tasks that perfectly fit my skills and schedule." },
  { name: "Anita Desai", role: "NGO Partner", text: "Our food donation program became 10x more efficient. The scheduling and tracking tools are world-class." },
  { name: "Karthik Nair", role: "Talent Showcase", text: "This platform gave me visibility I never had. My artwork reached thousands and I received mentorship opportunities." },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

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
            What People <span className="gradient-text">Say</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-12 relative min-h-[280px] flex flex-col justify-center">
            <Quote className="text-primary/20 absolute top-6 left-6" size={48} />
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-foreground text-lg sm:text-xl leading-relaxed mb-8">
                  "{testimonials[current].text}"
                </p>
                <div>
                  <p className="font-display font-semibold text-foreground">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-3 mt-8">
              <button onClick={prev} className="glass-card p-3 rounded-xl hover:border-primary/30 transition-all">
                <ChevronLeft size={18} className="text-foreground" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <button onClick={next} className="glass-card p-3 rounded-xl hover:border-primary/30 transition-all">
                <ChevronRight size={18} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
