import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { useApp } from "../context/AppContext";
import { mockDisplayProperties } from "../context/AppContext";

export default function SavedPropertiesPage() {
  const { savedProperties } = useApp();
  const navigate = useNavigate();
  const saved = mockDisplayProperties.filter((p) =>
    savedProperties.includes(p.id),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-2">Saved Properties</h1>
      <p className="text-muted-foreground mb-8">
        {saved.length} saved listing{saved.length !== 1 ? "s" : ""}
      </p>
      {saved.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="saved.empty_state"
        >
          <p className="text-lg font-medium">No saved properties</p>
          <p className="text-sm mt-1">
            Browse listings and tap the heart icon to save properties
          </p>
          <Button
            className="mt-6"
            onClick={() => navigate("/home")}
            data-ocid="saved.browse.button"
          >
            Browse Listings
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {saved.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
