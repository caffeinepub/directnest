import { Heart, Home, MessageCircle, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function MobileNav() {
  const { pathname } = useLocation();
  const links = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/saved", icon: Heart, label: "Saved" },
    { to: "/messages", icon: MessageCircle, label: "Chat" },
    { to: "/profile", icon: User, label: "Profile" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border md:hidden">
      <div className="flex">
        {links.map(({ to, icon: Icon, label }, _i) => (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${
              pathname === to ? "text-primary" : "text-muted-foreground"
            }`}
            data-ocid={`mobile_nav.${label.toLowerCase()}.link`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
