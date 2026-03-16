import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Heart, MapPin, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { formatNGN } from "../data/mockData";
import { useBlobUrl } from "../hooks/usePropertyMethods";
import type { DisplayProperty } from "../types/property";
import VerifiedBadge from "./VerifiedBadge";

interface Props {
  property: DisplayProperty;
  index?: number;
}

function PropertyImage({ property }: { property: DisplayProperty }) {
  const firstKey = property.imageKeys[0];
  const { data: blobUrl } = useBlobUrl(firstKey);
  const src = property.photos[0] || blobUrl || "";

  if (!src) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <MapPin size={24} className="text-muted-foreground" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={property.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  );
}

export default function PropertyCard({ property, index = 1 }: Props) {
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useApp();
  const saved = isSaved(property.id);

  return (
    <article
      onClick={() => navigate(`/property/${property.id}`)}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/property/${property.id}`)
      }
      className="bg-card rounded-xl overflow-hidden border border-border shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
      data-ocid={`property.card.${index}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <PropertyImage property={property} />
        <button
          type="button"
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-colors ${
            saved ? "text-red-500" : "text-muted-foreground"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSaved(property.id);
          }}
          data-ocid={`property.save_button.${index}`}
        >
          <Heart size={16} fill={saved ? "currentColor" : "none"} />
        </button>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge
            variant={property.listingFor === "sale" ? "default" : "secondary"}
            className="text-xs"
          >
            For {property.listingFor === "sale" ? "Sale" : "Rent"}
          </Badge>
        </div>
        {property.verified && (
          <div className="absolute bottom-2 left-2">
            <VerifiedBadge size="sm" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">
            {property.title}
          </h3>
        </div>
        <p className="text-primary font-bold text-lg mb-2">
          {formatNGN(property.price)}
          {property.listingFor === "rent" ? "/yr" : ""}
        </p>
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
          <MapPin size={11} />
          <span>
            {property.location.area}, {property.location.state}
          </span>
        </div>
        {property.type !== "land" && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed size={11} />
              {property.bedrooms} Beds
            </span>
            <span className="flex items-center gap-1">
              <Bath size={11} />
              {property.bathrooms} Baths
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 size={11} />
              {property.sizeSqm} sqm
            </span>
          </div>
        )}
        {property.type === "land" && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Maximize2 size={11} />
              {property.sizeSqm} sqm
            </span>
            <Badge variant="outline" className="text-xs capitalize">
              {property.type}
            </Badge>
          </div>
        )}
      </div>
    </article>
  );
}
