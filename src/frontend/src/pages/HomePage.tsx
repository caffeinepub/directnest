import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, LogOut, MapPin, Plus, Search, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function HomePage() {
  const { user, logout, properties } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function handleLogout() {
    logout();
    navigate({ to: "/auth" });
    toast.success("Logged out");
  }

  const filtered = properties.filter(
    (p) =>
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const canAddProperty = user?.role === "owner" || user?.role === "agent";

  return (
    <div className="app-shell flex flex-col min-h-dvh pb-20">
      <header className="bg-primary px-5 pt-12 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-foreground rounded-md flex items-center justify-center">
              <Home className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display text-xl font-bold text-primary-foreground">
              DirectNest
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-lg bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <p className="text-primary-foreground/80 text-sm mb-3">
          Hello,{" "}
          <span className="font-semibold text-primary-foreground">
            {user?.fullName?.split(" ")[0]}
          </span>{" "}
          👋
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="home.search_input"
            type="text"
            placeholder="Search by location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-0 shadow-sm"
          />
        </div>
      </header>

      <main className="flex-1 px-4 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground text-base">
            {search ? `Results for "${search}"` : "Available Properties"}
          </h2>
          <span className="text-xs text-muted-foreground">
            {filtered.length} found
          </span>
        </div>

        {filtered.length === 0 ? (
          <div data-ocid="home.empty_state" className="text-center py-16">
            <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground">No properties found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different location
            </p>
          </div>
        ) : (
          <div
            data-ocid="home.property_list"
            className="grid grid-cols-2 gap-3"
          >
            {filtered.map((property, index) => (
              <Link
                key={property.id}
                to="/property/$id"
                params={{ id: property.id }}
                data-ocid={`home.property_card.${index + 1}`}
                className="block"
              >
                <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="text-[10px] px-1.5 py-0.5 bg-primary text-primary-foreground">
                        {property.ownerRole === "agent" ? "Agent" : "Owner"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="font-semibold text-xs text-foreground leading-tight line-clamp-2">
                      {property.title}
                    </p>
                    <p className="text-primary font-bold text-xs mt-1">
                      {formatNaira(property.price)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <p className="text-[10px] text-muted-foreground truncate">
                        {property.location}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {canAddProperty && (
        <Button
          data-ocid="home.add_button"
          onClick={() => navigate({ to: "/add-property" })}
          className="fixed bottom-24 w-12 h-12 rounded-full shadow-lg p-0 z-40"
          style={{
            right: "max(16px, calc(50% - 215px + 16px))",
          }}
        >
          <Plus className="w-5 h-5" />
        </Button>
      )}

      <nav className="bottom-nav bg-card border-t border-border flex">
        <button
          type="button"
          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-primary"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button
          type="button"
          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-muted-foreground"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Search</span>
        </button>
        {canAddProperty && (
          <button
            type="button"
            onClick={() => navigate({ to: "/add-property" })}
            className="flex-1 flex flex-col items-center gap-0.5 py-3 text-muted-foreground"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-medium">List</span>
          </button>
        )}
        <button
          type="button"
          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-muted-foreground"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">
            {user?.role === "agent" ? "Agent" : "Profile"}
          </span>
        </button>
      </nav>
    </div>
  );
}
