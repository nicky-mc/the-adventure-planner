import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { CharacterHeader } from './components/CharacterHeader';
import { AttributeBlock } from './components/AttributeBlock';
import { SavingThrowBlock } from './components/SavingThrowBlock';
import { QuestLog } from './components/QuestLog';
import { JournalLog } from './components/JournalLog';
import { FeaturesList } from './components/FeaturesList';
import { SkillsList } from './components/SkillsList';
import { SpellsList } from './components/SpellsList';
import { CharacterCreator } from './components/CharacterCreator';
import { Dumbbell, Brain, Heart, Wind, Shield, MessageCircle, Book, Award, List, ScrollText } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'JOURNAL' | 'FEATS' | 'SKILLS' | 'SPELLS'>('JOURNAL');

  const stats = useLiveQuery(async () => {
    const s = await db.stats.toArray();
    return s[0];
  });

  if (!stats) return <div className="h-screen w-full flex items-center justify-center bg-[#F5F5DC] font-cinzel text-2xl text-stone-800">Loading Scroll...</div>;

  // If the character is the default placeholder, show the Creator Wizard
  if (stats.name === 'Adventurer' && stats.level === 1 && stats.str === 10 && stats.xp === 0) {
      return <CharacterCreator onComplete={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-[#292524] p-2 md:p-4 flex justify-center">
      {/* The "Paper" Sheet Container */}
      <div className="w-full max-w-[1400px] bg-[#F5F5DC] shadow-2xl rounded-sm overflow-hidden flex flex-col border-4 md:border-8 border-double border-[#4a4440] h-[95vh] md:h-[90vh]">
        
        <CharacterHeader stats={stats} />

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">
          
          {/* Left Column: Attributes & Saves (2 cols) */}
          <aside className="hidden lg:flex lg:col-span-2 bg-[#E8E4C9] p-2 border-r-4 border-double border-stone-400/50 overflow-y-auto custom-scrollbar flex-col">
            <h2 className="font-cinzel font-bold text-lg text-stone-900 text-center mb-2 border-b-2 border-stone-800 pb-1">Stats</h2>
            <div className="grid grid-cols-1 gap-2">
              <AttributeBlock 
                label="STR" 
                baseValue={stats.str} tempValue={stats.strTemp}
                attrKey="str" tempKey="strTemp"
                icon={<Dumbbell size={16} />} description="Force"
              />
              <AttributeBlock 
                label="DEX" 
                baseValue={stats.dex} tempValue={stats.dexTemp}
                attrKey="dex" tempKey="dexTemp"
                icon={<Wind size={16} />} description="Agility"
              />
              <AttributeBlock 
                label="CON" 
                baseValue={stats.con} tempValue={stats.conTemp}
                attrKey="con" tempKey="conTemp"
                icon={<Shield size={16} />} description="Stamina"
              />
              <AttributeBlock 
                label="INT" 
                baseValue={stats.int} tempValue={stats.intTemp}
                attrKey="int" tempKey="intTemp"
                icon={<Brain size={16} />} description="Logic"
              />
              <AttributeBlock 
                label="WIS" 
                baseValue={stats.wis} tempValue={stats.wisTemp}
                attrKey="wis" tempKey="wisTemp"
                icon={<Heart size={16} />} description="Intuition"
              />
              <AttributeBlock 
                label="CHA" 
                baseValue={stats.cha} tempValue={stats.chaTemp}
                attrKey="cha" tempKey="chaTemp"
                icon={<MessageCircle size={16} />} description="Presence"
              />
            </div>
            
            <SavingThrowBlock stats={stats} />
          </aside>

          {/* Center Column: Quest Log (5 cols) */}
          <section className="lg:col-span-5 h-full overflow-hidden border-r-4 border-double border-stone-400/50 bg-[#F5F5DC]">
             <QuestLog />
          </section>

          {/* Right Column: Tabbed Interface (5 cols) */}
          <aside className="lg:col-span-5 h-full bg-[#F5F5DC] overflow-hidden flex flex-col">
            {/* Tab Header */}
            <div className="flex border-b-2 border-stone-400 bg-[#E8E4C9]">
                <TabButton 
                    active={activeTab === 'JOURNAL'} 
                    onClick={() => setActiveTab('JOURNAL')} 
                    icon={<Book size={14} />} label="Journal" 
                />
                <TabButton 
                    active={activeTab === 'SKILLS'} 
                    onClick={() => setActiveTab('SKILLS')} 
                    icon={<List size={14} />} label="Skills" 
                />
                <TabButton 
                    active={activeTab === 'SPELLS'} 
                    onClick={() => setActiveTab('SPELLS')} 
                    icon={<ScrollText size={14} />} label="Spells" 
                />
                <TabButton 
                    active={activeTab === 'FEATS'} 
                    onClick={() => setActiveTab('FEATS')} 
                    icon={<Award size={14} />} label="Feats" 
                />
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'JOURNAL' && <JournalLog />}
                {activeTab === 'FEATS' && <FeaturesList />}
                {activeTab === 'SKILLS' && <SkillsList stats={stats} />}
                {activeTab === 'SPELLS' && <SpellsList stats={stats} />}
            </div>
          </aside>

        </main>
        
        {/* Footer */}
        <footer className="bg-[#292524] text-[#8c8886] p-1 text-center text-[10px] font-merriweather border-t-4 border-double border-[#4a4440] shrink-0">
          Campaign Manager System v1.2 • Pathfinder 1e Compatible
        </footer>
      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-3 font-cinzel font-bold text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 transition-colors ${active ? 'bg-[#F5F5DC] text-stone-900 border-t-4 border-stone-800' : 'text-stone-500 hover:bg-[#EFEAD5]'}`}
    >
        {icon} <span className="hidden md:inline">{label}</span>
    </button>
)

export default App;