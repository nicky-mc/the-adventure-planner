import React, { useState } from 'react';
import { CharacterStats, Spell } from '../types';
import { updateCharacterDetails } from '../db';
import { Scroll, Plus, Trash2, CheckSquare, Square } from 'lucide-react';

interface SpellsListProps {
  stats: CharacterStats;
}

export const SpellsList: React.FC<SpellsListProps> = ({ stats }) => {
  const [newSpellName, setNewSpellName] = useState('');
  const [newSpellLevel, setNewSpellLevel] = useState(0);

  const addSpell = () => {
      if (!newSpellName.trim()) return;
      const newSpell: Spell = {
          id: Date.now(),
          name: newSpellName,
          level: newSpellLevel,
          prepared: false,
          used: false
      };
      const updatedSpells = [...(stats.spells || []), newSpell];
      updateCharacterDetails({ spells: updatedSpells });
      setNewSpellName('');
  };

  const removeSpell = (id: number) => {
      const updatedSpells = stats.spells.filter(s => s.id !== id);
      updateCharacterDetails({ spells: updatedSpells });
  };

  const togglePrepare = (id: number) => {
      const updatedSpells = stats.spells.map(s => s.id === id ? { ...s, prepared: !s.prepared } : s);
      updateCharacterDetails({ spells: updatedSpells });
  }

  const toggleUsed = (id: number) => {
      const updatedSpells = stats.spells.map(s => s.id === id ? { ...s, used: !s.used } : s);
      updateCharacterDetails({ spells: updatedSpells });
  }

  // Group by level
  const groupedSpells: Record<number, Spell[]> = {};
  (stats.spells || []).forEach(s => {
      if (!groupedSpells[s.level]) groupedSpells[s.level] = [];
      groupedSpells[s.level].push(s);
  });

  return (
    <div className="h-full flex flex-col bg-[#F5F5DC] p-4">
        <div className="flex gap-2 mb-4 border-b-2 border-stone-800 pb-2">
            <input 
                className="flex-1 bg-white border border-stone-400 p-1 font-merriweather text-sm"
                placeholder="Spell Name"
                value={newSpellName}
                onChange={e => setNewSpellName(e.target.value)}
            />
            <select 
                className="bg-white border border-stone-400 p-1 font-cinzel text-sm"
                value={newSpellLevel}
                onChange={e => setNewSpellLevel(parseInt(e.target.value))}
            >
                {[0,1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>Lvl {l}</option>)}
            </select>
            <button onClick={addSpell} className="bg-stone-800 text-white p-1 rounded">
                <Plus size={16} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {[0,1,2,3,4,5,6,7,8,9].map(lvl => {
                const spells = groupedSpells[lvl];
                if (!spells || spells.length === 0) return null;
                
                return (
                    <div key={lvl} className="border border-stone-400 bg-white/60 rounded p-2">
                        <h4 className="font-cinzel font-bold text-stone-800 border-b border-stone-300 mb-2">Level {lvl}</h4>
                        <div className="space-y-1">
                            {spells.map(spell => (
                                <div key={spell.id} className={`flex items-center justify-between group ${spell.used ? 'opacity-50 line-through' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => togglePrepare(spell.id!)} title="Prepared?">
                                            {spell.prepared ? <Scroll size={14} className="text-amber-700" /> : <Scroll size={14} className="text-stone-300" />}
                                        </button>
                                        <span className="font-merriweather text-sm">{spell.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {spell.prepared && (
                                            <button onClick={() => toggleUsed(spell.id!)} title="Cast Spell">
                                                {spell.used ? <CheckSquare size={14} /> : <Square size={14} />}
                                            </button>
                                        )}
                                        <button onClick={() => removeSpell(spell.id!)} className="opacity-0 group-hover:opacity-100 text-red-700">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
             {stats.spells?.length === 0 && (
                <p className="text-center font-merriweather italic text-stone-400">Grimoire is empty.</p>
             )}
        </div>
    </div>
  );
};