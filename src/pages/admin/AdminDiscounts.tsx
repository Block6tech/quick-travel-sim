import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DiscountCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  times_used: number;
  min_order_amount: number | null;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

export default function AdminDiscounts() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    max_uses: "",
    min_order_amount: "",
    expires_at: "",
  });

  const loadCodes = async () => {
    const { data } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setCodes((data || []) as DiscountCode[]);
  };

  useEffect(() => { loadCodes(); }, []);

  const handleCreate = async () => {
    if (!form.code.trim()) return toast.error("Code is required");
    const { error } = await supabase.from("discount_codes").insert({
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      min_order_amount: form.min_order_amount ? parseFloat(form.min_order_amount) : null,
      expires_at: form.expires_at || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Discount code created");
    setShowForm(false);
    setForm({ code: "", discount_type: "percentage", discount_value: 10, max_uses: "", min_order_amount: "", expires_at: "" });
    loadCodes();
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("discount_codes").update({ active: !active }).eq("id", id);
    loadCodes();
  };

  const deleteCode = async (id: string) => {
    await supabase.from("discount_codes").delete().eq("id", id);
    toast.success("Deleted");
    loadCodes();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-display">Discount Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="h-8 px-3 flex items-center gap-1.5 bg-foreground text-primary-foreground rounded-md text-xs font-medium btn-press"
        >
          <Plus className="w-3.5 h-3.5" />
          New Code
        </button>
      </div>

      {showForm && (
        <div className="p-4 rounded-lg border border-border bg-card space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase">Code</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="WELCOME10" className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-mono-data" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase">Type</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase">Value</label>
              <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: +e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-mono-data" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase">Max Uses</label>
              <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="Unlimited" className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-mono-data" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase">Min Order ($)</label>
              <input type="number" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} placeholder="0" className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-mono-data" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-muted-foreground uppercase">Expires At</label>
              <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="h-8 px-4 bg-foreground text-primary-foreground rounded-md text-xs font-medium btn-press">Create</button>
            <button onClick={() => setShowForm(false)} className="h-8 px-4 bg-secondary text-secondary-foreground rounded-md text-xs font-medium btn-press">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary">
              <tr className="text-muted-foreground">
                <th className="text-start px-3 py-2 font-medium">Code</th>
                <th className="text-start px-3 py-2 font-medium">Discount</th>
                <th className="text-start px-3 py-2 font-medium">Uses</th>
                <th className="text-start px-3 py-2 font-medium">Min Order</th>
                <th className="text-start px-3 py-2 font-medium">Expires</th>
                <th className="text-start px-3 py-2 font-medium">Status</th>
                <th className="text-start px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No discount codes</td></tr>
              ) : (
                codes.map((c) => (
                  <tr key={c.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-3 py-2 font-mono-data font-bold">{c.code}</td>
                    <td className="px-3 py-2 font-mono-data">
                      {c.discount_type === "percentage" ? `${c.discount_value}%` : `$${c.discount_value}`}
                    </td>
                    <td className="px-3 py-2 font-mono-data">
                      {c.times_used}{c.max_uses ? `/${c.max_uses}` : ""}
                    </td>
                    <td className="px-3 py-2 font-mono-data">{c.min_order_amount ? `$${c.min_order_amount}` : "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => toggleActive(c.id, c.active)} className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-sm ${c.active ? "bg-foreground text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                        {c.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => deleteCode(c.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
