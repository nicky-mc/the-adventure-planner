import React, { useState } from 'react';
import { CharacterStats, Skill } from '../types';
import { getMod, updateSkill } from '../db';
import { Search } from 'lucide-react';

interface SkillsListProps {
  stats: CharacterStats;
}

export const SkillsList: React.FC<SkillsListProps> = ({ stats }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSkills = (stats.skills || []).filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAbilityScore = (attr: string) => {
    switch(attr) {
        case 'STR': return stats.str + (stats.strTemp || 0);
        case 'DEX': return stats.dex + (stats.dexTemp || 0);
        case 'CON': return stats.con + (stats.conTemp || 0);
        case 'INT': return stats.int + (stats.intTemp || 0);
        case 'WIS': return stats.wis + (stats.wisTemp || 0);
        case 'CHA': return stats.cha + (stats.chaTemp || 0);
        default: return 10;
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#F5F5DC] p-2">
      {/* Header / Search */}
      <div className="flex items-center gap-2 mb-2 p-1 border-b border-stone-400">
        <Search size={16} className="text-stone-500" />
        <input
          className="bg-transparent font-merriweather text-sm w-full focus:outline-none"
          placeholder="Search Skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 text-[10px] font-cinzel font-bold text-stone-700 bg-[#E8E4C9] p-1 rounded-t">
        <div className="col-span-1 text-center">CS</div>
        <div className="col-span-4 pl-1">Skill Name</div>
        <div className="col-span-2 text-center">Total</div>
        <div className="col-span-1 text-center">Abil</div>
        <div className="col-span-2 text-center">Ranks</div>
        <div className="col-span-2 text-center">Misc</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredSkills.map((skill) => {
          const abilScore = getAbilityScore(skill.attribute);
          const abilMod = getMod(abilScore);
          const classBonus = skill.isClassSkill && skill.ranks > 0 ? 3 : 0;
          const total = abilMod + skill.ranks + skill.miscMod + classBonus;

          return (
            <div
              key={skill.name}
              className="grid grid-cols-12 items-center text-xs font-merriweather border-b border-stone-300 py-1 hover:bg-white/50 transition-colors"
            >
              <div className="col-span-1 flex justify-center">
                <input
                  type="checkbox"
                  checked={skill.isClassSkill}
                  onChange={(e) =>
                    updateSkill(skill.name, { isClassSkill: e.target.checked })
                  }
                  className="accent-stone-800"
                />
              </div>
              <div
                className="col-span-4 font-bold text-stone-800 pl-1 truncate"
                title={skill.name}
              >
                {skill.name}{" "}
                <span className="text-[9px] font-normal text-stone-500">
                  ({skill.attribute})
                </span>
              </div>
              <div className="col-span-2 text-center font-bold text-lg text-stone-900">
                {total >= 0 ? `+${total}` : total}
              </div>
              <div className="col-span-1 text-center text-stone-500">
                {abilMod}
              </div>
              <div className="col-span-2 text-center">
                <input
                  type="number"
                  className="w-8 text-center bg-white/80 border border-stone-300 rounded focus:border-stone-800"
                  value={skill.ranks}
                  onChange={(e) =>
                    updateSkill(skill.name, {
                      ranks: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="col-span-2 text-center">
                <input
                  type="number"
                  className="w-8 text-center bg-transparent border-b border-dashed border-stone-400 focus:border-stone-800"
                  value={skill.miscMod}
                  onChange={(e) =>
                    updateSkill(skill.name, {
                      miscMod: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-center mt-1 text-stone-500 italic">
        CS = Class Skill (+3 bonus if ranks &gt; 0)
      </div>
    </div>
  );
};