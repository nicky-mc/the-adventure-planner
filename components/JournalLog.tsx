import React, { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addJournalEntry, deleteJournalEntry } from '../db';
import { Feather, Save, Image as ImageIcon, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const JournalLog: React.FC = () => {
  const entries = useLiveQuery(() => 
    db.journal.reverse().sortBy('createdAt')
  );
  
  const [content, setContent] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!content.trim() && !imageBase64) return;
    await addJournalEntry(content, imageBase64 || undefined);
    setContent('');
    setImageBase64(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Write Area */}
      <div className="p-4 bg-[#F5F5DC] border-b-4 border-double border-stone-400/50">
        <h3 className="font-cinzel font-bold text-lg text-stone-900 mb-2 flex items-center gap-2">
            <Feather size={18} /> New Entry
        </h3>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Record your deeds..."
            className="w-full h-24 p-3 bg-white border-2 border-stone-300 rounded-sm font-merriweather resize-none focus:outline-none focus:border-stone-600 shadow-inner custom-scrollbar text-sm"
          />
          
          {/* Image Preview Area */}
          {imageBase64 && (
            <div className="absolute top-2 right-2 w-16 h-16 border-2 border-stone-300 bg-stone-100 shadow-sm group">
                <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                <button 
                    onClick={() => setImageBase64(null)}
                    className="absolute -top-2 -right-2 bg-red-800 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={10} />
                </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-2">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-xs font-bold font-cinzel text-stone-600 hover:text-stone-900"
            >
                <ImageIcon size={14} /> Attach Sketch
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
            />

            <button
              onClick={handleSave}
              disabled={!content.trim() && !imageBase64}
              className="bg-stone-800 text-[#F5F5DC] px-4 py-1 rounded-sm hover:bg-stone-700 disabled:opacity-50 transition-all shadow-sm font-cinzel text-xs font-bold flex items-center gap-2"
            >
              <Save size={14} /> Scribe
            </button>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto space-y-6 p-4 custom-scrollbar bg-[#F5F5DC]">
        {entries?.map((entry) => (
          <article key={entry.id} className="relative group bg-white/50 p-3 rounded-sm border border-transparent hover:border-stone-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] font-cinzel font-bold text-stone-500 uppercase tracking-widest">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
               <span className="text-[10px] font-cinzel text-stone-400">
                {new Date(entry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
           
            {entry.image && (
                <div className="mb-3 p-1 bg-white border border-stone-300 shadow-sm rotate-1 w-fit max-w-full">
                    <img src={entry.image} alt="Journal attachment" className="max-h-48 object-contain" />
                </div>
            )}

            <p className="font-merriweather text-stone-800 text-sm whitespace-pre-wrap leading-relaxed">
              {entry.content}
            </p>
            
            <button
              onClick={() => deleteJournalEntry(entry.id!)}
              className="absolute top-2 right-2 text-stone-300 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete Entry"
            >
              <Trash2 size={14} />
            </button>
          </article>
        ))}
        {entries?.length === 0 && (
            <div className="h-full flex items-center justify-center text-stone-400 flex-col gap-2">
                <Feather size={32} className="opacity-20" />
                <p className="font-merriweather italic text-sm">The chronicles are empty.</p>
            </div>
        )}
      </div>
    </div>
  );
};