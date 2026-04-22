import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Donate", path: "/donate" },
  { label: "Annadanam", path: "/food-donation" },
  { label: "Talent", path: "/talent" },
  { label: "Volunteer", path: "/volunteer" },
  { label: "Events", path: "/events" },
  { label: "Dashboard", path: "/admin" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card mx-4 mt-4 rounded-2xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl glow-button flex items-center justify-center font-display font-bold text-primary-foreground text-sm">
              IS
            </div>
            <span className="font-display font-bold text-lg gradient-text">ImpactSphere</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-xs text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <User size={14} />
                  {user?.name}
                </Link>
                <button
                  onClick={logout}
                  className="glow-button-outline px-4 py-2 rounded-xl text-sm font-medium text-foreground inline-flex items-center gap-1.5"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="glow-button-outline px-4 py-2 rounded-xl text-sm font-medium text-foreground inline-flex items-center gap-1.5"
              >
                <LogIn size={14} />
                Login
              </Link>
            )}
            <Link to="/donate" className="glow-button px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground">
              Donate Now
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground p-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card mx-4 mt-2 rounded-2xl lg:hidden"
          >
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="glow-button-outline px-5 py-3 rounded-xl text-sm font-medium text-foreground text-center mt-2 inline-flex items-center justify-center gap-2"
                >
                  <LogOut size={14} />
                  Logout ({user?.name})
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="glow-button-outline px-5 py-3 rounded-xl text-sm font-medium text-foreground text-center mt-2 inline-flex items-center justify-center gap-2"
                >
                  <LogIn size={14} />
                  Login
                </Link>
              )}

              <Link
                to="/donate"
                onClick={() => setMobileOpen(false)}
                className="glow-button px-5 py-3 rounded-xl text-sm font-semibold text-primary-foreground text-center mt-1"
              >
                Donate Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
