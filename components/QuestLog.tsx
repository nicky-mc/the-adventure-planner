import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, completeQuestTransaction, deleteQuest } from '../db';
import { AttributeType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Trash2, Plus, Check } from 'lucide-react';

export const QuestLog: React.FC = () => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [selectedAttr, setSelectedAttr] = useState<AttributeType>(AttributeType.STR);

  const quests = useLiveQuery(async () => {
    if (showCompleted) {
      const allQuests = await db.quests.toArray();
      // Sort: Active quests first, then by date (newest first)
      return allQuests.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        return b.createdAt - a.createdAt;
      });
    } else {
      // Default: Only active quests
      return db.quests.where('isCompleted').equals(0).reverse().sortBy('createdAt');
    }
  }, [showCompleted]);

  const handleAddQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;

    await db.quests.add({
      title: newQuestTitle,
      attribute: selectedAttr,
      isCompleted: false,
      createdAt: Date.now()
    });

    setNewQuestTitle('');
  };

  return (
    <section className="h-full flex flex-col bg-[#F5F5DC] border-x-4 border-double border-stone-400/50 p-4">
      <div className="flex items-center justify-center gap-2 mb-2 border-b-2 border-stone-800 pb-2">
        <Sword className="w-6 h-6 text-stone-800" />
        <h2 className="font-cinzel font-bold text-2xl text-stone-900">Quest Log</h2>
        <Sword className="w-6 h-6 text-stone-800 transform scale-x-[-1]" />
      </div>

      <div className="flex justify-end mb-4">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-merriweather font-bold text-stone-600 hover:text-stone-900 select-none">
          <input 
            type="checkbox" 
            checked={showCompleted} 
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="accent-stone-800 w-4 h-4"
          />
          Show Completed Deeds
        </label>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddQuest} className="mb-6 flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuestTitle}
            onChange={(e) => setNewQuestTitle(e.target.value)}
            placeholder="New Quest Name..."
            className="flex-1 bg-white border-2 border-stone-400 p-2 font-merriweather rounded-sm focus:outline-none focus:border-stone-800 shadow-inner"
          />
          <button 
            type="submit"
            className="bg-stone-800 text-[#F5F5DC] p-2 rounded-sm hover:bg-stone-700 transition-colors border-2 border-stone-600"
          >
            <Plus />
          </button>
        </div>
        <div className="flex justify-between gap-2">
           {(Object.keys(AttributeType) as Array<keyof typeof AttributeType>).map((attr) => (
             <button
               key={attr}
               type="button"
               onClick={() => setSelectedAttr(AttributeType[attr])}
               className={`flex-1 font-cinzel text-xs py-1 border-2 transition-all ${
                 selectedAttr === AttributeType[attr] 
                  ? 'bg-stone-800 text-[#F5F5DC] border-stone-900' 
                  : 'bg-[#EFEAD5] text-stone-600 border-stone-300 hover:border-stone-500'
               }`}
             >
               {attr}
             </button>
           ))}
        </div>
      </form>

      {/* Quest List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence>
          {quests?.map((quest) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={`group relative border p-3 shadow-sm rounded-sm transition-all flex items-start gap-3 ${
                quest.isCompleted 
                  ? 'bg-stone-100 border-stone-200 opacity-70' 
                  : 'bg-white border-stone-300 hover:shadow-md'
              }`}
            >
              {quest.isCompleted ? (
                 <div className="mt-1 w-5 h-5 flex items-center justify-center text-stone-400">
                    <Check size={18} />
                 </div>
              ) : (
                <button
                  onClick={() => completeQuestTransaction(quest)}
                  className="mt-1 w-5 h-5 border-2 border-stone-400 rounded-sm hover:bg-stone-200 flex items-center justify-center transition-colors"
                  aria-label="Complete Quest"
                />
              )}
              
              <div className="flex-1">
                <h4 className={`font-merriweather font-bold ${
                  quest.isCompleted ? 'text-stone-500 line-through decoration-stone-400' : 'text-stone-900'
                }`}>
                  {quest.title}
                </h4>
                <span className={`text-[10px] font-cinzel font-bold px-1.5 py-0.5 rounded border ${
                    quest.isCompleted ? 'bg-stone-200 text-stone-500 border-stone-300' :
                    quest.attribute === 'STR' ? 'bg-red-100 text-red-800 border-red-200' :
                    quest.attribute === 'INT' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {quest.attribute} +1
                </span>
              </div>

              <button 
                onClick={() => deleteQuest(quest.id!)}
                className="text-stone-300 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Quest"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
          {quests?.length === 0 && (
             <p className="text-center font-merriweather text-stone-400 italic mt-10">
               {showCompleted ? "No deeds found in the archives." : "No active quests. The adventure awaits."}
             </p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};