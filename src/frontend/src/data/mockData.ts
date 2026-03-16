export type PropertyType = "house" | "apartment" | "land";
export type PropertyStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "sold"
  | "rented";
export type ListingFor = "sale" | "rent";

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  listingFor: ListingFor;
  price: number;
  location: { state: string; city: string; area: string };
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  amenities: string[];
  photos: string[];
  verified: boolean;
  status: PropertyStatus;
  ownerId: string;
  agentId?: string;
  createdAt: string;
  avgMarketPrice: number;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  phone: string;
  email: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  listingCount: number;
  location: string;
  joinedAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  messages: Message[];
  propertyId?: string;
  propertyTitle?: string;
  lastMessage: string;
  lastTime: string;
}

export const NIGERIAN_STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Oyo",
  "Kano",
  "Delta",
  "Anambra",
  "Ogun",
  "Enugu",
  "Kaduna",
  "Cross River",
  "Imo",
];

const PHOTOS_HOUSE = [
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
];
const PHOTOS_APT = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
];
const PHOTOS_LAND = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
];

export const agents: Agent[] = [
  {
    id: "agent-1",
    name: "Emeka Okonkwo",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Top-rated Lagos agent with 10+ years in luxury real estate. Specialist in Victoria Island and Lekki Phase 1.",
    phone: "+234 803 111 2222",
    email: "emeka@directnest.ng",
    verified: true,
    rating: 4.9,
    reviewCount: 87,
    listingCount: 24,
    location: "Lagos",
    joinedAt: "2018-03-10",
  },
  {
    id: "agent-2",
    name: "Fatima Abdullahi",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Abuja real estate specialist. Expert in Maitama, Asokoro, and Wuse2 premium properties.",
    phone: "+234 807 222 3333",
    email: "fatima@directnest.ng",
    verified: true,
    rating: 4.7,
    reviewCount: 52,
    listingCount: 18,
    location: "Abuja",
    joinedAt: "2019-07-15",
  },
  {
    id: "agent-3",
    name: "Chidi Nwosu",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    bio: "Port Harcourt native helping families find affordable homes in GRA and new developments.",
    phone: "+234 811 333 4444",
    email: "chidi@directnest.ng",
    verified: false,
    rating: 4.3,
    reviewCount: 28,
    listingCount: 11,
    location: "Port Harcourt",
    joinedAt: "2021-01-20",
  },
  {
    id: "agent-4",
    name: "Aisha Bello",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Ibadan and Oyo specialist, focused on land and development opportunities.",
    phone: "+234 815 444 5555",
    email: "aisha@directnest.ng",
    verified: true,
    rating: 4.6,
    reviewCount: 41,
    listingCount: 15,
    location: "Ibadan",
    joinedAt: "2020-05-05",
  },
];

