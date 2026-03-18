import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Home,
  KeyRound,
  MailCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const users: Record<string, any> = JSON.parse(
        localStorage.getItem("directnest_users") || "{}",
      );
      const entry = Object.entries(users).find(
        ([, v]: [string, any]) => v.user.email === forgotEmail,
      );
      setLoading(false);
      if (entry) {
        setUserId(entry[0]);
      }
      // Always proceed to step 2 — don't leak account existence
      setStep(2);
    }, 600);
  }

  function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (userId) {
        const users: Record<string, any> = JSON.parse(
          localStorage.getItem("directnest_users") || "{}",
        );
        if (users[userId]) {
          users[userId].password = newPassword;
          localStorage.setItem("directnest_users", JSON.stringify(users));
        }
      }
      setLoading(false);
      setStep(3);
    }, 600);
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
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

      {/* Content card */}
      <div className="flex-1 bg-background rounded-t-3xl -mt-4 px-5 pt-7 pb-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    1
                  </span>
                </div>
                <div className="flex-1 h-1 rounded-full bg-muted">
                  <div className="h-full w-1/2 bg-primary rounded-full" />
                </div>
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">
                    2
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-1">
                Forgot Password?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your registered email and we'll help you set a new
                password.
              </p>

              <form onSubmit={handleStep1} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email">Email address</Label>
                  <Input
                    id="forgot-email"
                    data-ocid="forgot_password.email_input"
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <Button
                  data-ocid="forgot_password.submit_button"
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Continue"}
                </Button>
              </form>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  data-ocid="forgot_password.back_link"
                  onClick={() => navigate({ to: "/auth" })}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    1
                  </span>
                </div>
                <div className="flex-1 h-1 rounded-full bg-primary" />
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    2
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  New Password
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Choose a strong new password for your account.
              </p>

              <form onSubmit={handleStep2} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      data-ocid="forgot_password.new_password_input"
                      type={showNew ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      data-ocid="forgot_password.new_password_toggle"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showNew ? "Hide password" : "Show password"}
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      data-ocid="forgot_password.confirm_password_input"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      data-ocid="forgot_password.confirm_password_toggle"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password strength hint */}
                {newPassword.length > 0 && (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-colors ${
                          newPassword.length >= i * 3
                            ? newPassword.length >= 10
                              ? "bg-primary"
                              : "bg-amber-400"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <Button
                  data-ocid="forgot_password.reset_button"
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  data-ocid="forgot_password.back_link"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center pt-10"
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-5">
                <MailCheck className="w-9 h-9 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Password Reset!
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-xs">
                Your password has been updated. You can now log in with your new
                password.
              </p>
              <Button
                data-ocid="forgot_password.go_to_login_button"
                className="w-full"
                onClick={() => {
                  toast.success("Password updated — please log in");
                  navigate({ to: "/auth" });
                }}
              >
                Go to Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
