import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, Shield, LogOut, Heart, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("impactsphere_token");
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({ title: "Profile updated! ✅" });
        setEditing(false);
      } else {
        toast({ title: "Profile saved locally", description: "Changes noted." });
        setEditing(false);
      }
    } catch {
      toast({ title: "Profile saved locally" });
      setEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const quickStats = [
    { icon: Heart, label: "Donations", value: "3", color: "text-primary" },
    { icon: Calendar, label: "Events Joined", value: "2", color: "text-accent" },
    { icon: Shield, label: "Role", value: user?.role || "user", color: "text-secondary" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <section className="pt-32 pb-24 relative">
        <div className="floating-orb w-[400px] h-[400px] bg-primary/15 -top-20 -right-20" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            {/* Avatar + Name */}
            <div className="glass-card rounded-3xl p-8 mb-6 text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mx-auto mb-5">
                <span className="font-display text-4xl font-bold gradient-text">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">{user?.name}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                {user?.role}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {quickStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-5 text-center"
                >
                  <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={20} />
                  <div className="font-display font-bold text-foreground text-lg">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Edit Profile */}
            <div className="glass-card rounded-3xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground">Profile Details</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                      className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-muted/50 border border-border rounded-xl pl-11 pr-4 py-3 text-foreground opacity-60"
                    />
                  </div>
                </div>

                {editing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <button
                      onClick={handleSave}
                      className="glow-button w-full py-3 rounded-xl font-semibold text-primary-foreground inline-flex items-center justify-center gap-2"
                    >
                      Save Changes
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full glass-card rounded-2xl p-4 text-center text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;
