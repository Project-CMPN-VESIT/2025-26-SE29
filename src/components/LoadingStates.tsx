import { motion } from "framer-motion";

export const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`glass-card rounded-2xl p-6 animate-pulse ${className}`}>
    <div className="h-4 bg-muted/60 rounded-lg w-3/4 mb-4" />
    <div className="h-3 bg-muted/40 rounded-lg w-1/2 mb-3" />
    <div className="h-3 bg-muted/40 rounded-lg w-2/3" />
  </div>
);

export const SkeletonStatCard = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse">
    <div className="h-6 w-6 bg-muted/60 rounded-lg mb-4" />
    <div className="h-8 bg-muted/60 rounded-lg w-1/2 mb-2" />
    <div className="h-3 bg-muted/40 rounded-lg w-3/4" />
  </div>
);

export const SkeletonGrid = ({ count = 4, cols = "grid-cols-1 sm:grid-cols-2" }: { count?: number; cols?: string }) => (
  <div className={`grid ${cols} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const ErrorBanner = ({
  message = "Failed to load data",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-2xl p-6 border-red-500/20 bg-red-500/5 text-center mb-8"
  >
    <p className="text-red-400 text-sm mb-3">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-xs text-primary hover:text-primary/80 font-medium transition-colors px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/15"
      >
        Try Again
      </button>
    )}
  </motion.div>
);

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);
