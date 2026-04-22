import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, Star, Loader2, CheckCircle, X } from "lucide-react";
import { useTalents } from "@/hooks/useApiData";
import { useToast } from "@/hooks/use-toast";

const fallbackTalents = [
  { name: "Aarav Singh", skill: "Classical Dance", rating: 4.8 },
  { name: "Meera Patel", skill: "Painting", rating: 4.9 },
  { name: "Ravi Kumar", skill: "Singing", rating: 4.7 },
  { name: "Sita Devi", skill: "Pottery", rating: 4.6 },
  { name: "Vikram Rao", skill: "Photography", rating: 4.8 },
  { name: "Lakshmi N.", skill: "Embroidery", rating: 4.9 },
];

const TalentShowcase = () => {
  const { data: talentsData, refetch } = useTalents();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: "", skill: "", rating: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const talents = (talentsData && talentsData.length > 0) ? talentsData : fallbackTalents;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!uploadForm.name || !uploadForm.skill) {
      toast({ title: "Name and skill are required", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("name", uploadForm.name);
      formData.append("skill", uploadForm.skill);
      formData.append("rating", uploadForm.rating || "0");
      if (selectedFile) {
        formData.append("media", selectedFile);
      }

      const token = localStorage.getItem("impactsphere_token");
      const res = await fetch("/api/talents", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(err.message);
      }

      setUploadSuccess(true);
      setUploadForm({ name: "", skill: "", rating: "" });
      setSelectedFile(null);
      refetch();
      toast({ title: "Talent uploaded! 🎉" });

      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
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
              <span className="gradient-text">Talent Showcase</span>
            </h1>
            <p className="text-muted-foreground text-lg">Discover and celebrate hidden talents</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {talents.map((t: any, i: number) => (
              <motion.div
                key={t._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card-hover rounded-2xl p-6 group"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  {t.mediaUrl ? (
                    <img src={t.mediaUrl} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-2xl font-bold gradient-text">{t.name[0]}</span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-display font-semibold text-foreground">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{t.skill}</p>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Star className="text-star fill-star" size={14} />
                    <span className="text-foreground font-medium">{t.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto glass-card rounded-3xl p-8"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">Upload Your Talent</h3>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Name *</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Skill *</label>
                  <input
                    type="text"
                    placeholder="e.g. Painting"
                    value={uploadForm.skill}
                    onChange={(e) => setUploadForm({ ...uploadForm, skill: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Rating (0-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.5"
                  value={uploadForm.rating}
                  onChange={(e) => setUploadForm({ ...uploadForm, rating: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm"
                />
              </div>
            </div>

            {/* File Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer mb-6 ${
                selectedFile ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {uploadSuccess ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="text-accent" size={40} />
                  <p className="text-accent font-medium">Uploaded successfully!</p>
                </div>
              ) : selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <p className="text-foreground text-sm">{selectedFile.name}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-muted-foreground mb-4" size={40} />
                  <p className="text-muted-foreground mb-1">Drag & drop your files here</p>
                  <p className="text-xs text-muted-foreground/60">Images, videos, or audio files (optional)</p>
                </>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !uploadForm.name || !uploadForm.skill}
              className="glow-button w-full py-3 rounded-xl font-semibold text-primary-foreground inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              Submit Talent
            </button>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TalentShowcase;
