import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Trash2, Plus, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FeaturesList: React.FC = () => {
  const feats = useLiveQuery(() => db.feats.orderBy('createdAt').toArray());
  
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'FEAT' | 'CLASS_FEATURE'>('FEAT');

  const handleAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!newTitle.trim()) return;
      await db.feats.add({
          title: newTitle,
          description: newDesc,
          type: newType,
          createdAt: Date.now()
      });
      setNewTitle('');
      setNewDesc('');
      setShowAdd(false);
  };

  const deleteFeat = (id: number) => db.feats.delete(id);

  return (
    <div className="h-full flex flex-col p-4 bg-[#F5F5DC]">
        <div className="flex justify-between items-center mb-4 border-b-2 border-stone-800 pb-2">
            <h3 className="font-cinzel font-bold text-lg text-stone-900 flex items-center gap-2">
                <Award size={18} /> Features & Feats
            </h3>
            <button 
                onClick={() => setShowAdd(!showAdd)}
                className="bg-stone-800 text-[#F5F5DC] p-1 rounded hover:bg-stone-700"
            >
                <Plus size={16} />
            </button>
        </div>

        {showAdd && (
            <form onSubmit={handleAdd} className="bg-stone-200/50 p-3 rounded mb-4 border border-stone-300">
                <input 
                    placeholder="Feature Name" 
                    className="w-full mb-2 p-1 border border-stone-400 bg-white font-cinzel text-sm font-bold"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    className="w-full mb-2 p-1 border border-stone-400 bg-white font-merriweather text-xs h-16 resize-none"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                />
                <div className="flex justify-between items-center">
                    <select 
                        value={newType} 
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="bg-white border border-stone-400 text-xs font-merriweather p-1"
                    >
                        <option value="FEAT">Feat</option>
                        <option value="CLASS_FEATURE">Class Feature</option>
                    </select>
                    <button type="submit" className="text-xs font-bold font-cinzel bg-stone-800 text-white px-3 py-1 rounded">
                        Unlock
                    </button>
                </div>
            </form>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
            <AnimatePresence>
                {feats?.map(feat => (
                    <motion.div 
                        key={feat.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border-2 border-double border-stone-400 p-3 rounded-sm shadow-sm group relative"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            {feat.type === 'CLASS_FEATURE' ? <Star size={14} className="text-blue-800" /> : <Award size={14} className="text-amber-700" />}
                            <h4 className="font-cinzel font-bold text-sm text-stone-900">{feat.title}</h4>
                        </div>
                        <p className="font-merriweather text-xs text-stone-700 leading-snug">
                            {feat.description}
                        </p>
                         <button 
                            onClick={() => deleteFeat(feat.id!)}
                            className="absolute top-2 right-2 text-stone-300 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={12} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
            {feats?.length === 0 && <p className="text-center font-merriweather italic text-stone-400 text-xs mt-10">No features unlocked yet.</p>}
        </div>
    </div>
  );
};