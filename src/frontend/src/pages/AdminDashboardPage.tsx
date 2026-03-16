import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Flag, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { agents, properties } from "../data/mockData";

export default function AdminDashboardPage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [listingStatuses, setListingStatuses] = useState<
    Record<string, string>
  >({});
  const [agentVerified, setAgentVerified] = useState<Record<string, boolean>>(
    {},
  );

  if (currentUser?.role !== "admin")
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-2">
          Admin Access Only
        </h2>
        <p className="text-muted-foreground mb-6">
          You need admin privileges to view this page.
        </p>
        <Button
          onClick={() => navigate("/auth")}
          data-ocid="admin.login.button"
        >
          Login as Admin
        </Button>
      </div>
    );

  const pending = properties.filter((p) => p.status === "pending");
  const allProps = properties;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Manage listings, users, and platform health
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Listings",
            value: properties.length,
            color: "text-primary",
          },
          {
            label: "Pending Review",
            value: pending.length,
            color: "text-amber-600",
          },
          {
            label: "Verified Agents",
            value: agents.filter((a) => a.verified).length,
            color: "text-green-600",
          },
          { label: "Reports", value: 3, color: "text-destructive" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-xl p-4 text-center"
          >
            <p className={`font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="listings" data-ocid="admin.tab">
        <TabsList className="mb-6">
          <TabsTrigger value="listings" data-ocid="admin.listings.tab">
            Listings
          </TabsTrigger>
          <TabsTrigger value="agents" data-ocid="admin.agents.tab">
            Agents
          </TabsTrigger>
          <TabsTrigger value="reports" data-ocid="admin.reports.tab">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <Table data-ocid="admin.listings.table">
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProps.map((p, i) => {
                const status = listingStatuses[p.id] || p.status;
                return (
                  <TableRow key={p.id} data-ocid={`admin.listing.row.${i + 1}`}>
                    <TableCell className="font-medium text-sm">
                      {p.title}
                    </TableCell>
                    <TableCell className="capitalize text-sm">
                      {p.type}
                    </TableCell>
                    <TableCell className="text-sm">{p.location.area}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === "approved"
                            ? "default"
                            : status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="capitalize text-xs"
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {status !== "approved" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 h-7 px-2 text-xs"
                            onClick={() =>
                              setListingStatuses((s) => ({
                                ...s,
                                [p.id]: "approved",
                              }))
                            }
                            data-ocid={`admin.listing.approve.${i + 1}`}
                          >
                            <CheckCircle size={13} className="mr-1" />
                            Approve
                          </Button>
                        )}
                        {status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive h-7 px-2 text-xs"
                            onClick={() =>
                              setListingStatuses((s) => ({
                                ...s,
                                [p.id]: "rejected",
                              }))
                            }
                            data-ocid={`admin.listing.reject.${i + 1}`}
                          >
                            <XCircle size={13} className="mr-1" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="agents">
          <div className="space-y-3">
            {agents.map((agent, i) => (
              <div
                key={agent.id}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
                data-ocid={`admin.agent.row.${i + 1}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback>{agent.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {agent.location} · {agent.listingCount} listings ·{" "}
                    {agent.reviewCount} reviews
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(agentVerified[agent.id] ?? agent.verified) ? (
                    <Badge className="verified-badge text-xs gap-1">
                      <ShieldCheck size={11} />
                      Verified
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                      onClick={() =>
                        setAgentVerified((v) => ({ ...v, [agent.id]: true }))
                      }
                      data-ocid={`admin.agent.verify.${i + 1}`}
                    >
                      Verify Agent
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-3">
            {[
              {
                title: "Suspicious listing: unrealistic price",
                property: "prop-5",
                reporter: "User A",
                status: "open",
              },
              {
                title: "Photos don't match actual property",
                property: "prop-8",
                reporter: "User B",
                status: "open",
              },
              {
                title: "Scam attempt by agent",
                property: "prop-11",
                reporter: "User C",
                status: "resolved",
              },
            ].map((r, i) => (
              <div
                key={r.property}
                className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
                data-ocid={`admin.report.row.${i + 1}`}
              >
                <Flag
                  size={18}
                  className={
                    r.status === "open"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Reported by {r.reporter}
                  </p>
                </div>
                <Badge
                  variant={r.status === "open" ? "destructive" : "secondary"}
                  className="text-xs capitalize"
                >
                  {r.status}
                </Badge>
                {r.status === "open" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7"
                    data-ocid={`admin.report.resolve.${i + 1}`}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