export const properties: Property[] = [
  {
    id: "prop-1",
    title: "5-Bedroom Duplex in Lekki Phase 1",
    type: "house",
    listingFor: "sale",
    price: 95000000,
    location: { state: "Lagos", city: "Lagos", area: "Lekki Phase 1" },
    address: "14 Admiralty Way, Lekki Phase 1, Lagos",
    description:
      "Stunning 5-bedroom fully detached duplex with modern finishes. Features a private pool, 3-car garage, and 24/7 security. Located in the heart of Lekki Phase 1 with easy access to major roads.",
    bedrooms: 5,
    bathrooms: 5,
    sizeSqm: 680,
    amenities: [
      "Swimming Pool",
      "Gym",
      "24/7 Security",
      "Generator",
      "DSTV",
      "Smart Home",
      "Garage",
      "Garden",
    ],
    photos: PHOTOS_HOUSE,
    verified: true,
    status: "approved",
    ownerId: "user-1",
    agentId: "agent-1",
    createdAt: "2026-01-15",
    avgMarketPrice: 80000000,
  },
  {
    id: "prop-2",
    title: "3-Bedroom Apartment in Victoria Island",
    type: "apartment",
    listingFor: "rent",
    price: 4500000,
    location: { state: "Lagos", city: "Lagos", area: "Victoria Island" },
    address: "7B Adeola Odeku Street, Victoria Island, Lagos",
    description:
      "Luxury serviced 3-bedroom apartment with panoramic ocean views. Fully equipped kitchen, en-suite bathrooms, and concierge service.",
    bedrooms: 3,
    bathrooms: 3,
    sizeSqm: 220,
    amenities: [
      "Ocean View",
      "Concierge",
      "Gym",
      "Generator",
      "Internet",
      "Parking",
    ],
    photos: PHOTOS_APT,
    verified: true,
    status: "approved",
    ownerId: "user-2",
    agentId: "agent-1",
    createdAt: "2026-01-20",
    avgMarketPrice: 4200000,
  },
  {
    id: "prop-3",
    title: "4-Bedroom Detached House in Maitama",
    type: "house",
    listingFor: "sale",
    price: 120000000,
    location: { state: "Abuja (FCT)", city: "Abuja", area: "Maitama" },
    address: "3 Lobito Crescent, Maitama, Abuja",
    description:
      "Exquisite 4-bedroom detached house in the prestigious Maitama district. Features solar panels, BQ, and landscaped compound.",
    bedrooms: 4,
    bathrooms: 4,
    sizeSqm: 520,
    amenities: [
      "Solar Power",
      "BQ",
      "Security",
      "Generator",
      "Borehole",
      "Garden",
      "Garage",
    ],
    photos: PHOTOS_HOUSE,
    verified: true,
    status: "approved",
    ownerId: "user-3",
    agentId: "agent-2",
    createdAt: "2026-02-01",
    avgMarketPrice: 115000000,
  },
  {
    id: "prop-4",
    title: "500 SQM Land in Ibeju-Lekki",
    type: "land",
    listingFor: "sale",
    price: 8500000,
    location: { state: "Lagos", city: "Lagos", area: "Ibeju-Lekki" },
    address: "Eleko Beach Road, Ibeju-Lekki, Lagos",
    description:
      "Prime 500 sqm land with C of O in fast-developing Ibeju-Lekki corridor. Close to Dangote Refinery and Lekki Free Zone.",
    bedrooms: 0,
    bathrooms: 0,
    sizeSqm: 500,
    amenities: ["C of O", "Road Access", "Electricity", "Gated Estate"],
    photos: PHOTOS_LAND,
    verified: true,
    status: "approved",
    ownerId: "user-4",
    agentId: "agent-1",
    createdAt: "2026-02-10",
    avgMarketPrice: 7000000,
  },
  {
    id: "prop-5",
    title: "2-Bedroom Flat in Wuse 2",
    type: "apartment",
    listingFor: "rent",
    price: 2200000,
    location: { state: "Abuja (FCT)", city: "Abuja", area: "Wuse 2" },
    address: "42 Aminu Kano Crescent, Wuse 2, Abuja",
    description:
      "Well-maintained 2-bedroom flat in the heart of Wuse 2. Close to banks, restaurants, and nightlife.",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 120,
    amenities: ["Security", "Generator", "Parking", "Internet"],
    photos: PHOTOS_APT,
    verified: false,
    status: "approved",
    ownerId: "user-5",
    agentId: "agent-2",
    createdAt: "2026-02-12",
    avgMarketPrice: 2000000,
  },
  {
    id: "prop-6",
    title: "6-Bedroom Mansion in GRA Port Harcourt",
    type: "house",
    listingFor: "sale",
    price: 180000000,
    location: { state: "Rivers", city: "Port Harcourt", area: "GRA Phase 2" },
    address: "12 Peter Odili Road, GRA Phase 2, Port Harcourt",
    description:
      "Grand 6-bedroom mansion in Port Harcourt GRA. Perfect for diplomatic use or luxury family living. Fully furnished option available.",
    bedrooms: 6,
    bathrooms: 7,
    sizeSqm: 900,
    amenities: [
      "Swimming Pool",
      "Gym",
      "Cinema Room",
      "Smart Home",
      "Generator",
      "BQ",
      "Security",
      "Garage",
    ],
    photos: PHOTOS_HOUSE,
    verified: true,
    status: "approved",
    ownerId: "user-6",
    agentId: "agent-3",
    createdAt: "2026-02-18",
    avgMarketPrice: 170000000,
  },
  {
    id: "prop-7",
    title: "1,000 SQM Land in Jabi",
    type: "land",
    listingFor: "sale",
    price: 35000000,
    location: { state: "Abuja (FCT)", city: "Abuja", area: "Jabi" },
    address: "Jabi District, Abuja",
    description:
      "Large commercial/residential land in Jabi. Approved for mixed-use development. Rare opportunity.",
    bedrooms: 0,
    bathrooms: 0,
    sizeSqm: 1000,
    amenities: ["C of O", "Commercial Approval", "Road Access"],
    photos: PHOTOS_LAND,
    verified: true,
    status: "approved",
    ownerId: "user-7",
    agentId: "agent-2",
    createdAt: "2026-02-20",
    avgMarketPrice: 40000000,
  },
  {
    id: "prop-8",
    title: "3-Bedroom Bungalow in Bodija",
    type: "house",
    listingFor: "sale",
    price: 28000000,
    location: { state: "Oyo", city: "Ibadan", area: "Bodija" },
    address: "9 Oba Adelabi Street, Bodija, Ibadan",
    description:
      "Comfortable 3-bedroom bungalow in Bodija Estate. Ideal for families. All documents intact.",
    bedrooms: 3,
    bathrooms: 3,
    sizeSqm: 300,
    amenities: ["Security", "Borehole", "Generator", "Garage"],
    photos: PHOTOS_HOUSE,
    verified: false,
    status: "approved",
    ownerId: "user-8",
    agentId: "agent-4",
    createdAt: "2026-03-01",
    avgMarketPrice: 25000000,
  },
  {
    id: "prop-9",
    title: "Studio Apartment in Yaba",
    type: "apartment",
    listingFor: "rent",
    price: 900000,
    location: { state: "Lagos", city: "Lagos", area: "Yaba" },
    address: "5 Herbert Macaulay Way, Yaba, Lagos",
    description:
      "Modern studio apartment near Yaba Tech hub. Perfect for young professionals and students.",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqm: 45,
    amenities: ["Fast Internet", "Security", "Generator"],
    photos: PHOTOS_APT,
    verified: true,
    status: "approved",
    ownerId: "user-9",
    createdAt: "2026-03-03",
    avgMarketPrice: 850000,
  },
  {
    id: "prop-10",
    title: "4-Bedroom Terrace in Ajah",
    type: "house",
    listingFor: "rent",
    price: 3800000,
    location: { state: "Lagos", city: "Lagos", area: "Ajah" },
    address: "Abraham Adesanya Estate, Ajah, Lagos",
    description:
      "Spacious 4-bedroom terraced duplex in a gated estate. Family-friendly neighborhood with good security.",
    bedrooms: 4,
    bathrooms: 4,
    sizeSqm: 350,
    amenities: [
      "Gated Estate",
      "Security",
      "Generator",
      "Parking",
      "Playground",
    ],
    photos: PHOTOS_HOUSE,
    verified: true,
    status: "approved",
    ownerId: "user-10",
    agentId: "agent-1",
    createdAt: "2026-03-05",
    avgMarketPrice: 3500000,
  },
  {
    id: "prop-11",
    title: "2-Bedroom Apartment in Old GRA",
    type: "apartment",
    listingFor: "rent",
    price: 1800000,
    location: { state: "Rivers", city: "Port Harcourt", area: "Old GRA" },
    address: "Old GRA, Port Harcourt",
    description:
      "Well-maintained 2-bedroom apartment in the classic Old GRA area. Peaceful environment.",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 110,
    amenities: ["Security", "Generator", "Parking"],
    photos: PHOTOS_APT,
    verified: false,
    status: "pending",
    ownerId: "user-11",
    agentId: "agent-3",
    createdAt: "2026-03-08",
    avgMarketPrice: 1500000,
  },
  {
    id: "prop-12",
    title: "300 SQM Land in Enugu GRA",
    type: "land",
    listingFor: "sale",
    price: 12000000,
    location: { state: "Enugu", city: "Enugu", area: "GRA" },
    address: "Enugu GRA, Enugu State",
    description:
      "Affordable land in Enugu GRA with all government approvals. Perfect for residential construction.",
    bedrooms: 0,
    bathrooms: 0,
    sizeSqm: 300,
    amenities: ["Governor Consent", "Road Access", "Electricity"],
    photos: PHOTOS_LAND,
    verified: true,
    status: "approved",
    ownerId: "user-12",
    createdAt: "2026-03-10",
    avgMarketPrice: 11000000,
  },
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    propertyId: "prop-1",
    reviewerId: "user-a",
    reviewerName: "Tunde Adeyemi",
    rating: 5,
    comment:
      "Absolutely stunning property. The agent was professional and the deal was smooth.",
    createdAt: "2026-02-01",
  },
  {
    id: "rev-2",
    propertyId: "prop-1",
    reviewerId: "user-b",
    reviewerName: "Ngozi Obi",
    rating: 4,
    comment:
      "Great location, well maintained. Slight delay in paperwork but resolved.",
    createdAt: "2026-02-15",
  },
  {
    id: "rev-3",
    propertyId: "prop-2",
    reviewerId: "user-c",
    reviewerName: "Kola Abiodun",
    rating: 5,
    comment: "Perfect VI apartment. Ocean view is breathtaking!",
    createdAt: "2026-02-20",
  },
  {
    id: "rev-4",
    propertyId: "prop-3",
    reviewerId: "user-d",
    reviewerName: "Amaka Eze",
    rating: 4,
    comment: "Very good house. Maitama location is premium.",
    createdAt: "2026-02-25",
  },
  {
    id: "rev-5",
    propertyId: "prop-6",
    reviewerId: "user-e",
    reviewerName: "Bayo Olatunji",
    rating: 5,
    comment: "The mansion is worth every naira. Absolutely luxurious.",
    createdAt: "2026-03-01",
  },
];

