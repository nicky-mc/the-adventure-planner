import React from 'react';
import { updateAbilityScore, getMod } from '../db';
import { CharacterStats } from '../types';

interface AttributeBlockProps {
  label: string;
  attrKey: keyof CharacterStats;     // The 'str' key
  tempKey: keyof CharacterStats; // The 'strTemp' key
  baseValue: number;
  tempValue: number;
  icon: React.ReactNode;
  description: string;
}

export const AttributeBlock: React.FC<AttributeBlockProps> = ({ 
  label, baseValue, tempValue, attrKey, tempKey, icon, description 
}) => {
  
  const totalScore = baseValue + (tempValue || 0);
  const modifier = getMod(totalScore);
  const displayMod = modifier >= 0 ? `+${modifier}` : modifier;

  const handleUpdateBase = (val: number) => updateAbilityScore(attrKey, val);
  const handleUpdateTemp = (val: number) => updateAbilityScore(tempKey, val);

  return (
    <div className="flex flex-row md:flex-col items-center p-2 border-2 md:border-4 border-double border-stone-600 bg-[#EFEAD5] rounded-lg shadow-sm relative overflow-hidden">
      
      {/* Icon & Label */}
      <div className="flex flex-col items-center mr-3 md:mr-0 md:mb-1 w-16 md:w-auto shrink-0">
        <div className="text-stone-500 scale-75">{icon}</div>
        <h3 className="font-cinzel font-bold text-lg text-stone-900 leading-none">{label}</h3>
        <p className="hidden md:block text-[9px] font-merriweather text-stone-600 italic opacity-80">{description}</p>
      </div>
      
      {/* Main Stats Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        
        {/* Modifier Bubble (The Big Number) */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white border-2 border-stone-800 rounded-full shadow-inner mb-2 z-10">
            <span className="font-cinzel font-black text-2xl md:text-3xl text-stone-900">{displayMod}</span>
            <div className="absolute -top-2 bg-stone-800 text-[#F5F5DC] px-1.5 rounded text-[8px] font-cinzel tracking-widest uppercase">
                Mod
            </div>
        </div>

        {/* Total Score Display */}
        <div className="mb-2 bg-stone-300/50 px-2 py-0.5 rounded border border-stone-400">
             <span className="text-xs font-merriweather font-bold text-stone-700">Score: {totalScore}</span>
        </div>

        {/* Editable Fields: Base & Temp */}
        <div className="grid grid-cols-2 gap-1 w-full max-w-[120px]">
            <div className="flex flex-col items-center">
                <span className="text-[8px] font-cinzel font-bold text-stone-600 uppercase">Base</span>
                <input 
                    type="number"
                    className="w-full text-center bg-white border border-stone-400 rounded-sm font-merriweather font-bold text-sm h-6 focus:border-stone-800 focus:outline-none"
                    value={baseValue}
                    onChange={(e) => handleUpdateBase(parseInt(e.target.value) || 0)}
                />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-[8px] font-cinzel font-bold text-stone-600 uppercase">Temp</span>
                <input 
                    type="number"
                    className="w-full text-center bg-white border border-stone-400 rounded-sm font-merriweather font-bold text-sm h-6 focus:border-stone-800 focus:outline-none"
                    value={tempValue}
                    onChange={(e) => handleUpdateTemp(parseInt(e.target.value) || 0)}
                />
            </div>
        </div>
      </div>
    </div>
  );
};