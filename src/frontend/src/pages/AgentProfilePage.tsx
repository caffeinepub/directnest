import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import VerifiedBadge from "../components/VerifiedBadge";
import { mockDisplayProperties } from "../context/AppContext";
import { agents } from "../data/mockData";

export default function AgentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const agent = agents.find((a) => a.id === id) || agents[0];
  const agentListings = mockDisplayProperties.filter(
    (p) => p.agentId === agent.id && p.status === "approved",
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-20">
            <div className="text-center mb-6">
              <Avatar className="w-20 h-20 mx-auto mb-3">
                <AvatarImage src={agent.avatar} />
                <AvatarFallback className="text-2xl">
                  {agent.name[0]}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-display font-bold text-xl">{agent.name}</h1>
              {agent.verified && (
                <div className="flex justify-center mt-1">
                  <VerifiedBadge size="md" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="font-bold text-lg">{agent.listingCount}</p>
                <p className="text-xs text-muted-foreground">Listings</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="font-bold text-lg">{agent.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <p className="font-bold text-lg">{agent.reviewCount}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                {agent.location}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                {agent.phone}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                Joined {new Date(agent.joinedAt).getFullYear()}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full gap-2"
                data-ocid="agent.call.button"
              >
                <Phone size={15} />
                Call Agent
              </Button>
              <Button
                className="w-full gap-2"
                onClick={() => navigate("/messages")}
                data-ocid="agent.message.button"
              >
                <MessageCircle size={15} />
                Send Message
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="font-semibold text-lg mb-2">About</h2>
            <p className="text-muted-foreground">{agent.bio}</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-4">
              Active Listings ({agentListings.length})
            </h2>
            {agentListings.length === 0 ? (
              <p
                className="text-muted-foreground text-sm"
                data-ocid="agent.listings.empty_state"
              >
                No active listings
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {agentListings.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i + 1} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-4">Reviews</h2>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={18}
                  fill={n <= Math.floor(agent.rating) ? "currentColor" : "none"}
                  className={
                    n <= Math.floor(agent.rating)
                      ? "text-amber-400"
                      : "text-muted-foreground"
                  }
                />
              ))}
              <span className="font-bold">{agent.rating}</span>
              <span className="text-muted-foreground">
                ({agent.reviewCount} reviews)
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {[
                {
                  name: "Tunde A.",
                  rating: 5,
                  text: "Excellent agent. Very professional and got us a great deal.",
                },
                {
                  name: "Amaka O.",
                  rating: 5,
                  text: "Highly recommended. Very responsive and knowledgeable.",
                },
              ].map((r, i) => (
                <div
                  key={r.name}
                  className="border border-border rounded-xl p-4"
                  data-ocid={`agent.review.${i + 1}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{r.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <div className="flex">
                        {Array.from({ length: r.rating }, (_, n) => n + 1).map(
                          (n) => (
                            <Star
                              key={n}
                              size={10}
                              fill="currentColor"
                              className="text-amber-400"
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Leave a Review</h3>
              <Textarea
                placeholder="Share your experience with this agent..."
                data-ocid="agent.review.textarea"
              />
              <Button size="sm" data-ocid="agent.review.submit_button">
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
