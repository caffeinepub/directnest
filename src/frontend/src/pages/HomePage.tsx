import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { mockDisplayProperties } from "../context/AppContext";
import { NIGERIAN_STATES, formatNGN } from "../data/mockData";
import { useGetProperties } from "../hooks/usePropertyMethods";
import type { DisplayProperty } from "../types/property";

const AMENITIES = [
  "Swimming Pool",
  "Generator",
  "Security",
  "Gym",
  "Parking",
  "Borehole",
  "Internet",
];

function PropertySkeletons() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((k) => (
        <div
          key={k}
          className="rounded-xl overflow-hidden border border-border"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [listingFilter, setListingFilter] = useState("");
  const [bedroomsFilter, setBedroomsFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200000000]);
  const [amenityFilter, setAmenityFilter] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const { data: backendProperties, isLoading } = useGetProperties();

  // Merge: backend properties first, then mock (deduplicated by id)
  const allProperties = useMemo<DisplayProperty[]>(() => {
    const backend = backendProperties ?? [];
    const backendIds = new Set(backend.map((p) => p.id));
    const mock = mockDisplayProperties.filter((p) => !backendIds.has(p.id));
    return [...backend, ...mock];
  }, [backendProperties]);

  const toggleAmenity = (a: string) =>
    setAmenityFilter((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  const filtered = allProperties.filter((p) => {
    if (p.status !== "approved" && p.status !== "pending") return false;
    if (stateFilter && p.location.state !== stateFilter) return false;
    if (typeFilter && p.type !== typeFilter) return false;
    if (listingFilter && p.listingFor !== listingFilter) return false;
    if (bedroomsFilter && p.bedrooms < Number.parseInt(bedroomsFilter))
      return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (verifiedOnly && !p.verified) return false;
    if (
      amenityFilter.length &&
      !amenityFilter.every((a) => p.amenities.includes(a))
    )
      return false;
    return true;
  });

  const FiltersPanel = () => (
    <div className="bg-card border border-border rounded-xl p-5 space-y-6">
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
          Location
        </Label>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger data-ocid="filters.state.select">
            <SelectValue placeholder="All states" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All states</SelectItem>
            {NIGERIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
          Property Type
        </Label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger data-ocid="filters.type.select">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
          For
        </Label>
        <Select value={listingFilter} onValueChange={setListingFilter}>
          <SelectTrigger data-ocid="filters.listing.select">
            <SelectValue placeholder="Sale or Rent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
          Min Bedrooms
        </Label>
        <Select value={bedroomsFilter} onValueChange={setBedroomsFilter}>
          <SelectTrigger data-ocid="filters.bedrooms.select">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
          Price: up to {formatNGN(priceRange[1])}
        </Label>
        <Slider
          min={0}
          max={200000000}
          step={1000000}
          value={[priceRange[1]]}
          onValueChange={([v]) => setPriceRange([0, v])}
          data-ocid="filters.price.slider"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
          Amenities
        </Label>
        <div className="space-y-2">
          {AMENITIES.map((a) => (
            <div key={a} className="flex items-center gap-2">
              <Checkbox
                id={`am-${a}`}
                checked={amenityFilter.includes(a)}
                onCheckedChange={() => toggleAmenity(a)}
                data-ocid={"filters.amenity.checkbox"}
              />
              <label htmlFor={`am-${a}`} className="text-sm cursor-pointer">
                {a}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="verified"
          checked={verifiedOnly}
          onCheckedChange={(v) => setVerifiedOnly(!!v)}
          data-ocid="filters.verified.checkbox"
        />
        <label htmlFor="verified" className="text-sm cursor-pointer">
          Verified only
        </label>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => {
          setStateFilter("");
          setTypeFilter("");
          setListingFilter("");
          setBedroomsFilter("");
          setPriceRange([0, 200000000]);
          setAmenityFilter([]);
          setVerifiedOnly(false);
        }}
        data-ocid="filters.clear.button"
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isLoading
              ? "Loading properties..."
              : `${filtered.length} properties found`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={() => setFiltersOpen(!filtersOpen)}
          data-ocid="home.filter_toggle.button"
        >
          <SlidersHorizontal size={15} className="mr-2" /> Filters
        </Button>
      </div>

      {filtersOpen && (
        <div className="mb-6 md:hidden">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Filters</span>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              data-ocid="home.close_filters.button"
            >
              <X size={18} />
            </button>
          </div>
          <FiltersPanel />
        </div>
      )}

      <div className="flex gap-6">
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <FiltersPanel />
        </aside>
        <div className="flex-1">
          {isLoading ? (
            <div data-ocid="home.listings.loading_state">
              <PropertySkeletons />
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="home.listings.empty_state"
            >
              <p className="text-lg font-medium">
                No properties match your filters
              </p>
              <p className="text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
