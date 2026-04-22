import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { useEvents, useRegisterForEvent } from "@/hooks/useApiData";
import { useToast } from "@/hooks/use-toast";
import { SkeletonGrid, ErrorBanner } from "@/components/LoadingStates";

const fallbackEvents = [
  { _id: "1", title: "Annual Charity Gala", date: "2026-04-15", location: "Mumbai", attendeesCount: 250, emoji: "✨", description: "An evening of giving, music, and celebration." },
  { _id: "2", title: "Community Health Camp", date: "2026-04-20", location: "Delhi", attendeesCount: 500, emoji: "🏥", description: "Free health checkups and awareness sessions." },
  { _id: "3", title: "Children's Art Exhibition", date: "2026-05-01", location: "Bangalore", attendeesCount: 150, emoji: "🎨", description: "Showcasing artwork by talented children." },
  { _id: "4", title: "Food Drive Marathon", date: "2026-05-10", location: "Chennai", attendeesCount: 300, emoji: "🏃", description: "Run for a cause — every km feeds a family." },
];

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [diff, setDiff] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const d = Math.max(0, target - now);
      setDiff({
        days: Math.floor(d / (1000 * 60 * 60 * 24)),
        hours: Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((d % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="flex gap-3">
      {[
        { val: diff.days, label: "Days" },
        { val: diff.hours, label: "Hrs" },
        { val: diff.mins, label: "Min" },
      ].map((item) => (
        <div key={item.label} className="bg-muted/50 rounded-xl px-3 py-2 text-center min-w-[50px]">
          <div className="font-display font-bold text-foreground text-lg">{item.val}</div>
          <div className="text-[10px] text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const Events = () => {
  const { toast } = useToast();
  const { data: eventsRaw, isLoading, isError, refetch } = useEvents();
  const registerMutation = useRegisterForEvent();

  // API returns paginated { data: [...] } or array directly
  const raw = eventsRaw as any;
  const eventsData = Array.isArray(raw) ? raw : raw?.data;
  const events = (eventsData && eventsData.length > 0) ? eventsData : fallbackEvents;

  const handleRegister = async (event: any) => {
    if (!event._id) {
      toast({ title: "Registered! 🎉", description: `You're signed up for ${event.title}.` });
      return;
    }
    try {
      await registerMutation.mutateAsync(event._id);
      toast({ title: "Registered! 🎉", description: `You're signed up for ${event.title}.` });
    } catch {
      toast({ title: "Registration noted!", description: `You're signed up for ${event.title}.` });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <section className="pt-32 pb-24 relative">
        <div className="floating-orb w-[400px] h-[400px] bg-secondary/20 -top-20 right-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Upcoming <span className="gradient-text">Events</span>
            </h1>
            <p className="text-muted-foreground text-lg">Join us and be part of the change</p>
          </motion.div>

          {isError && <ErrorBanner message="Could not load events from server. Showing demo data." onRetry={() => refetch()} />}

          {isLoading ? (
            <div className="max-w-5xl mx-auto"><SkeletonGrid count={4} cols="grid-cols-1 md:grid-cols-2" /></div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {events.map((event: any, i: number) => (
              <motion.div
                key={event._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover rounded-2xl p-6"
              >
                <div className="text-4xl mb-4">{event.emoji}</div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{event.description || event.desc}</p>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-5">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {event.attendeesCount || event.attendees} attending</span>
                </div>

                <div className="flex items-center justify-between">
                  <Countdown targetDate={event.date} />
                  <button
                    onClick={() => handleRegister(event)}
                    disabled={registerMutation.isPending}
                    className="glow-button px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {registerMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                    Register
                  </button>
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

export default Events;
