import { Button } from "@/components/ui/button";
import {
  Heart,
  Home,
  Menu,
  MessageCircle,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { isAuthenticated, currentUser, logout } = useApp();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === "admin";

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Home size={16} className="text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-primary hidden sm:block">
            DirectNest
          </span>
        </Link>

        <div className="flex-1 max-w-sm hidden md:block">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search location, property..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate("/search");
              }}
              onClick={() => navigate("/search")}
              data-ocid="nav.search_input"
              readOnly
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/home"
            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2"
            data-ocid="nav.home.link"
          >
            Listings
          </Link>
          <Link
            to="/search"
            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2"
            data-ocid="nav.search.link"
          >
            Search
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/saved"
                className="text-muted-foreground hover:text-foreground p-2"
                data-ocid="nav.saved.link"
              >
                <Heart size={18} />
              </Link>
              <Link
                to="/messages"
                className="text-muted-foreground hover:text-foreground p-2"
                data-ocid="nav.messages.link"
              >
                <MessageCircle size={18} />
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground px-3 py-2"
              data-ocid="nav.admin.link"
            >
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" data-ocid="nav.profile.link">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User size={15} className="text-primary" />
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                data-ocid="nav.logout.button"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => navigate("/auth")}
              data-ocid="nav.login.button"
            >
              Login
            </Button>
          )}
          <Button
            size="sm"
            variant="default"
            onClick={() => navigate("/upload")}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="nav.list_property.button"
          >
            List Property
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          data-ocid="nav.menu.button"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-2">
          <Link
            to="/home"
            className="py-2 text-sm"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.mobile.home.link"
          >
            Listings
          </Link>
          <Link
            to="/search"
            className="py-2 text-sm"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.mobile.search.link"
          >
            Search
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/saved"
                className="py-2 text-sm"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.mobile.saved.link"
              >
                Saved
              </Link>
              <Link
                to="/messages"
                className="py-2 text-sm"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.mobile.messages.link"
              >
                Messages
              </Link>
              <Link
                to="/profile"
                className="py-2 text-sm"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.mobile.profile.link"
              >
                Profile
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="py-2 text-sm"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.mobile.admin.link"
            >
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              data-ocid="nav.mobile.logout.button"
            >
              Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                navigate("/auth");
                setMenuOpen(false);
              }}
              data-ocid="nav.mobile.login.button"
            >
              Login
            </Button>
          )}
          <Button
            size="sm"
            variant="default"
            className="bg-accent text-accent-foreground"
            onClick={() => {
              navigate("/upload");
              setMenuOpen(false);
            }}
            data-ocid="nav.mobile.list_property.button"
          >
            List Property
          </Button>
        </div>
      )}
    </nav>
  );
}
