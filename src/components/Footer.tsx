import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl glow-button flex items-center justify-center font-display font-bold text-primary-foreground text-sm">IS</div>
              <span className="font-display font-bold text-lg gradient-text">ImpactSphere</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering NGOs with digital transparency, trust, and community engagement.
            </p>
          </div>

          {[
            { title: "Platform", links: [{ label: "Donate", to: "/donate" }, { label: "Volunteer", to: "/volunteer" }, { label: "Events", to: "/events" }, { label: "Talent", to: "/talent" }] },
            { title: "Programs", links: [{ label: "Annadanam", to: "/food-donation" }, { label: "Child Support", to: "/child-dashboard" }, { label: "Dashboard", to: "/admin" }] },
            { title: "Connect", links: [{ label: "Twitter", to: "#" }, { label: "LinkedIn", to: "#" }, { label: "Instagram", to: "#" }, { label: "contact@impactsphere.org", to: "#" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          © 2026 ImpactSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
