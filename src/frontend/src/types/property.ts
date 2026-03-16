// Unified display type for properties (supports both mock and backend data)
export interface DisplayProperty {
  id: string;
  title: string;
  type: string; // "house" | "apartment" | "land"
  listingFor: string; // "sale" | "rent"
  price: number;
  location: { state: string; city: string; area: string };
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  amenities: string[];
  // Images: either direct URLs (mock) or blob keys (backend)
  photos: string[];
  imageKeys: string[];
  verified: boolean;
  status: string;
  ownerId: string;
  agentId?: string;
  createdAt: string;
  avgMarketPrice: number;
  isBackend: boolean;
}

export interface BackendPropertyRaw {
  id: string;
  title: string;
  price: bigint;
  locationState: string;
  locationCity: string;
  locationArea: string;
  propertyType: string;
  listingFor: string;
  description: string;
  imageKeys: string[];
  bedrooms: bigint;
  bathrooms: bigint;
  sizeSqm: bigint;
  amenities: string[];
  ownerId: string;
  status: string;
  createdAt: bigint;
}

export interface BackendPropertyInput {
  title: string;
  price: bigint;
  locationState: string;
  locationCity: string;
  locationArea: string;
  propertyType: string;
  listingFor: string;
  description: string;
  imageKeys: string[];
  bedrooms: bigint;
  bathrooms: bigint;
  sizeSqm: bigint;
  amenities: string[];
}

export function backendToDisplay(p: BackendPropertyRaw): DisplayProperty {
  const price = Number(p.price);
  return {
    id: p.id,
    title: p.title,
    type: p.propertyType,
    listingFor: p.listingFor,
    price,
    location: {
      state: p.locationState,
      city: p.locationCity,
      area: p.locationArea,
    },
    address: `${p.locationArea}, ${p.locationCity}, ${p.locationState}`,
    description: p.description,
    bedrooms: Number(p.bedrooms),
    bathrooms: Number(p.bathrooms),
    sizeSqm: Number(p.sizeSqm),
    amenities: p.amenities,
    photos: [],
    imageKeys: p.imageKeys,
    verified: false,
    status: p.status,
    ownerId: p.ownerId,
    createdAt: new Date(Number(p.createdAt) / 1_000_000).toLocaleDateString(),
    avgMarketPrice: price * 1.05,
    isBackend: true,
  };
}
