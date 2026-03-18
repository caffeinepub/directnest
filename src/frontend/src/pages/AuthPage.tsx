import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Eye, EyeOff, Home, User, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type UserRole, useApp } from "../context/AppContext";

type Mode = "login" | "signup";

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "seeker",
    label: "Property Seeker",
    desc: "Browse & find properties",
    icon: <User className="w-5 h-5" />,
  },
  {
    value: "owner",
    label: "Property Owner",
    desc: "List your properties",
    icon: <Home className="w-5 h-5" />,
  },
  {
    value: "agent",
    label: "Real Estate Agent",
    desc: "Manage multiple listings",
    icon: <Building2 className="w-5 h-5" />,
  },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("seeker");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      try {
        const users: Record<string, any> = JSON.parse(
          localStorage.getItem("directnest_users") || "{}",
        );
        const entry = Object.values(users).find(
          (u: any) => u.user.email === loginEmail,
        );
        if (!entry) {
          toast.error("Invalid email or password");
          setLoading(false);
          return;
        }
        if ((entry as any).password !== loginPassword) {
          toast.error("Invalid email or password");
          setLoading(false);
          return;
        }
        login((entry as any).user);
        toast.success("Welcome back!");
        navigate({ to: "/" });
      } catch {
        toast.error("Login failed");
        setLoading(false);
      }
    }, 600);
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !email || !phone || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        phone,
        role,
      };
      try {
        const users: Record<string, any> = JSON.parse(
          localStorage.getItem("directnest_users") || "{}",
        );
        if (Object.values(users).some((u: any) => u.user.email === email)) {
          toast.error("Email already registered");
          setLoading(false);
          return;
        }
        users[newUser.id] = { user: newUser, password };
        localStorage.setItem("directnest_users", JSON.stringify(users));
        login(newUser);
        toast.success("Account created! Welcome to DirectNest.");
        navigate({ to: "/" });
      } catch {
        toast.error("Signup failed");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      <div className="bg-primary px-6 pt-14 pb-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display text-2xl font-bold text-primary-foreground">
            DirectNest
          </span>
        </div>
        <p className="text-primary-foreground/70 text-sm mt-1">
          Nigeria's trusted property marketplace
        </p>
      </div>

      <div className="flex-1 bg-background rounded-t-3xl -mt-4 px-5 pt-7 pb-8">
        <div className="flex bg-muted rounded-xl p-1 mb-6">
          <button
            type="button"
            data-ocid="auth.login_tab"
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === "login"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            data-ocid="auth.signup_tab"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === "signup"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                data-ocid="auth.email_input"
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  data-ocid="auth.password_input"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  data-ocid="auth.password_toggle"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showLoginPassword ? "Hide password" : "Show password"
                  }
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  data-ocid="auth.forgot_password_link"
                  onClick={() => navigate({ to: "/forgot-password" })}
                  className="text-primary text-sm hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <Button
              data-ocid="auth.submit_button"
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Log In"}
            </Button>
            <p className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-primary font-semibold"
              >
                Sign up
              </button>
            </p>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="e.g. Emeka Okafor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                data-ocid="auth.email_input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-phone">Phone Number</Label>
              <Input
                id="signup-phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  data-ocid="auth.password_input"
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  data-ocid="auth.password_toggle"
                  onClick={() => setShowSignupPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showSignupPassword ? "Hide password" : "Show password"
                  }
                >
                  {showSignupPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-1 gap-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      role === opt.value
                        ? "border-primary bg-secondary"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        role === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {opt.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {opt.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {opt.desc}
                      </p>
                    </div>
                    {role === opt.value && (
                      <UserCheck className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Button
              data-ocid="auth.submit_button"
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-primary font-semibold"
              >
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
