import { motion } from "framer-motion";
import { useDashboardStats } from "@/hooks/useApiData";

const fallbackStats = [
  { value: "₹2.5Cr+", label: "Donations Raised" },
  { value: "50,000+", label: "Meals Served" },
  { value: "1,200+", label: "Volunteers Joined" },
  { value: "3,000+", label: "Children Supported" },
];

const formatValue = (num: number, suffix = "+") => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr${suffix}`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L${suffix}`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K${suffix}`;
  return `${num.toLocaleString()}${suffix}`;
};

const ImpactStats = () => {
  const { data: dashData } = useDashboardStats();

  const stats = dashData
    ? [
        { value: formatValue(dashData.totalDonations), label: "Donations Raised" },
        { value: `${(dashData.totalMeals || 50000).toLocaleString()}+`, label: "Meals Served" },
        { value: `${(dashData.activeVolunteers || 1200).toLocaleString()}+`, label: "Volunteers Joined" },
        { value: `${(dashData.totalUsers || 3000).toLocaleString()}+`, label: "Members Joined" },
      ]
    : fallbackStats;

  return (
    <section className="py-24 relative">
      <div className="floating-orb w-[400px] h-[400px] bg-accent/20 top-0 right-0" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-muted-foreground text-lg">Numbers that tell our story</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="glass-card rounded-2xl p-8 text-center group hover:border-primary/30 transition-all duration-500"
            >
              <div className="stat-number text-3xl sm:text-4xl lg:text-5xl mb-2">{stat.value}</div>
              <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
