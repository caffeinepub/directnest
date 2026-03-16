import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import {
  ArrowUpDown,
  Building2,
  Filter,
  Home,
  Layers,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { mockDisplayProperties } from "../context/AppContext";
import { NIGERIAN_STATES, formatNGN } from "../data/mockData";

type SortOption = "newest" | "price_asc" | "price_desc" | "bedrooms_desc";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  bedrooms_desc: "Most Bedrooms",
};

const TYPE_OPTIONS = [
  { value: "", label: "All Types", icon: Layers },
  { value: "house", label: "House", icon: Home },
  { value: "apartment", label: "Apartment", icon: Building2 },
  { value: "land", label: "Land", icon: MapPin },
];

const BEDROOM_OPTIONS = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

const MIN_PRICE = 0;
const MAX_PRICE = 200_000_000;

interface Filters {
  query: string;
  state: string;
  type: string;
  listing: string;
  bedrooms: string;
  minPrice: number;
  maxPrice: number;
  verifiedOnly: boolean;
  sort: SortOption;
}

const DEFAULT_FILTERS: Filters = {
  query: "",
  state: "",
  type: "",
  listing: "",
  bedrooms: "",
  minPrice: MIN_PRICE,
  maxPrice: MAX_PRICE,
  verifiedOnly: false,
  sort: "newest",
};

function countActive(f: Filters) {
  return (
    [f.query, f.state, f.type, f.listing, f.bedrooms].filter(Boolean).length +
    (f.verifiedOnly ? 1 : 0) +
    (f.minPrice > MIN_PRICE ? 1 : 0) +
    (f.maxPrice < MAX_PRICE ? 1 : 0)
  );
}

function buildActiveFilterTags(
  f: Filters,
): Array<{ label: string; key: keyof Filters }> {
  const tags: Array<{ label: string; key: keyof Filters }> = [];
  if (f.query) tags.push({ label: `"${f.query}"`, key: "query" });
  if (f.state) tags.push({ label: f.state, key: "state" });
  if (f.type)
    tags.push({
      label: f.type.charAt(0).toUpperCase() + f.type.slice(1),
      key: "type",
    });
  if (f.listing)
    tags.push({
      label: f.listing === "sale" ? "For Sale" : "For Rent",
      key: "listing",
    });
  if (f.bedrooms) tags.push({ label: `${f.bedrooms}+ Beds`, key: "bedrooms" });
  if (f.minPrice > MIN_PRICE)
    tags.push({ label: `Min ${formatNGN(f.minPrice)}`, key: "minPrice" });
  if (f.maxPrice < MAX_PRICE)
    tags.push({ label: `Max ${formatNGN(f.maxPrice)}`, key: "maxPrice" });
  if (f.verifiedOnly)
    tags.push({ label: "Verified Only", key: "verifiedOnly" });
  return tags;
}

