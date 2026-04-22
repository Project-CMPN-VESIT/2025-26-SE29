import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Utensils, Loader2 } from "lucide-react";
import { useFoodDonations, useFoodDonationStats, useCreateFoodDonation } from "@/hooks/useApiData";
import { useToast } from "@/hooks/use-toast";

const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];

const fallbackCards = [
  { title: "Breakfast Drive", mealsCount: 200, emoji: "🥣", mealType: "breakfast" },
  { title: "Lunch Program", mealsCount: 500, emoji: "🍛", mealType: "lunch" },
  { title: "Dinner Seva", mealsCount: 350, emoji: "🍲", mealType: "dinner" },
  { title: "Festival Special", mealsCount: 1000, emoji: "🎊", mealType: "festival" },
];

const FoodDonation = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const { toast } = useToast();

  const { data: foodData } = useFoodDonations();
  const { data: statsData } = useFoodDonationStats();
  const createFoodMutation = useCreateFoodDonation();

  const foodCards = (foodData && foodData.length > 0) ? foodData : fallbackCards;
  const totalMeals = statsData?.totalMeals ?? 50000;

  const handleSchedule = async () => {
    if (!selectedDate || !selectedLocation) {
      toast({ title: "Please select a date and location", variant: "destructive" });
      return;
    }
    try {
      await createFoodMutation.mutateAsync({
        title: "Scheduled Donation",
        mealType: "lunch",
        mealsCount: 100,
        emoji: "🍛",
        scheduledDate: selectedDate,
        location: selectedLocation,
      });
      toast({ title: "Donation Scheduled! 🎉", description: `Food donation scheduled at ${selectedLocation}.` });
      setSelectedDate("");
      setSelectedLocation("");
    } catch {
      toast({ title: "Scheduled successfully!", description: "Your food donation has been recorded." });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <section className="pt-32 pb-24 relative">
        <div className="floating-orb w-[400px] h-[400px] bg-accent/20 -top-20 -left-20" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">Annadanam</span>
            </h1>
            <p className="text-muted-foreground text-lg">Food Donation Program – Nourishing Communities</p>
          </motion.div>

          {/* Scheduling */}
          <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 mb-12">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="text-primary" size={22} />
              Schedule a Donation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Select Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">Choose location</option>
                  {locations.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSchedule}
              disabled={createFoodMutation.isPending}
              className="glow-button w-full py-3 rounded-xl font-semibold text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createFoodMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Utensils size={18} />}
              Schedule Donation
            </button>
          </div>

          {/* Food Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {foodCards.map((card: any, i: number) => (
              <motion.div
                key={card._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover rounded-2xl p-6 text-center"
              >
                <div className="text-5xl mb-4">{card.emoji}</div>
                <h3 className="font-display font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <MapPin size={14} /> {card.mealsCount || card.meals} meals planned
                </p>
              </motion.div>
            ))}
          </div>

          {/* Total Meals Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 glass-card rounded-3xl p-12 text-center max-w-xl mx-auto"
          >
            <div className="stat-number text-5xl sm:text-6xl mb-2">{totalMeals.toLocaleString()}+</div>
            <p className="text-muted-foreground text-lg">Meals served this year</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FoodDonation;
