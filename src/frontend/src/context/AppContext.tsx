import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { properties as mockProperties } from "../data/mockData";
import type { Property as MockProperty } from "../data/mockData";
import type { DisplayProperty } from "../types/property";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "seeker" | "owner" | "agent" | "admin";
}

function mockToDisplay(p: MockProperty): DisplayProperty {
  return {
    id: p.id,
    title: p.title,
    type: p.type,
    listingFor: p.listingFor,
    price: p.price,
    location: p.location,
    address: p.address,
    description: p.description,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sizeSqm: p.sizeSqm,
    amenities: p.amenities,
    photos: p.photos,
    imageKeys: [],
    verified: p.verified,
    status: p.status,
    ownerId: p.ownerId,
    agentId: p.agentId,
    createdAt: p.createdAt,
    avgMarketPrice: p.avgMarketPrice,
    isBackend: false,
  };
}

export const mockDisplayProperties: DisplayProperty[] =
  mockProperties.map(mockToDisplay);

interface AppContextType {
  currentUser: AppUser | null;
  savedProperties: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  login: (user: AppUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [savedProperties, setSavedProperties] = useState<string[]>([
    "prop-1",
    "prop-3",
  ]);

  const toggleSaved = useCallback((id: string) => {
    setSavedProperties((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }, []);

  const isSaved = useCallback(
    (id: string) => savedProperties.includes(id),
    [savedProperties],
  );

  const login = (user: AppUser) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        savedProperties,
        toggleSaved,
        isSaved,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
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