export const conversations: Conversation[] = [
  {
    id: "conv-1",
    participants: ["me", "agent-1"],
    participantNames: ["You", "Emeka Okonkwo"],
    propertyId: "prop-1",
    propertyTitle: "5-Bedroom Duplex in Lekki Phase 1",
    lastMessage: "Yes, we can schedule a viewing this Saturday.",
    lastTime: "10:32 AM",
    messages: [
      {
        id: "m1",
        senderId: "me",
        content:
          "Hello, I am interested in the Lekki duplex. Is it still available?",
        timestamp: "10:15 AM",
        read: true,
      },
      {
        id: "m2",
        senderId: "agent-1",
        content:
          "Yes it is! It is a fantastic property. When would you like to visit?",
        timestamp: "10:20 AM",
        read: true,
      },
      {
        id: "m3",
        senderId: "me",
        content: "Can we do this weekend?",
        timestamp: "10:28 AM",
        read: true,
      },
      {
        id: "m4",
        senderId: "agent-1",
        content: "Yes, we can schedule a viewing this Saturday.",
        timestamp: "10:32 AM",
        read: true,
      },
    ],
  },
  {
    id: "conv-2",
    participants: ["me", "agent-2"],
    participantNames: ["You", "Fatima Abdullahi"],
    propertyId: "prop-3",
    propertyTitle: "4-Bedroom House in Maitama",
    lastMessage: "The asking price is negotiable for serious buyers.",
    lastTime: "Yesterday",
    messages: [
      {
        id: "m5",
        senderId: "me",
        content: "Hi Fatima, is the Maitama property price negotiable?",
        timestamp: "Yesterday 2:10 PM",
        read: true,
      },
      {
        id: "m6",
        senderId: "agent-2",
        content: "The asking price is negotiable for serious buyers.",
        timestamp: "Yesterday 3:05 PM",
        read: true,
      },
    ],
  },
  {
    id: "conv-3",
    participants: ["me", "user-9"],
    participantNames: ["You", "Property Owner"],
    propertyId: "prop-9",
    propertyTitle: "Studio Apartment in Yaba",
    lastMessage: "The apartment is available from April 1st.",
    lastTime: "Mon",
    messages: [
      {
        id: "m7",
        senderId: "me",
        content: "When is the studio apartment available?",
        timestamp: "Mon 9:00 AM",
        read: true,
      },
      {
        id: "m8",
        senderId: "user-9",
        content: "The apartment is available from April 1st.",
        timestamp: "Mon 11:00 AM",
        read: true,
      },
    ],
  },
];

export function formatNGN(amount: number): string {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(0)}K`;
  }
  return `₦${amount.toLocaleString()}`;
}

export function getPriceStatus(
  price: number,
  avg: number,
): "above" | "fair" | "below" {
  const diff = (price - avg) / avg;
  if (diff > 0.15) return "above";
  if (diff < -0.1) return "below";
  return "fair";
}
