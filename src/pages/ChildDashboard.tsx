import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Heart, TrendingUp } from "lucide-react";
import { useChildren, useChildrenStats } from "@/hooks/useApiData";
import { SkeletonGrid, ErrorBanner } from "@/components/LoadingStates";

const fallbackChildren = [
  { name: "Ananya", age: 8, educationProgress: 75, healthProgress: 90 },
  { name: "Rohan", age: 10, educationProgress: 60, healthProgress: 85 },
  { name: "Priya", age: 7, educationProgress: 85, healthProgress: 95 },
  { name: "Arjun", age: 9, educationProgress: 70, healthProgress: 80 },
];

const ProgressBar = ({ value, color }: { value: number; color: string }) => (
  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
    <motion.div
      className={`h-full rounded-full ${color}`}
      initial={{ width: 0 }}
      whileInView={{ width: `${value}%` }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    />
  </div>
);

const ChildDashboard = () => {
  const { data: childrenData, isLoading, isError, refetch } = useChildren();
  const { data: statsData } = useChildrenStats();

  const children = (childrenData && childrenData.length > 0) ? childrenData : fallbackChildren;

  const avgEducation = statsData?.avgEducation ?? 72.5;
  const avgHealth = statsData?.avgHealth ?? 87.5;

  return (
    <div className="min-h-screen">
      <Header />
      <section className="pt-32 pb-24 relative">
        <div className="floating-orb w-[400px] h-[400px] bg-accent/20 -top-20 -left-20" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Child <span className="gradient-text">Development</span>
            </h1>
            <p className="text-muted-foreground text-lg">Tracking progress for every child we support</p>
          </motion.div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            {[
              { icon: BookOpen, label: "Avg Education", value: `${avgEducation.toFixed(1)}%`, color: "text-primary" },
              { icon: Heart, label: "Avg Health", value: `${avgHealth.toFixed(1)}%`, color: "text-accent" },
              { icon: TrendingUp, label: "Growth Rate", value: "+12%", color: "text-secondary" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
                <div className="stat-number text-2xl mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {isError && <ErrorBanner message="Could not load children data. Showing demo data." onRetry={() => refetch()} />}

          {/* Child Cards */}
          {isLoading ? (
            <SkeletonGrid count={4} cols="grid-cols-1 sm:grid-cols-2" />
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {children.map((child: any, i: number) => (
              <motion.div
                key={child._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover rounded-2xl p-6"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="font-display text-xl font-bold gradient-text">{child.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{child.name}</h3>
                    <p className="text-xs text-muted-foreground">Age {child.age}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Education</span>
                      <span className="text-foreground font-medium">{child.educationProgress ?? child.education}%</span>
                    </div>
                    <ProgressBar value={child.educationProgress ?? child.education} color="bg-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Health</span>
                      <span className="text-foreground font-medium">{child.healthProgress ?? child.health}%</span>
                    </div>
                    <ProgressBar value={child.healthProgress ?? child.health} color="bg-accent" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ChildDashboard;
