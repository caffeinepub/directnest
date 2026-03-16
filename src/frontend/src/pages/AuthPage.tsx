import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [role, setRole] = useState<"seeker" | "owner" | "agent" | "admin">(
    "seeker",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    login({ id: "user-me", name: email.split("@")[0] || "User", email, role });
    navigate("/home");
  };

  const handleSignup = () => {
    login({ id: "user-me", name: name || "User", email, role });
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Home size={24} className="text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold">DirectNest</h1>
          <p className="text-muted-foreground mt-1">
            Nigeria's trusted property marketplace
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
          <Tabs defaultValue="login">
            <TabsList className="w-full mb-6" data-ocid="auth.tab">
              <TabsTrigger
                value="login"
                className="flex-1"
                data-ocid="auth.login.tab"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="flex-1"
                data-ocid="auth.signup.tab"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label>Email / Phone</Label>
                <Input
                  placeholder="Enter email or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="auth.login.email.input"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  data-ocid="auth.login.password.input"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleLogin}
                data-ocid="auth.login.submit_button"
              >
                Login
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <button type="button" className="text-primary hover:underline">
                  Forgot password?
                </button>
              </p>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-ocid="auth.signup.name.input"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="auth.signup.email.input"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="+234 800 000 0000"
                  data-ocid="auth.signup.phone.input"
                />
              </div>
              <div className="space-y-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["seeker", "owner", "agent", "admin"] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-colors ${
                        role === r
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setRole(r)}
                      data-ocid={`auth.role.${r}.button`}
                    >
                      {r === "seeker"
                        ? "Property Seeker"
                        : r === "owner"
                          ? "Property Owner"
                          : r === "agent"
                            ? "Real Estate Agent"
                            : "Admin"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Create password"
                  data-ocid="auth.signup.password.input"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSignup}
                data-ocid="auth.signup.submit_button"
              >
                Create Account
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
