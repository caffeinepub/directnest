import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Bath,
  Bed,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  Share2,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PriceIntelligenceBadge from "../components/PriceIntelligenceBadge";
import VerifiedBadge from "../components/VerifiedBadge";
import { useApp } from "../context/AppContext";
import { mockDisplayProperties } from "../context/AppContext";
import { agents, formatNGN, reviews } from "../data/mockData";
import { useGetProperty } from "../hooks/usePropertyMethods";
import { useStorageUrls } from "../hooks/usePropertyMethods";
import type { DisplayProperty } from "../types/property";

function PhotoCarousel({ property }: { property: DisplayProperty }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const { data: blobUrls } = useStorageUrls(property.imageKeys);

  const allPhotos =
    property.photos.length > 0
      ? property.photos
      : ((blobUrls ?? []).filter(Boolean) as string[]);

  const currentPhoto = allPhotos[photoIdx] ?? "";

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-6 bg-muted">
      {currentPhoto ? (
        <img
          src={currentPhoto}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <MapPin size={48} className="text-muted-foreground" />
        </div>
      )}
      {allPhotos.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
            onClick={() =>
              setPhotoIdx((i) => (i - 1 + allPhotos.length) % allPhotos.length)
            }
            data-ocid="detail.photo_prev.button"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
            onClick={() => setPhotoIdx((i) => (i + 1) % allPhotos.length)}
            data-ocid="detail.photo_next.button"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allPhotos.map((photo, i) => (
              <button
                type="button"
                key={photo}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === photoIdx ? "bg-white" : "bg-white/40"
                }`}
                onClick={() => setPhotoIdx(i)}
                data-ocid={`detail.photo_dot.${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useApp();
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const { data: backendProperty, isLoading } = useGetProperty(id ?? "");

  // Fallback to mock if not found in backend
  const mockProperty = mockDisplayProperties.find((p) => p.id === id);
  const property: DisplayProperty | undefined =
    backendProperty ?? mockProperty ?? undefined;

  const saved = property ? isSaved(property.id) : false;

  const agent = property?.agentId
    ? agents.find((a) => a.id === property.agentId)
    : null;
  const propReviews = reviews.filter((r) => r.propertyId === id);

  const shareWhatsApp = () =>
    property &&
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Check out this property on DirectNest: ${property.title} - ${formatNGN(property.price)} ${window.location.href}`)}`,
    );
  const shareFacebook = () =>
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    );

  if (isLoading) {
    return (
      <div
        className="max-w-5xl mx-auto px-4 py-8"
        data-ocid="detail.loading_state"
      >
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="aspect-[16/9] w-full rounded-2xl mb-6" />
        <div className="flex gap-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8 text-center" data-ocid="detail.error_state">
        <p className="text-lg font-medium">Property not found</p>
        <Button
          className="mt-4"
          onClick={() => navigate("/home")}
          data-ocid="detail.back.button"
        >
          Back to Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="hover:text-foreground"
          data-ocid="detail.back.button"
        >
          Listings
        </button>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{property.title}</span>
      </nav>

      {/* Photo carousel */}
      <div className="relative">
        <PhotoCarousel property={property} />
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            type="button"
            className={`p-2.5 rounded-full bg-white/80 backdrop-blur-sm ${
              saved ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={() => toggleSaved(property.id)}
            data-ocid="detail.save.button"
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className="p-2.5 rounded-full bg-white/80 backdrop-blur-sm text-muted-foreground"
            data-ocid="detail.share.button"
          >
            <Share2 size={18} />
          </button>
        </div>
        {property.verified && (
          <div className="absolute top-4 left-4 z-10">
            <VerifiedBadge size="md" />
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                variant={
                  property.listingFor === "sale" ? "default" : "secondary"
                }
                className="capitalize"
              >
                For {property.listingFor}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {property.type}
              </Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              {property.title}
            </h1>
            <div className="flex items-center gap-1 text-muted-foreground mb-3">
              <MapPin size={15} />
              <span>{property.address}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-primary font-bold text-3xl">
                {formatNGN(property.price)}
                {property.listingFor === "rent" ? (
                  <span className="text-lg font-normal text-muted-foreground">
                    /yr
                  </span>
                ) : (
                  ""
                )}
              </span>
              <PriceIntelligenceBadge
                price={property.price}
                avgMarketPrice={property.avgMarketPrice}
              />
            </div>
          </div>

          {/* Property stats */}
          {property.type !== "land" && (
            <div className="flex gap-4 p-4 bg-muted/40 rounded-xl">
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-1 font-bold text-xl">
                  <Bed size={18} className="text-primary" />
                  {property.bedrooms}
                </div>
                <div className="text-xs text-muted-foreground">Bedrooms</div>
              </div>
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-1 font-bold text-xl">
                  <Bath size={18} className="text-primary" />
                  {property.bathrooms}
                </div>
                <div className="text-xs text-muted-foreground">Bathrooms</div>
              </div>
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-1 font-bold text-xl">
                  <Maximize2 size={18} className="text-primary" />
                  {property.sizeSqm}
                </div>
                <div className="text-xs text-muted-foreground">Sqm</div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span
                    key={a}
                    className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Map placeholder */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Location</h2>
            <div
              className="aspect-[16/7] bg-muted rounded-xl flex items-center justify-center border border-border"
              data-ocid="detail.map_marker"
            >
              <div className="text-center text-muted-foreground">
                <MapPin size={32} className="mx-auto mb-2 text-primary" />
                <p className="font-medium">
                  {property.location.area}, {property.location.city}
                </p>
                <p className="text-sm">{property.location.state}</p>
              </div>
            </div>
          </div>

          {/* Social share */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Share this Property</h2>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={shareWhatsApp}
                className="gap-2"
                data-ocid="detail.share_whatsapp.button"
              >
                <span className="text-green-600 font-bold">W</span> WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareFacebook}
                className="gap-2"
                data-ocid="detail.share_facebook.button"
              >
                <span className="text-blue-600 font-bold">f</span> Facebook
              </Button>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="font-semibold text-lg mb-4">
              Reviews ({propReviews.length})
            </h2>
            {propReviews.length === 0 ? (
              <p
                className="text-muted-foreground text-sm"
                data-ocid="reviews.empty_state"
              >
                No reviews yet. Be the first to review.
              </p>
            ) : (
              <div className="space-y-4">
                {propReviews.map((r, i) => (
                  <div
                    key={r.id}
                    className="border border-border rounded-xl p-4"
                    data-ocid={`reviews.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{r.reviewerName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{r.reviewerName}</p>
                        <div className="flex">
                          {Array.from(
                            { length: r.rating },
                            (_, n) => n + 1,
                          ).map((n) => (
                            <Star
                              key={n}
                              size={11}
                              fill="currentColor"
                              className="text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {r.createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <h3 className="font-medium">Write a Review</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setReviewRating(n)}
                    data-ocid={`review.star.${n}`}
                  >
                    <Star
                      size={20}
                      fill={n <= reviewRating ? "currentColor" : "none"}
                      className={
                        n <= reviewRating
                          ? "text-amber-400"
                          : "text-muted-foreground"
                      }
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                data-ocid="review.text.textarea"
              />
              <Button size="sm" data-ocid="review.submit.button">
                Submit Review
              </Button>
            </div>
          </div>
        </div>

        {/* Agent card sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
          {agent && (
            <div className="bg-card border border-border rounded-xl p-5 sticky top-20">
              <h3 className="font-semibold mb-4">Listed by Agent</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback>{agent.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{agent.name}</p>
                  {agent.verified && <VerifiedBadge size="sm" />}
                  <div className="flex items-center gap-1 mt-1">
                    <Star
                      size={12}
                      fill="currentColor"
                      className="text-amber-400"
                    />
                    <span className="text-sm">
                      {agent.rating} ({agent.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {agent.bio.slice(0, 80)}...
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  data-ocid="detail.agent_call.button"
                >
                  <Phone size={15} /> Call Agent
                </Button>
                <Button
                  className="w-full gap-2"
                  onClick={() => navigate("/messages")}
                  data-ocid="detail.agent_message.button"
                >
                  <MessageCircle size={15} /> Message Agent
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => navigate(`/agent/${agent.id}`)}
                  data-ocid="detail.agent_profile.button"
                >
                  View Full Profile
                </Button>
              </div>
            </div>
          )}

          {!agent && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">Contact Owner</h3>
              <Button
                className="w-full gap-2 mb-2"
                onClick={() => navigate("/messages")}
                data-ocid="detail.owner_message.button"
              >
                <MessageCircle size={15} /> Send Message
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                data-ocid="detail.owner_call.button"
              >
                <Phone size={15} /> Call Owner
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
