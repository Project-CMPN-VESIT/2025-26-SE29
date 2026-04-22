import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Mail, Phone, CheckCircle, Clock, Briefcase, Loader2 } from "lucide-react";
import { useVolunteerTasks, useRegisterVolunteer } from "@/hooks/useApiData";
import { useToast } from "@/hooks/use-toast";

const fallbackTasks = [
  { title: "Food Distribution Drive", status: "active", date: "Mar 28, 2026", location: "Mumbai" },
  { title: "Education Workshop", status: "completed", date: "Mar 15, 2026", location: "Delhi" },
  { title: "Health Camp Coordination", status: "active", date: "Apr 5, 2026", location: "Bangalore" },
  { title: "Event Photography", status: "completed", date: "Feb 20, 2026", location: "Chennai" },
];

const Volunteer = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", skills: "" });
  const { toast } = useToast();

  const { data: tasksData } = useVolunteerTasks();
  const registerMutation = useRegisterVolunteer();

  const tasks = tasksData ?? fallbackTasks;

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    try {
      await registerMutation.mutateAsync(formData);
      toast({ title: "Registration Successful! 🎉", description: "Welcome to the ImpactSphere volunteer family." });
      setFormData({ name: "", email: "", phone: "", skills: "" });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <section className="pt-32 pb-24 relative">
        <div className="floating-orb w-[400px] h-[400px] bg-primary/20 -top-20 -left-20" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Become a <span className="gradient-text">Volunteer</span>
            </h1>
            <p className="text-muted-foreground text-lg">Make a difference with your time and skills</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-3xl p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">Registration</h3>
              <div className="space-y-4">
                {[
                  { key: "name", label: "Full Name", icon: User, type: "text", placeholder: "Your name" },
                  { key: "email", label: "Email", icon: Mail, type: "email", placeholder: "your@email.com" },
                  { key: "phone", label: "Phone", icon: Phone, type: "tel", placeholder: "+91 XXXXX XXXXX" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-sm text-muted-foreground mb-1.5 block">{field.label}</label>
                    <div className="relative">
                      <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Skills</label>
                  <textarea
                    placeholder="Tell us about your skills..."
                    rows={3}
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={registerMutation.isPending}
                  className="glow-button w-full py-3 rounded-xl font-semibold text-primary-foreground inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {registerMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : null}
                  Register Now
                </button>
              </div>
            </motion.div>

            {/* Tasks */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">Task Board</h3>
              <div className="space-y-4">
                {tasks.map((task: any, i: number) => (
                  <motion.div
                    key={task._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card-hover rounded-2xl p-5 flex items-start gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      task.status === "active" ? "bg-primary/10" : "bg-accent/10"
                    }`}>
                      {task.status === "active" ? <Clock className="text-primary" size={18} /> : <CheckCircle className="text-accent" size={18} />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(task.date)} · {task.location}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      task.status === "active" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    }`}>
                      {task.status === "active" ? "Active" : "Done"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Volunteer;
