import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Heart, Users, Calendar, TrendingUp,
  DollarSign, UserCheck, Activity,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useDashboardStats, useRecentActivity } from "@/hooks/useApiData";
import { SkeletonGrid, SkeletonStatCard, ErrorBanner } from "@/components/LoadingStates";
import { useAuth } from "@/contexts/AuthContext";

const fallbackMonthly = [
  { month: "Jan", donations: 120000, volunteers: 45 },
  { month: "Feb", donations: 180000, volunteers: 62 },
  { month: "Mar", donations: 150000, volunteers: 58 },
  { month: "Apr", donations: 220000, volunteers: 75 },
  { month: "May", donations: 280000, volunteers: 90 },
  { month: "Jun", donations: 310000, volunteers: 102 },
];

const fallbackActivity = [
  { action: "Donation received", detail: "₹5,000 from Priya S.", time: "2 min ago" },
  { action: "Volunteer joined", detail: "Rahul V. registered", time: "15 min ago" },
  { action: "Event created", detail: "Health Camp – Delhi", time: "1 hr ago" },
  { action: "Food drive", detail: "200 meals distributed", time: "3 hrs ago" },
  { action: "Child update", detail: "Ananya's progress updated", time: "5 hrs ago" },
];

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: Heart, label: "Donations", path: "/donate" },
  { icon: Users, label: "Volunteers", path: "/volunteer" },
  { icon: Calendar, label: "Events", path: "/events" },
];

const formatAmount = (val: number) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
};

const AdminDashboard = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: dashData, isLoading, isError, refetch } = useDashboardStats();
  const { data: activityData } = useRecentActivity();

  const monthlyData = dashData?.monthlyData ?? fallbackMonthly;
  const recentActivity = (activityData && activityData.length > 0) ? activityData : fallbackActivity;

  const statCards = [
    {
      icon: DollarSign,
      label: "Total Donations",
      value: dashData ? formatAmount(dashData.totalDonations) : "₹25.3L",
      change: "+12%",
      color: "text-primary",
    },
    {
      icon: Users,
      label: "Total Users",
      value: dashData ? dashData.totalUsers.toLocaleString() : "4,280",
      change: "+8%",
      color: "text-secondary",
    },
    {
      icon: UserCheck,
      label: "Active Volunteers",
      value: dashData ? dashData.activeVolunteers.toLocaleString() : "342",
      change: "+15%",
      color: "text-accent",
    },
    {
      icon: Activity,
      label: "Events This Month",
      value: dashData ? String(dashData.eventsThisMonth) : "12",
      change: "+3",
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col glass-card border-r border-border/50 p-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl glow-button flex items-center justify-center font-display font-bold text-primary-foreground text-sm">IS</div>
          <span className="font-display font-bold gradient-text">ImpactSphere</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-8">Welcome back, {user?.name || "Admin"}</p>

          {isError && <ErrorBanner message="Could not load dashboard data. Showing demo values." onRetry={() => refetch()} />}

          {/* Stat Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={stat.color} size={22} />
                  <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded-lg">{stat.change}</span>
                </div>
                <div className="stat-number text-2xl mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Donations Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(220,15%,18%,0.5)" />
                  <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220,20%,10%)", border: "1px solid hsl(220,15%,18%)", borderRadius: "12px", color: "hsl(210,40%,96%)" }}
                  />
                  <Bar dataKey="donations" fill="hsl(200,90%,55%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Volunteer Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(220,15%,18%,0.5)" />
                  <XAxis dataKey="month" stroke="hsl(215,20%,55%)" fontSize={12} />
                  <YAxis stroke="hsl(215,20%,55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220,20%,10%)", border: "1px solid hsl(220,15%,18%)", borderRadius: "12px", color: "hsl(210,40%,96%)" }}
                  />
                  <Line type="monotone" dataKey="volunteers" stroke="hsl(170,70%,45%)" strokeWidth={2} dot={{ fill: "hsl(170,70%,45%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm text-foreground font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
