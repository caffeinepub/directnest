import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PropertyDetailPage() {
  const { id } = useParams({ from: "/property/$id" });
  const { properties } = useApp();
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="app-shell flex flex-col items-center justify-center min-h-dvh gap-4 px-6">
        <MapPin className="w-12 h-12 text-muted-foreground" />
        <p className="font-semibold text-foreground">Property not found</p>
        <Button onClick={() => navigate({ to: "/" })}>Back to Home</Button>
      </div>
    );
  }

  const roleLabel =
    property.ownerRole === "agent" ? "Real Estate Agent" : "Property Owner";
  const roleIcon =
    property.ownerRole === "agent" ? (
      <Building2 className="w-4 h-4" />
    ) : (
      <Home className="w-4 h-4" />
    );

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      <div className="relative">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        <button
          type="button"
          data-ocid="property_detail.back_button"
          onClick={() => navigate({ to: "/" })}
          className="absolute top-12 left-4 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute top-12 right-4">
          <Badge className="bg-primary text-primary-foreground text-xs">
            {roleLabel}
          </Badge>
        </div>
      </div>

      <main className="flex-1 bg-background rounded-t-3xl -mt-4 px-5 pt-6 pb-10">
        <p className="text-2xl font-bold text-primary font-display">
          {formatNaira(property.price)}
        </p>
        <h1 className="text-lg font-bold text-foreground mt-1 leading-snug">
          {property.title}
        </h1>

        <div className="flex items-center gap-1.5 mt-2">
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">{property.location}</p>
        </div>

        <div className="mt-5">
          <h2 className="font-semibold text-foreground text-sm mb-2">
            About this property
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {property.description}
          </p>
        </div>

        <div className="mt-6 bg-secondary rounded-2xl p-4">
          <h2 className="font-semibold text-foreground text-sm mb-3">
            Listed by
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">
                {property.ownerName}
              </p>
              <div className="flex items-center gap-1 text-muted-foreground">
                {roleIcon}
                <span className="text-xs">{roleLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            data-ocid="property_detail.contact_button"
            onClick={() => setContactOpen(true)}
            className="flex-1 gap-2"
          >
            <Phone className="w-4 h-4" />
            Contact Owner
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 border-primary text-primary"
            onClick={() => setContactOpen(true)}
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </Button>
        </div>
      </main>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-[380px] mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Contact {property.ownerName}</DialogTitle>
            <DialogDescription>
              Reach out directly to the {roleLabel.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Phone Number</p>
                <p className="font-semibold text-foreground text-sm">
                  {property.ownerPhone}
                </p>
              </div>
            </div>
            <a href={`tel:${property.ownerPhone}`} className="block">
              <Button className="w-full gap-2">
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
            </a>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setContactOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
