"use client";
import { useState } from "react";
import { X, Heart, Upload, Trash2, Loader2 } from "lucide-react";
import type { Plan } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { compressMultiple } from "@/lib/imageCompression";

interface CompleteModalProps {
  plan: Plan;
  onConfirm: (memory: Plan["memory"]) => void;
  onClose: () => void;
}

export default function CompleteModal({ plan, onConfirm, onClose }: CompleteModalProps) {
  const [note, setNote] = useState("");
  const [reflection, setReflection] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const MAX_PHOTOS = 5;
  const cat = CATEGORIES[plan.category];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (files.length + selected.length > MAX_PHOTOS) {
      alert(`Puedes subir hasta ${MAX_PHOTOS} fotos.`);
      return;
    }
    setFiles(prev => [...prev, ...selected]);
    const newPreviews = selected.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  async function uploadFiles(filesToUpload: File[]) {
    if (!filesToUpload.length) return [] as string[];
    
    // Comprimir imágenes antes de subir
    const compressedFiles = await compressMultiple(filesToUpload);
    
    const form = new FormData();
    compressedFiles.forEach(f => form.append('files', f));
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.urls as string[];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(45,31,38,0.4)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: "white" }}>
        {/* Header */}
        <div className="px-6 py-5 text-center"
          style={{ background: "linear-gradient(135deg, #FFF5F7, #F9EEF1)" }}>
          <div className="text-4xl mb-3">{cat.emoji}</div>
          <h2 className="font-display font-semibold text-xl mb-1" style={{ color: "#2D1F26" }}>
            ¡Lo hicieron! 🎉
          </h2>
          <p className="text-sm" style={{ color: "#8B7D82" }}>
            Guardá un recuerdo de <strong style={{ color: "#C9788A" }}>{plan.title}</strong>
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
              ¿Cómo estuvo? 💭
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Escribí algo lindo para recordar este momento..."
              className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm resize-none transition-all"
              style={{ borderColor: "#F0E0E4", color: "#2D1F26" }}
              onFocus={e => e.target.style.borderColor = "#C9788A"}
              onBlur={e => e.target.style.borderColor = "#F0E0E4"}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
              Reflexión ✨
            </label>
            <input
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="ej. Fue el mejor plan que hicimos..."
              className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm transition-all"
              style={{ borderColor: "#F0E0E4", color: "#2D1F26" }}
              onFocus={e => e.target.style.borderColor = "#C9788A"}
              onBlur={e => e.target.style.borderColor = "#F0E0E4"}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
              Agregar Fotos 📸
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-input"
            />
            <label
              htmlFor="photo-input"
              className="w-full px-4 py-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all"
              style={{ borderColor: "#F0E0E4", color: "#8B7D82" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#C9788A"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#F0E0E4"}
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Seleccionar fotos</span>
            </label>
          </div>

            {previews.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
                {previews.length} foto{previews.length !== 1 ? 's' : ''} seleccionada{previews.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {previews.map((photo, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden">
                    <img src={photo} alt={`preview-${idx}`} className="w-full h-24 object-cover" />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: "#F0E0E4", color: "#8B7D82" }}>
              Después
            </button>
            <button
              onClick={async () => {
                setIsLoading(true);
                try {
                  let uploaded: string[] = [];
                  if (files.length) uploaded = await uploadFiles(files);
                  const normalizedPhotos = uploaded.map((url, idx) => ({ id: `new-${Date.now()}-${idx}`, url }));
                  await onConfirm({
                    note,
                    reflection,
                    photos: normalizedPhotos,
                    completedAt: new Date().toISOString(),
                  });
                } catch (err) {
                  console.error('Error uploading photos', err);
                  alert('Error al subir fotos');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #C9788A, #E8A4B0)",
                boxShadow: "0 6px 20px rgba(201,120,138,0.35)",
              }}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" fill="white" />}
              {isLoading ? 'Guardando...' : 'Completar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
