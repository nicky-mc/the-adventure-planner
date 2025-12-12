import React, { useState, useEffect } from 'react';
import { CharacterStats } from '../types';
import { motion } from 'framer-motion';
import { updateCharacterDetails } from '../db';
import { Edit2 } from 'lucide-react';

interface CharacterHeaderProps {
  stats: CharacterStats;
}

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({ stats }) => {
  const nextLevelXp = stats.level * 100;
  const progressPercent = Math.min((stats.xp / nextLevelXp) * 100, 100);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(stats.name);
  const [classType, setClassType] = useState(stats.classType);

  // Sync state if props change externally
  useEffect(() => {
    setName(stats.name);
    setClassType(stats.classType);
  }, [stats]);

  const handleBlur = () => {
    setIsEditing(false);
    updateCharacterDetails({ name, classType });
  };

  return (
    <header className="bg-[#E8E4C9] border-b-4 border-double border-stone-600 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm relative">
      
      {/* Identity Block */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-16 h-16 bg-stone-800 rounded-lg flex items-center justify-center border-2 border-[#D4AF37] shrink-0">
           <span className="text-3xl">🛡️</span>
        </div>
        <div className="flex-1">
          {isEditing ? (
             <div className="flex flex-col gap-1">
                 <input 
                    className="bg-stone-100 border border-stone-400 px-1 font-cinzel font-bold text-xl text-stone-900 w-full" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    onBlur={handleBlur}
                    autoFocus
                 />
                 <input 
                    className="bg-stone-100 border border-stone-400 px-1 font-merriweather text-sm text-stone-800 w-full" 
                    value={classType} 
                    onChange={(e) => setClassType(e.target.value)} 
                    onBlur={handleBlur}
                 />
             </div>
          ) : (
            <div className="group cursor-pointer" onClick={() => setIsEditing(true)}>
                 <div className="flex items-center gap-2">
                    <h1 className="font-cinzel font-bold text-2xl md:text-3xl text-stone-900 leading-none hover:text-stone-700">{stats.name}</h1>
                    <Edit2 size={12} className="opacity-0 group-hover:opacity-50 text-stone-500" />
                 </div>
                 <p className="font-merriweather text-stone-600 italic">Level {stats.level} {stats.classType}</p>
            </div>
          )}
        </div>
      </div>

      {/* XP Bar */}
      <div className="flex-1 w-full max-w-xl">
        <div className="flex justify-between text-sm font-cinzel font-bold text-stone-700 mb-1">
          <span>Experience</span>
          <span>{stats.xp} / {nextLevelXp} XP</span>
        </div>
        <div className="w-full h-4 bg-stone-300 border border-stone-500 rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-600 to-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
        </div>
      </div>
    </header>
  );
};