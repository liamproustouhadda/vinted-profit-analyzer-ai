"use client";
import { useRef, useState } from "react";
import { PhotoItem } from "@/lib/types";

interface Props {
  photos: PhotoItem[];
  setPhotos: (p: PhotoItem[]) => void;
  maxPhotos?: number;
}

export default function PhotoUploader({ photos, setPhotos, maxPhotos = 10 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) {
      alert(`Maximum ${maxPhotos} photos atteint`);
      return;
    }
    const toAdd = fileArray.slice(0, remaining);

    const newPhotos: PhotoItem[] = toAdd.map((file, idx) => ({
      id: `ph_${Date.now()}_${idx}_${Math.random().toString(36).slice(2,6)}`,
      url: URL.createObjectURL(file),
      file,
      name: file.name,
      size: file.size,
      isPrimary: photos.length === 0 && idx === 0,
    }));

    setPhotos([...photos, ...newPhotos]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removePhoto = (id: string) => {
    const filtered = photos.filter(p => p.id !== id);
    if (filtered.length > 0 && !filtered.some(p => p.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    setPhotos(filtered);
  };

  const setPrimary = (id: string) => {
    setPhotos(photos.map(p => ({ ...p, isPrimary: p.id === id })));
  };

  const replacePhoto = (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setPhotos(photos.map(p => p.id === id ? { ...p, url: URL.createObjectURL(file), file, name: file.name, size: file.size } : p));
    };
    input.click();
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOverReorder = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newPhotos = [...photos];
    const [moved] = newPhotos.splice(dragIndex, 1);
    newPhotos.splice(index, 0, moved);
    setPhotos(newPhotos);
    setDragIndex(index);
  };

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`group relative rounded-[24px] border-2 border-dashed transition-all duration-300 ${
          dragOver ? 'border-violet-500 bg-violet-50 scale-[1.01]' : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50'
        }`}
      >
        <div className="p-8 md:p-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-2xl">📸</span>
          </div>
          <h3 className="text-[22px] font-bold tracking-tight mb-2">Analyse ton article</h3>
          <p className="text-[14px] text-zinc-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Ajoute jusqu'à {maxPhotos} photos pour obtenir une analyse plus précise. Glisse-dépose ou clique pour importer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 text-white text-[14px] font-semibold hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <span className="text-lg">+</span> Ajouter des photos
            </button>
            <label className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-zinc-200 text-zinc-900 text-[14px] font-semibold hover:bg-zinc-50 cursor-pointer transition-all">
              <span>📷</span> Prendre une photo
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            </label>
          </div>

          <p className="mt-5 text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
            JPG, PNG, WEBP • Max 10MB par photo • {photos.length}/{maxPhotos}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Gallery */}
      {photos.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-zinc-500">
              {photos.length} photo{photos.length > 1 ? 's' : ''} • Glisse pour réorganiser
            </h4>
            <button onClick={() => setPhotos([])} className="text-[12px] font-semibold text-zinc-500 hover:text-zinc-900 underline">
              Tout supprimer
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOverReorder(e, idx)}
                onDragEnd={() => setDragIndex(null)}
                className={`group relative rounded-2xl overflow-hidden bg-zinc-100 aspect-[4/5] border-2 transition-all cursor-grab active:cursor-grabbing ${
                  photo.isPrimary ? 'border-zinc-900 ring-2 ring-zinc-900 ring-offset-2' : 'border-transparent hover:border-zinc-200'
                } ${dragIndex === idx ? 'opacity-50 scale-95' : ''}`}
              >
                <img src={photo.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                
                {/* Primary badge */}
                {photo.isPrimary && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-bold tracking-wide">
                    PRINCIPALE
                  </div>
                )}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-[11px] font-bold shadow">
                  {idx + 1}
                </div>

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1.5">
                    <button onClick={() => setPrimary(photo.id)} className="w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center hover:scale-110 transition-transform" title="Définir principale">★</button>
                    <button onClick={() => replacePhoto(photo.id)} className="w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center hover:scale-110 transition-transform" title="Remplacer">↻</button>
                    <button onClick={() => removePhoto(photo.id)} className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center hover:scale-110 transition-transform" title="Supprimer">✕</button>
                  </div>
                </div>

                {/* Photo type hint */}
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[10px] font-semibold text-white/90 truncate">
                    {idx === 0 ? 'Vue générale' : idx === 1 ? 'Étiquette' : idx === 2 ? 'Logo' : idx === 3 ? 'Défaut' : 'Détails'}
                  </p>
                </div>
              </div>
            ))}

            {photos.length < maxPhotos && (
              <button
                onClick={() => inputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 aspect-[4/5] flex flex-col items-center justify-center gap-2 hover:border-zinc-300 hover:bg-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform">+</div>
                <span className="text-[11px] font-semibold text-zinc-500">Ajouter</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
