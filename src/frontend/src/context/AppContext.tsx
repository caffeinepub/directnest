import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserRole = "seeker" | "owner" | "agent";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerRole: UserRole;
  createdAt: number;
}

interface AppContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  properties: Property[];
  addProperty: (
    p: Omit<
      Property,
      "id" | "ownerId" | "ownerName" | "ownerPhone" | "ownerRole" | "createdAt"
    >,
  ) => void;
}

const SEED_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Luxury 3-Bedroom Apartment",
    price: 4500000,
    location: "Lekki Phase 1, Lagos",
    description:
      "A stunning 3-bedroom apartment in the heart of Lekki with premium finishes, 24/7 power supply, and excellent security. Ideal for families and professionals.",
    imageUrl: "/assets/generated/prop-1.dim_400x300.jpg",
    ownerId: "seed",
    ownerName: "Emeka Okafor",
    ownerPhone: "+2348031234567",
    ownerRole: "owner",
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "2",
    title: "Modern 4-Bedroom Duplex",
    price: 8200000,
    location: "Maitama, Abuja",
    description:
      "Elegant duplex in Maitama featuring 4 spacious bedrooms, a private garden, boys quarters, and a 2-car garage. Located in a serene and secure estate.",
    imageUrl: "/assets/generated/prop-2.dim_400x300.jpg",
    ownerId: "seed",
    ownerName: "Fatima Bello",
    ownerPhone: "+2348059876543",
    ownerRole: "agent",
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "3",
    title: "Self-Contain Studio Flat",
    price: 650000,
    location: "Yaba, Lagos",
    description:
      "A well-finished self-contain studio with tiled floors, fitted kitchen, and steady water supply. Perfect for young professionals in Lagos.",
    imageUrl: "/assets/generated/prop-3.dim_400x300.jpg",
    ownerId: "seed",
    ownerName: "Chidi Nwosu",
    ownerPhone: "+2347012345678",
    ownerRole: "owner",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "4",
    title: "Spacious 3-Bedroom Bungalow",
    price: 3100000,
    location: "GRA Phase 2, Port Harcourt",
    description:
      "Lovely bungalow in a quiet GRA neighborhood with 3 bedrooms, a generator house, and a large compound. Excellent for families seeking peace and space.",
    imageUrl: "/assets/generated/prop-4.dim_400x300.jpg",
    ownerId: "seed",
    ownerName: "Sandra Amadi",
    ownerPhone: "+2348023456789",
    ownerRole: "agent",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "5",
    title: "Prime Office Space",
    price: 5900000,
    location: "Victoria Island, Lagos",
    description:
      "Premium office space on the 4th floor of a Grade-A building on VI. Features open-plan layout, central AC, high-speed internet, and dedicated parking.",
    imageUrl: "/assets/generated/prop-5.dim_400x300.jpg",
    ownerId: "seed",
    ownerName: "Tunde Adeyemi",
    ownerPhone: "+2348067891234",
    ownerRole: "agent",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "6",
    title: "Penthouse with City View",
    price: 12500000,
    location: "Ikeja GRA, Lagos",
    description:
      "Breathtaking penthouse apartment on the 12th floor with panoramic city views, floor-to-ceiling windows, a rooftop terrace, and concierge services.",
    imageUrl: "/assets/generated/prop-6.dim_400x300.jpg",
    ownerId: "seed",
    ownerName: "Ngozi Eze",
    ownerPhone: "+2348045678901",
    ownerRole: "owner",
    createdAt: Date.now(),
  },
];

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("directnest_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem("directnest_properties");
      return stored ? JSON.parse(stored) : SEED_PROPERTIES;
    } catch {
      return SEED_PROPERTIES;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("directnest_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("directnest_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("directnest_properties", JSON.stringify(properties));
  }, [properties]);

  function login(u: User) {
    setUser(u);
  }

  function logout() {
    setUser(null);
  }

  function addProperty(
    p: Omit<
      Property,
      "id" | "ownerId" | "ownerName" | "ownerPhone" | "ownerRole" | "createdAt"
    >,
  ) {
    if (!user) return;
    const newProp: Property = {
      ...p,
      id: Date.now().toString(),
      ownerId: user.id,
      ownerName: user.fullName,
      ownerPhone: user.phone,
      ownerRole: user.role,
      createdAt: Date.now(),
    };
    setProperties((prev) => [newProp, ...prev]);
  }

  return (
    <AppContext.Provider
      value={{ user, login, logout, properties, addProperty }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
