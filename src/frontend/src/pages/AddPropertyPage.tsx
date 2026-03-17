import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus, MapPin, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

export default function AddPropertyPage() {
  const { user, addProperty } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (user && user.role === "seeker") {
    toast.error("Only property owners and agents can list properties");
    navigate({ to: "/" });
    return null;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !price || !location.trim() || !description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    const priceNum = Number.parseFloat(price.replace(/,/g, ""));
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addProperty({
        title: title.trim(),
        price: priceNum,
        location: location.trim(),
        description: description.trim(),
        imageUrl:
          imagePreview || `https://picsum.photos/400/300?random=${Date.now()}`,
      });
      toast.success("Property listed successfully!");
      navigate({ to: "/" });
    }, 800);
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      <header className="bg-primary px-5 pt-12 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="p-2 rounded-lg bg-primary-foreground/10 text-primary-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-primary-foreground">
              List a Property
            </h1>
            <p className="text-primary-foreground/70 text-xs">
              Fill in the property details
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background rounded-t-3xl -mt-3 px-5 pt-6 pb-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Property Image</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                data-ocid="add_property.image_upload_button"
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm font-medium">Tap to upload image</span>
                <span className="text-xs">JPG, PNG up to 5MB</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prop-title">Property Title *</Label>
            <Input
              id="prop-title"
              data-ocid="add_property.title_input"
              placeholder="e.g. 3-Bedroom Apartment in Lekki"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prop-price">Price (₦) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                ₦
              </span>
              <Input
                id="prop-price"
                data-ocid="add_property.price_input"
                type="number"
                placeholder="e.g. 4500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prop-location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="prop-location"
                data-ocid="add_property.location_input"
                placeholder="e.g. Lekki Phase 1, Lagos"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prop-desc">Description *</Label>
            <Textarea
              id="prop-desc"
              data-ocid="add_property.description_textarea"
              placeholder="Describe the property — size, amenities, nearby landmarks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            data-ocid="add_property.submit_button"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Property"}
          </Button>
        </form>
      </main>
    </div>
  );
}
