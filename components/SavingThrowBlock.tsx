import React, { useState } from 'react';
import { CharacterStats } from '../types';
import { updateCharacterDetails, getMod } from '../db';
import { ShieldAlert, Zap, BrainCircuit } from 'lucide-react';

interface SavingThrowBlockProps {
  stats: CharacterStats;
}

export const SavingThrowBlock: React.FC<SavingThrowBlockProps> = ({ stats }) => {
  const [editing, setEditing] = useState<string | null>(null);

  // Helper to get total score
  const getScore = (base: number, temp: number) => base + (temp || 0);

  const saves = [
    { 
        name: 'Fortitude', 
        base: stats.baseFort, 
        misc: stats.miscFort, 
        abilityScore: getScore(stats.con, stats.conTemp), 
        abilityName: 'CON', 
        icon: <ShieldAlert size={14} />, 
        keys: ['baseFort', 'miscFort'] 
    },
    { 
        name: 'Reflex', 
        base: stats.baseRef, 
        misc: stats.miscRef, 
        abilityScore: getScore(stats.dex, stats.dexTemp), 
        abilityName: 'DEX', 
        icon: <Zap size={14} />, 
        keys: ['baseRef', 'miscRef'] 
    },
    { 
        name: 'Will', 
        base: stats.baseWill, 
        misc: stats.miscWill, 
        abilityScore: getScore(stats.wis, stats.wisTemp), 
        abilityName: 'WIS', 
        icon: <BrainCircuit size={14} />, 
        keys: ['baseWill', 'miscWill'] 
    },
  ];

  return (
    <div className="bg-[#E8E4C9] p-2 border-t-2 border-stone-400 mt-2">
      <h3 className="font-cinzel font-bold text-sm text-center mb-2 border-b border-stone-600">Saving Throws</h3>
      <div className="flex flex-col gap-2">
        <div className="flex text-[10px] font-merriweather font-bold text-stone-600 text-center">
            <span className="w-16 text-left pl-1">Save</span>
            <span className="w-8">Total</span>
            <span className="w-8">Base</span>
            <span className="w-8">Abil</span>
            <span className="w-8">Misc</span>
        </div>
        {saves.map((save) => {
            const mod = getMod(save.abilityScore);
            const total = save.base + save.misc + mod;
            return (
                <div key={save.name} className="flex items-center text-xs font-merriweather border-b border-stone-300 pb-1">
                    <div className="w-16 font-bold flex items-center gap-1 text-stone-800">
                        {save.icon} {save.name.substring(0,4)}
                    </div>
                    <div className="w-8 font-bold text-stone-900 bg-white border border-stone-400 text-center rounded">
                        {total >= 0 ? `+${total}` : total}
                    </div>
                    <div className="w-8 text-center cursor-pointer hover:bg-white/50" onClick={() => setEditing(save.name + 'base')}>
                        {editing === save.name + 'base' ? (
                            <input 
                                className="w-6 text-center bg-white border border-stone-500"
                                autoFocus
                                type="number"
                                defaultValue={save.base}
                                onBlur={(e) => {
                                    updateCharacterDetails({ [save.keys[0]]: parseInt(e.target.value) || 0 });
                                    setEditing(null);
                                }}
                            />
                        ) : save.base}
                    </div>
                    <div className="w-8 text-center text-stone-500">
                        {mod >= 0 ? `+${mod}` : mod}
                    </div>
                    <div className="w-8 text-center cursor-pointer hover:bg-white/50" onClick={() => setEditing(save.name + 'misc')}>
                         {editing === save.name + 'misc' ? (
                            <input 
                                className="w-6 text-center bg-white border border-stone-500"
                                autoFocus
                                type="number"
                                defaultValue={save.misc}
                                onBlur={(e) => {
                                    updateCharacterDetails({ [save.keys[1]]: parseInt(e.target.value) || 0 });
                                    setEditing(null);
                                }}
                            />
                        ) : save.misc}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};