import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Languages } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

type AuthMode = "login" | "register" | "forgot";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { t, isRTL, locale, setLocale } = useLanguage();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      // Import supabase for password reset
      const { supabase } = await import("@/integrations/supabase/client");
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t.authResetSent || "Password reset link sent! Check your email.");
      }
      return;
    }

    if (mode === "register") {
      if (password.length < 6) {
        toast.error(t.passwordTooShort);
        return;
      }
      if (password !== confirmPw) {
        toast.error(t.passwordMismatch);
        return;
      }
    }

    setLoading(true);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        toast.error(error);
      } else {
        navigate("/account");
      }
    } else {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        toast.error(error);
      } else {
        toast.success(t.authCheckEmail || "Check your email to verify your account.");
      }
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result?.error) {
      toast.error(String(result.error));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[480px] mx-auto">
      {/* Header */}
      <header className="px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="touch-target btn-press" aria-label="Back">
          <BackArrow className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => setLocale(locale === "en" ? "ar" : "en")}
          className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-accent/50 transition-colors btn-press touch-target"
          aria-label="Switch language"
        >
          <Languages className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{locale === "en" ? "عربي" : "EN"}</span>
        </button>
      </header>

      <main className="flex-1 px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-6"
        >
          {/* Logo & title */}
          <div className="text-center space-y-2 pt-4">
            <div className="flex justify-center gap-2 items-center">
              <img src="/logo.png" alt="CamelSim" className="w-8 h-8 dark:hidden" />
              <img src="/logo-dark.png" alt="CamelSim" className="w-8 h-8 hidden dark:block" />
            </div>
            <h1 className="text-xl font-bold tracking-display">
              {mode === "login" ? (t.authLogin || "Welcome back") : mode === "register" ? (t.authRegister || "Create account") : (t.authForgot || "Reset password")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? (t.authLoginSub || "Sign in to manage your eSIMs")
                : mode === "register"
                ? (t.authRegisterSub || "Get started with CamelSim")
                : (t.authForgotSub || "We'll send you a reset link")}
            </p>
          </div>

          {/* Google button */}
          {mode !== "forgot" && (
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-lg border border-border bg-card font-medium text-sm btn-press touch-target transition-colors hover:bg-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.01 24.01 0 000 21.56l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {t.authGoogle || "Continue with Google"}
            </button>
          )}

          {mode !== "forgot" && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{t.authOr || "or"}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t.emailForReceipt}</label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full h-12 ps-10 pe-4 bg-secondary rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full h-12 ps-10 pe-12 bg-secondary rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute end-3 top-1/2 -translate-y-1/2 touch-target">
                    {showPw ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            )}

            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t.confirmPassword}</label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder={t.confirmPasswordPlaceholder}
                    className="w-full h-12 ps-10 pe-4 bg-secondary rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                </div>
              </div>
            )}

            {mode === "login" && (
              <button type="button" onClick={() => setMode("forgot")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t.authForgotLink || "Forgot password?"}
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-foreground text-primary-foreground font-semibold rounded-lg btn-press transition-all touch-target text-sm disabled:opacity-50"
            >
              {loading
                ? "..."
                : mode === "login"
                ? (t.authLoginBtn || "Sign in")
                : mode === "register"
                ? (t.authRegisterBtn || "Create account")
                : (t.authResetBtn || "Send reset link")}
            </button>
          </form>

          {/* Switch mode */}
          <div className="text-center text-sm">
            {mode === "login" ? (
              <p className="text-muted-foreground">
                {t.authNoAccount || "Don't have an account?"}{" "}
                <button onClick={() => setMode("register")} className="text-foreground font-medium underline underline-offset-2">
                  {t.authRegisterBtn || "Create account"}
                </button>
              </p>
            ) : mode === "register" ? (
              <p className="text-muted-foreground">
                {t.authHaveAccount || "Already have an account?"}{" "}
                <button onClick={() => setMode("login")} className="text-foreground font-medium underline underline-offset-2">
                  {t.authLoginBtn || "Sign in"}
                </button>
              </p>
            ) : (
              <button onClick={() => setMode("login")} className="text-foreground font-medium underline underline-offset-2">
                {t.authBackToLogin || "Back to sign in"}
              </button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Auth;
