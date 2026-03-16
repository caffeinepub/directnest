import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  MessageCircle,
  Search,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { mockDisplayProperties } from "../context/AppContext";
import { NIGERIAN_STATES } from "../data/mockData";

export default function LandingPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const featured = mockDisplayProperties
    .filter((p) => p.status === "approved")
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582407947304-fd86f28f8c49?w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <Shield size={14} /> AI-Powered Nigerian Property Marketplace
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Find Your Perfect
            <br />
            <span className="text-accent">Home in Nigeria</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Verified listings, transparent pricing, and AI-powered search — all
            in one trusted platform.
          </p>

          {/* Search box */}
          <div className="bg-white rounded-2xl p-3 shadow-xl max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <Select onValueChange={setLocation}>
                <SelectTrigger
                  className="flex-1 border-0 bg-muted/50"
                  data-ocid="hero.location.select"
                >
                  <SelectValue placeholder="Select location..." />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setType}>
                <SelectTrigger
                  className="flex-1 border-0 bg-muted/50"
                  data-ocid="hero.type.select"
                >
                  <SelectValue placeholder="Property type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="bg-primary text-primary-foreground px-6"
                onClick={() =>
                  navigate(`/search?location=${location}&type=${type}`)
                }
                data-ocid="hero.search.button"
              >
                <Search size={16} className="mr-2" /> Search
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm">
            {[
              ["2,400+", "Active Listings"],
              ["850+", "Verified Agents"],
              ["36", "States Covered"],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-bold text-2xl text-accent">{num}</div>
                <div className="text-primary-foreground/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-center mb-2">
          Why Choose DirectNest
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Built for transparency and trust in Nigerian real estate
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: "Verified Listings",
              desc: "Every property and agent is vetted and verified by our team.",
            },
            {
              icon: TrendingUp,
              title: "Price Intelligence",
              desc: "Know if a price is fair with real market data comparisons.",
            },
            {
              icon: Search,
              title: "AI Smart Search",
              desc: "Find exactly what you need with intelligent filters.",
            },
            {
              icon: MessageCircle,
              title: "Direct Messaging",
              desc: "Talk directly with owners and agents, no middlemen.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold">
                Featured Properties
              </h2>
              <p className="text-muted-foreground mt-1">
                Handpicked listings across Nigeria
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/home")}
              data-ocid="landing.view_all.button"
            >
              View all <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Star size={32} className="text-accent mx-auto mb-4" />
        <h2 className="font-display text-3xl font-bold mb-4">
          Own a Property? List it Today
        </h2>
        <p className="text-muted-foreground mb-8">
          Reach thousands of verified buyers and renters across Nigeria. Free to
          list.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            onClick={() => navigate("/upload")}
            data-ocid="landing.list_property.button"
          >
            List Your Property
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/auth")}
            data-ocid="landing.signup.button"
          >
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );
}
