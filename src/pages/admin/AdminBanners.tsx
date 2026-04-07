import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Pencil, GripVertical, Eye, EyeOff, Upload, X, Check } from "lucide-react";
import { toast } from "sonner";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  title_ar: string;
  subtitle_ar: string;
  image_url: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export default function AdminBanners() {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", title_ar: "", subtitle_ar: "", image_url: "", sort_order: 0, active: true });

  const load = async () => {
    const { data } = await supabase
      .from("banner_slides")
      .select("*")
      .order("sort_order", { ascending: true });
    setSlides((data || []) as BannerSlide[]);
  };

  useEffect(() => { load(); }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("banner-images").upload(path, file);
    setUploading(false);
    if (error) { toast.error("Upload failed"); return null; }
    const { data } = supabase.storage.from("banner-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setForm((f) => ({ ...f, image_url: url }));
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    const { error } = await supabase.from("banner_slides").insert({
      title: form.title,
      subtitle: form.subtitle,
      title_ar: form.title_ar,
      subtitle_ar: form.subtitle_ar,
      image_url: form.image_url,
      sort_order: form.sort_order || slides.length + 1,
      active: form.active,
    });
    if (error) return toast.error(error.message);
    toast.success("Slide created");
    setForm({ title: "", subtitle: "", title_ar: "", subtitle_ar: "", image_url: "", sort_order: 0, active: true });
    setShowForm(false);
    load();
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from("banner_slides").update({
      title: form.title,
      subtitle: form.subtitle,
      title_ar: form.title_ar,
      subtitle_ar: form.subtitle_ar,
      image_url: form.image_url,
      sort_order: form.sort_order,
      active: form.active,
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Slide updated");
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    const { error } = await supabase.from("banner_slides").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Slide deleted");
    load();
  };

  const toggleActive = async (slide: BannerSlide) => {
    await supabase.from("banner_slides").update({ active: !slide.active }).eq("id", slide.id);
    load();
  };

  const startEdit = (slide: BannerSlide) => {
    setEditing(slide.id);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      title_ar: slide.title_ar,
      subtitle_ar: slide.subtitle_ar,
      image_url: slide.image_url,
      sort_order: slide.sort_order,
      active: slide.active,
    });
  };

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    const reordered = arrayMove(slides, oldIndex, newIndex);
    setSlides(reordered);
    // Update sort_order for all items
    const updates = reordered.map((s, i) =>
      supabase.from("banner_slides").update({ sort_order: i + 1 }).eq("id", s.id)
    );
    await Promise.all(updates);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Banner Slides</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage homepage banner carousel</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: "", subtitle: "", title_ar: "", subtitle_ar: "", image_url: "", sort_order: slides.length + 1, active: true }); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" /> Add Slide
        </button>
      </div>

      {/* Form */}
      {(showForm || editing) && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-medium">{editing ? "Edit Slide" : "New Slide"}</h3>

          {/* Image upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Image</label>
            {form.image_url ? (
              <div className="relative w-32 h-20 rounded-md overflow-hidden bg-secondary">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={() => setForm((f) => ({ ...f, image_url: "" }))} className="absolute top-1 right-1 w-5 h-5 bg-background/80 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-3 py-2 rounded-md border border-dashed border-border cursor-pointer hover:bg-secondary/50 transition-colors">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{uploading ? "Uploading..." : "Upload image"}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Title (English)</label>
              <textarea
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                rows={2}
                className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Stay connected,&#10;anywhere you go"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Subtitle (English)</label>
              <textarea
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                rows={2}
                className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Instant eSIM activation."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">العنوان (عربي)</label>
              <textarea
                value={form.title_ar}
                onChange={(e) => setForm((f) => ({ ...f, title_ar: e.target.value }))}
                rows={2}
                dir="rtl"
                className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="ابقَ متصلاً،&#10;أينما ذهبت"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">الوصف (عربي)</label>
              <textarea
                value={form.subtitle_ar}
                onChange={(e) => setForm((f) => ({ ...f, subtitle_ar: e.target.value }))}
                rows={2}
                dir="rtl"
                className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="تفعيل فوري لشريحة eSIM."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="rounded" />
                <span className="text-xs font-medium">Active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => editing ? handleUpdate(editing) : handleCreate()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90"
            >
              <Check className="w-3.5 h-3.5" /> {editing ? "Save" : "Create"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Slides list with drag-and-drop */}
      <DndSortableList
        slides={slides}
        onReorder={handleReorder}
        onToggleActive={toggleActive}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

// --- Drag-and-drop sortable list ---

function DndSortableList({
  slides,
  onReorder,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  slides: BannerSlide[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onToggleActive: (slide: BannerSlide) => void;
  onEdit: (slide: BannerSlide) => void;
  onDelete: (id: string) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    onReorder(oldIndex, newIndex);
  };

  return (
    <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
      {slides.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No banner slides yet</p>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {slides.map((slide, i) => (
            <SortableSlideRow
              key={slide.id}
              slide={slide}
              index={i}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableSlideRow({
  slide,
  index,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  slide: BannerSlide;
  index: number;
  onToggleActive: (slide: BannerSlide) => void;
  onEdit: (slide: BannerSlide) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 px-4 py-3 bg-card">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none p-0.5">
        <GripVertical className="w-4 h-4 text-muted-foreground/40" />
      </button>
      <div className="w-16 h-10 rounded-md overflow-hidden bg-secondary flex-shrink-0">
        {slide.image_url ? (
          <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-[10px]">No img</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{slide.title.replace(/\n/g, " ")}</p>
        <p className="text-xs text-muted-foreground truncate">{slide.subtitle}</p>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">#{index + 1}</span>
      <button onClick={() => onToggleActive(slide)} className="p-1.5 rounded-md hover:bg-secondary transition-colors" title={slide.active ? "Active" : "Inactive"}>
        {slide.active ? <Eye className="w-3.5 h-3.5 text-foreground" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      <button onClick={() => onEdit(slide)} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
      <button onClick={() => onDelete(slide.id)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors">
        <Trash2 className="w-3.5 h-3.5 text-destructive" />
      </button>
    </div>
  );
}