function FilterPanel({
  filters,
  onChange,
  onClear,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
}) {
  const activeCount = countActive(filters);
  const {
    query,
    state,
    type,
    listing,
    bedrooms,
    minPrice,
    maxPrice,
    verifiedOnly,
  } = filters;

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Search
        </Label>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Title, area, city..."
            value={query}
            onChange={(e) => onChange({ query: e.target.value })}
            className="pl-9 text-sm"
            data-ocid="search.query.input"
          />
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Location
        </Label>
        <Select
          value={state || "all"}
          onValueChange={(v) => onChange({ state: v === "all" ? "" : v })}
        >
          <SelectTrigger className="text-sm" data-ocid="search.state.select">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {NIGERIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Property Type
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = type === opt.value;
            return (
              <button
                key={opt.value || "all"}
                type="button"
                onClick={() => onChange({ type: opt.value })}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
                data-ocid="search.type.select"
              >
                <Icon size={14} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Listing Type */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Listing Type
        </Label>
        <Select
          value={listing || "all"}
          onValueChange={(v) => onChange({ listing: v === "all" ? "" : v })}
        >
          <SelectTrigger className="text-sm" data-ocid="search.listing.select">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
          Price Range
        </Label>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Min Price</p>
              <Input
                type="number"
                placeholder="0"
                value={minPrice > 0 ? minPrice : ""}
                onChange={(e) =>
                  onChange({ minPrice: Number(e.target.value) || 0 })
                }
                className="text-sm"
                data-ocid="search.min_price.input"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatNGN(minPrice)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Max Price</p>
              <Input
                type="number"
                placeholder="No limit"
                value={maxPrice < MAX_PRICE ? maxPrice : ""}
                onChange={(e) =>
                  onChange({ maxPrice: Number(e.target.value) || MAX_PRICE })
                }
                className="text-sm"
                data-ocid="search.max_price.input"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {maxPrice >= MAX_PRICE ? "No limit" : formatNGN(maxPrice)}
              </p>
            </div>
          </div>
          <Slider
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={500_000}
            value={[minPrice, maxPrice]}
            onValueChange={([mn, mx]) =>
              onChange({ minPrice: mn, maxPrice: mx })
            }
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₦0</span>
            <span>₦200M</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bedrooms */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Bedrooms
        </Label>
        <div className="flex gap-2 flex-wrap">
          {BEDROOM_OPTIONS.map((opt) => (
            <button
              key={opt.value || "any"}
              type="button"
              onClick={() => onChange({ bedrooms: opt.value })}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                bedrooms === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              }`}
              data-ocid="search.bedrooms.select"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Verified Only */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="verified-filter"
          checked={verifiedOnly}
          onCheckedChange={(v) => onChange({ verifiedOnly: !!v })}
          data-ocid="search.verified.checkbox"
        />
        <label
          htmlFor="verified-filter"
          className="flex items-center gap-1.5 text-sm cursor-pointer font-medium"
        >
          <ShieldCheck size={14} className="text-primary" />
          Verified listings only
        </label>
      </div>

      {activeCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onClear}
          data-ocid="search.clear_filters.button"
        >
          <X size={14} className="mr-1" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}

export default function SearchPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const patchFilters = (patch: Partial<Filters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const allApproved = useMemo(
    () => mockDisplayProperties.filter((p) => p.status === "approved"),
    [],
  );

  const results = useMemo(() => {
    const {
      query,
      state,
      type,
      listing,
      bedrooms,
      minPrice,
      maxPrice,
      verifiedOnly,
      sort,
    } = filters;

    let r = allApproved.filter((p) => {
      if (
        query &&
        !p.title.toLowerCase().includes(query.toLowerCase()) &&
        !p.location.area.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      if (state && p.location.state !== state) return false;
      if (type && p.type !== type) return false;
      if (listing && p.listingFor !== listing) return false;
      if (bedrooms && p.bedrooms < Number.parseInt(bedrooms)) return false;
      if (p.price < minPrice) return false;
      if (p.price > maxPrice) return false;
      if (verifiedOnly && !p.verified) return false;
      return true;
    });

    switch (sort) {
      case "price_asc":
        r = [...r].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        r = [...r].sort((a, b) => b.price - a.price);
        break;
      case "bedrooms_desc":
        r = [...r].sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      default:
        r = [...r].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return r;
  }, [allApproved, filters]);

  const activeTags = buildActiveFilterTags(filters);
  const activeCount = countActive(filters);

  const handleRemoveTag = (key: keyof Filters) => {
    if (key === "minPrice") patchFilters({ minPrice: MIN_PRICE });
    else if (key === "maxPrice") patchFilters({ maxPrice: MAX_PRICE });
    else if (key === "verifiedOnly") patchFilters({ verifiedOnly: false });
    else patchFilters({ [key]: "" } as Partial<Filters>);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Find Your Property
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Search across verified listings in Nigeria
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="bg-card border border-border rounded-xl p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <SlidersHorizontal size={15} />
                Filters
                {activeCount > 0 && (
                  <Badge variant="default" className="text-xs px-1.5 py-0 h-5">
                    {activeCount}
                  </Badge>
                )}
              </h2>
            </div>
            <FilterPanel
              filters={filters}
              onChange={patchFilters}
              onClear={clearFilters}
            />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden flex items-center gap-2"
                    data-ocid="search.filters.toggle"
                  >
                    <Filter size={14} />
                    Filters
                    {activeCount > 0 && (
                      <Badge
                        variant="default"
                        className="text-xs px-1.5 py-0 h-5 ml-0.5"
                      >
                        {activeCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] overflow-y-auto"
                  data-ocid="search.filters.sheet"
                >
                  <SheetHeader className="mb-5">
                    <SheetTitle className="flex items-center gap-2">
                      <SlidersHorizontal size={16} />
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <FilterPanel
                    filters={filters}
                    onChange={patchFilters}
                    onClear={clearFilters}
                  />
                </SheetContent>
              </Sheet>

              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {results.length}
                </span>{" "}
                {results.length === 1 ? "property" : "properties"} found
              </p>
            </div>

            {/* Sort */}
            <Select
              value={filters.sort}
              onValueChange={(v) => patchFilters({ sort: v as SortOption })}
            >
              <SelectTrigger
                className="w-auto min-w-[170px] text-sm"
                data-ocid="search.sort.select"
              >
                <ArrowUpDown
                  size={13}
                  className="mr-1.5 text-muted-foreground"
                />
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {SORT_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active filter tags */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              {activeTags.map((tag, i) => (
                <Badge
                  key={tag.key}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors pr-1.5"
                  onClick={() => handleRemoveTag(tag.key)}
                  data-ocid={`search.filter_tag.${i + 1}`}
                >
                  {tag.label}
                  <X size={11} />
                </Badge>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
                data-ocid="search.clear_filters.button"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results */}
          {results.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="search.results.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search size={24} className="text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold mb-1">No properties found</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Try adjusting your filters or broadening your search criteria.
              </p>
              {activeCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={clearFilters}
                  data-ocid="search.clear_filters.button"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div
              className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
              data-ocid="search.results.list"
            >
              {results.map((p, i) => (
                <div key={p.id} data-ocid={`search.result.item.${i + 1}`}>
                  <PropertyCard property={p} index={i + 1} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
