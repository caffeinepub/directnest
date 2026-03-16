import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NIGERIAN_STATES } from "../data/mockData";
import { useSubmitProperty } from "../hooks/usePropertyMethods";

const AMENITIES = [
  "Swimming Pool",
  "Gym",
  "24/7 Security",
  "Generator",
  "DSTV",
  "Smart Home",
  "Garage",
  "Garden",
  "Borehole",
  "Solar Power",
  "Internet",
  "Parking",
  "BQ",
];
const steps = ["Basic Info", "Location", "Photos", "Amenities & Details"];

export default function UploadPropertyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    type: "",
    listingFor: "",
    price: "",
    description: "",
    state: "",
    city: "",
    area: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    sizeSqm: "",
    amenities: [] as string[],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useSubmitProperty();

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggleAmenity = (a: string) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(imagePreviews[idx]);
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync({
        formData: form,
        imageFiles,
        onProgress: setUploadProgress,
      });
      setSubmitted(true);
      toast.success("Property submitted successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit property",
      );
    }
  };

  if (submitted) {
    return (
      <div
        className="max-w-lg mx-auto px-4 py-20 text-center"
        data-ocid="upload.success.panel"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">
          Listing Submitted!
        </h2>
        <p className="text-muted-foreground mb-6">
          Your property has been submitted. Our team will verify and approve it
          shortly.
        </p>
        <Button
          onClick={() => navigate("/home")}
          data-ocid="upload.success.button"
        >
          Back to Listings
        </Button>
      </div>
    );
  }

  const isPending = submitMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-2">
        List Your Property
      </h1>
      <p className="text-muted-foreground mb-6">
        Step {step + 1} of {steps.length}: {steps[step]}
      </p>
      <Progress value={((step + 1) / steps.length) * 100} className="mb-8" />

      {isPending && (
        <div className="mb-4 space-y-1" data-ocid="upload.loading_state">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            <span>Uploading images and submitting...</span>
          </div>
          <Progress value={uploadProgress} className="h-1.5" />
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        {step === 0 && (
          <>
            <div className="space-y-2">
              <Label>Property Title</Label>
              <Input
                placeholder="e.g. 3-Bedroom Duplex in Lekki"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                data-ocid="upload.title.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => update("type", v)}
                >
                  <SelectTrigger data-ocid="upload.type.select">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Listing For</Label>
                <Select
                  value={form.listingFor}
                  onValueChange={(v) => update("listingFor", v)}
                >
                  <SelectTrigger data-ocid="upload.listing_for.select">
                    <SelectValue placeholder="Sale or Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Price (NGN)</Label>
              <Input
                type="number"
                placeholder="e.g. 15000000"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                data-ocid="upload.price.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                placeholder="Describe the property..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                data-ocid="upload.description.textarea"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label>State</Label>
              <Select
                value={form.state}
                onValueChange={(v) => update("state", v)}
              >
                <SelectTrigger data-ocid="upload.state.select">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                placeholder="e.g. Lagos"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                data-ocid="upload.city.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Area/Neighborhood</Label>
              <Input
                placeholder="e.g. Lekki Phase 1"
                value={form.area}
                onChange={(e) => update("area", e.target.value)}
                data-ocid="upload.area.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Full Address</Label>
              <Textarea
                rows={2}
                placeholder="Full property address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                data-ocid="upload.address.textarea"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              data-ocid="upload.photos.input"
            />
            <button
              type="button"
              className="w-full border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="upload.photos.dropzone"
            >
              <Upload
                size={28}
                className="mx-auto mb-3 text-muted-foreground"
              />
              <p className="font-medium">Click to upload photos</p>
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG up to 10MB each. Minimum 3 photos recommended.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                data-ocid="upload.photos.upload_button"
              >
                Choose Files
              </Button>
            </button>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {imagePreviews.map((src, idx) => (
                  <div
                    key={src}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                      onClick={() => removeImage(idx)}
                      data-ocid={`upload.photo_remove.${idx + 1}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              {imagePreviews.length > 0
                ? `${imagePreviews.length} photo(s) selected`
                : "Good photos greatly increase your chances of getting inquiries."}
            </p>
          </div>
        )}

        {step === 3 && (
          <>
            <div>
              <Label className="mb-3 block">Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <Checkbox
                      id={`upload-am-${a}`}
                      checked={form.amenities.includes(a)}
                      onCheckedChange={() => toggleAmenity(a)}
                      data-ocid="upload.amenity.checkbox"
                    />
                    <label
                      htmlFor={`upload-am-${a}`}
                      className="text-sm cursor-pointer"
                    >
                      {a}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {form.type !== "land" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.bedrooms}
                    onChange={(e) => update("bedrooms", e.target.value)}
                    data-ocid="upload.bedrooms.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.bathrooms}
                    onChange={(e) => update("bathrooms", e.target.value)}
                    data-ocid="upload.bathrooms.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Size (sqm)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.sizeSqm}
                    onChange={(e) => update("sizeSqm", e.target.value)}
                    data-ocid="upload.size.input"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between mt-6">
        {step > 0 ? (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={isPending}
            data-ocid="upload.prev.button"
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </Button>
        ) : (
          <div />
        )}
        {step < steps.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            data-ocid="upload.next.button"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary"
            data-ocid="upload.submit.button"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Listing"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
