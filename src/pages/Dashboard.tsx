import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { sampleActiveEsims } from "@/data/esim-data";

const Dashboard = () => {
  const navigate = useNavigate();
  const esims = sampleActiveEsims;

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex items-center justify-between"
        >
          <h1 className="text-xl font-bold tracking-display">My eSIMs</h1>
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center btn-press"
          >
            <Plus className="w-4 h-4 text-primary-foreground" />
          </button>
        </motion.div>

        {esims.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-center py-16 space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
              <span className="text-2xl">📡</span>
            </div>
            <div>
              <p className="text-sm font-medium">No eSIMs yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Buy your first eSIM and it will appear here.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="h-10 px-6 bg-foreground text-primary-foreground font-medium rounded-lg btn-press text-sm touch-target"
            >
              Browse Plans
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {esims.map((esim, i) => {
              const percentage = (esim.dataUsed / esim.dataTotal) * 100;
              const remaining = esim.dataTotal - esim.dataUsed;
              const daysLeft = Math.max(
                0,
                Math.ceil(
                  (new Date(esim.expiresAt).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )
              );

              return (
                <motion.div
                  key={esim.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.05 + i * 0.04,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                  className="bg-card rounded-lg shadow-card p-4 space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-foreground flex items-center justify-center">
                        <span className="text-primary-foreground text-xs font-bold font-mono-data">
                          {esim.countryCode}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{esim.country}</p>
                        <p className="text-xs text-muted-foreground font-mono-data">
                          {esim.plan}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm tracking-wider ${
                        esim.status === "active"
                          ? "bg-foreground text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {esim.status}
                    </span>
                  </div>

                  {/* Data Usage */}
                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold font-mono-data tracking-display">
                          {remaining.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          GB left
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {daysLeft} days remaining
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                        className="h-full bg-foreground rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono-data">
                      {esim.dataUsed.toFixed(1)} GB of {esim.dataTotal} GB used
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/")}
                      className="flex-1 h-10 bg-foreground text-primary-foreground font-medium rounded-lg btn-press text-sm touch-target"
                    >
                      Top Up
                    </button>
                    <button className="h-10 px-4 bg-secondary text-secondary-foreground font-medium rounded-lg btn-press text-sm touch-target">
                      Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
