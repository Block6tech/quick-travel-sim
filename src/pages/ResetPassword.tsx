import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      // Not a valid recovery link — user might have navigated here directly
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t.passwordTooShort);
      return;
    }
    if (password !== confirmPw) {
      toast.error(t.passwordMismatch);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setDone(true);
      setTimeout(() => navigate("/account"), 2000);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center max-w-[480px] mx-auto px-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
          </div>
          <h1 className="text-xl font-bold tracking-display">{t.authPasswordUpdated || "Password updated!"}</h1>
          <p className="text-sm text-muted-foreground">{t.authRedirecting || "Redirecting..."}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[480px] mx-auto">
      <main className="flex-1 px-6 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full space-y-6"
        >
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold tracking-display">{t.authNewPassword || "Set new password"}</h1>
            <p className="text-sm text-muted-foreground">{t.authNewPasswordSub || "Enter your new password below"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t.authNewPasswordLabel || "New password"}</label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 ps-10 pe-12 bg-secondary rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute end-3 top-1/2 -translate-y-1/2 touch-target">
                  {showPw ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t.confirmPassword}</label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 ps-10 pe-4 bg-secondary rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-foreground text-primary-foreground font-semibold rounded-lg btn-press transition-all touch-target text-sm disabled:opacity-50"
            >
              {loading ? "..." : (t.authUpdatePassword || "Update password")}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default ResetPassword;
