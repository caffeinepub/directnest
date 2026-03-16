import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { useApp } from "../context/AppContext";
import { mockDisplayProperties } from "../context/AppContext";

export default function UserProfilePage() {
  const { currentUser, savedProperties, logout } = useApp();
  const navigate = useNavigate();
  const saved = mockDisplayProperties.filter((p) =>
    savedProperties.includes(p.id),
  );
  const myListings = mockDisplayProperties.slice(0, 2);

  if (!currentUser)
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">
          Sign in to view your profile
        </h2>
        <Button
          onClick={() => navigate("/auth")}
          data-ocid="profile.login.button"
        >
          Login / Sign Up
        </Button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {currentUser.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display font-bold text-2xl">
            {currentUser.name}
          </h1>
          <p className="text-muted-foreground">{currentUser.email}</p>
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full capitalize">
            {currentUser.role}
          </span>
        </div>
      </div>

      <Tabs defaultValue="saved" data-ocid="profile.tab">
        <TabsList className="mb-6">
          <TabsTrigger value="saved" data-ocid="profile.saved.tab">
            Saved ({saved.length})
          </TabsTrigger>
          <TabsTrigger value="listings" data-ocid="profile.listings.tab">
            My Listings
          </TabsTrigger>
          <TabsTrigger value="settings" data-ocid="profile.settings.tab">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          {saved.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="profile.saved.empty_state"
            >
              <p className="font-medium">No saved properties yet</p>
              <p className="text-sm mt-1">
                Browse listings and heart the ones you like
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/home")}
                data-ocid="profile.browse.button"
              >
                Browse Listings
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {saved.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i + 1} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="listings">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">My Listings</h2>
            <Button
              size="sm"
              onClick={() => navigate("/upload")}
              data-ocid="profile.add_listing.button"
            >
              + Add Listing
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myListings.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i + 1} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold">Profile Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  defaultValue={currentUser.name}
                  data-ocid="settings.name.input"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  defaultValue={currentUser.email}
                  data-ocid="settings.email.input"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="+234 800 000 0000"
                  data-ocid="settings.phone.input"
                />
              </div>
            </div>
            <Button size="sm" data-ocid="settings.save.button">
              Save Changes
            </Button>
          </div>
          <Button
            variant="outline"
            className="text-destructive border-destructive/30"
            onClick={() => {
              logout();
              navigate("/");
            }}
            data-ocid="settings.logout.button"
          >
            Sign Out
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
