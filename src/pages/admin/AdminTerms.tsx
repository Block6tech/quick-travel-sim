import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Save } from "lucide-react";

export default function AdminTerms() {
  const [contentEn, setContentEn] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("terms_conditions")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setContentEn(data.content_en);
        setContentAr(data.content_ar);
        setExistingId(data.id);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (existingId) {
        const { error } = await supabase
          .from("terms_conditions")
          .update({ content_en: contentEn, content_ar: contentAr })
          .eq("id", existingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("terms_conditions")
          .insert({ content_en: contentEn, content_ar: contentAr })
          .select("id")
          .single();
        if (error) throw error;
        setExistingId(data.id);
      }
      toast.success("Terms & Conditions saved successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h1 className="text-xl font-bold">Terms & Conditions</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* English */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">English Version</label>
          <textarea
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
            rows={24}
            className="w-full p-3 rounded-lg bg-secondary text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
            placeholder="Enter English Terms & Conditions..."
          />
        </div>

        {/* Arabic */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">النسخة العربية (Arabic Version)</label>
          <textarea
            value={contentAr}
            onChange={(e) => setContentAr(e.target.value)}
            rows={24}
            dir="rtl"
            className="w-full p-3 rounded-lg bg-secondary text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
            placeholder="أدخل الشروط والأحكام بالعربية..."
          />
        </div>
      </div>
    </div>
  );
}
