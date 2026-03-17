import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { EsimPlan } from "@/data/esim-data";

const Installation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as EsimPlan | undefined;
  const [copied, setCopied] = useState(false);

  const smdpAddress = "smdp.io.simlink.com";
  const activationCode = "K2-29FJ-LKSD9";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { step: "1", title: "Open Settings", desc: "Go to Settings → Cellular → Add eSIM" },
    { step: "2", title: "Scan QR Code", desc: "Point your camera at the QR code below" },
    { step: "3", title: "Confirm & Activate", desc: "Tap 'Add Cellular Plan' when prompted" },
    { step: "4", title: "Turn on Data Roaming", desc: "Settings → Cellular → your new plan → Data Roaming → On" },
  ];

  return (
    <AppLayout showBack={false} showNav={false}>
      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* Success */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mx-auto"
          >
            <Check className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
          </motion.div>
          <h1 className="text-xl font-bold tracking-display">Purchase complete!</h1>
          <p className="text-sm text-muted-foreground leading-body">
            Your eSIM for {plan?.country || "your destination"} is ready to install.
            <br />
            It takes about 2 minutes.
          </p>
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-48 h-48 bg-foreground rounded-xl flex items-center justify-center p-4">
            {/* Simulated QR pattern */}
            <div className="w-full h-full bg-primary-foreground rounded-md grid grid-cols-7 grid-rows-7 gap-[2px] p-2">
              {Array.from({ length: 49 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-[1px] ${
                    Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Scan with your phone camera
          </p>
        </motion.div>

        {/* Manual Install */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-3"
        >
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Or enter manually
          </h2>
          <div className="bg-card rounded-lg shadow-card divide-y divide-border">
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">SM-DP+ Address</p>
                <p className="text-xs font-mono-data mt-0.5">{smdpAddress}</p>
              </div>
              <button
                onClick={() => handleCopy(smdpAddress)}
                className="p-2 rounded-md hover:bg-secondary transition-colors btn-press"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Activation Code</p>
                <p className="text-xs font-mono-data mt-0.5">{activationCode}</p>
              </div>
              <button
                onClick={() => handleCopy(activationCode)}
                className="p-2 rounded-md hover:bg-secondary transition-colors btn-press"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-3"
        >
          <h2 className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Install in 2 minutes
          </h2>
          <div className="space-y-3">
            {steps.map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-foreground text-[10px] font-bold font-mono-data">
                    {s.step}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground leading-body">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <button className="w-full h-12 bg-secondary text-secondary-foreground font-medium rounded-lg btn-press transition-all duration-200 touch-target text-sm flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Watch how to install
          </button>
        </motion.div>

        {/* Done */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full h-12 bg-foreground text-primary-foreground font-semibold rounded-lg btn-press transition-all duration-200 touch-target text-sm"
          >
            Go to My eSIMs
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Installation;
