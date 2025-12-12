import Dexie, { Table } from 'dexie';
import { Quest, JournalEntry, CharacterStats, AttributeType, Feat, PF1_SKILLS_LIST } from './types';

export interface CampaignDatabase extends Dexie {
  quests: Table<Quest>;
  journal: Table<JournalEntry>;
  stats: Table<CharacterStats>;
  feats: Table<Feat>;
}

export const db = new Dexie('CampaignManagerDB') as CampaignDatabase;

// Version 4: Add Temp Scores
db.version(4).stores({
  quests: '++id, attribute, isCompleted, createdAt',
  journal: '++id, createdAt',
  stats: '++id',
  feats: '++id, type, createdAt' 
}).upgrade(async trans => {
  await trans.table('stats').toCollection().modify(stat => {
    stat.strTemp = stat.strTemp || 0;
    stat.dexTemp = stat.dexTemp || 0;
    stat.conTemp = stat.conTemp || 0;
    stat.intTemp = stat.intTemp || 0;
    stat.wisTemp = stat.wisTemp || 0;
    stat.chaTemp = stat.chaTemp || 0;
  });
});

// Version 3: Pathfinder 1e Update
db.version(3).stores({
  quests: '++id, attribute, isCompleted, createdAt',
  journal: '++id, createdAt',
  stats: '++id',
  feats: '++id, type, createdAt' 
}).upgrade(async trans => {
  // Upgrade existing stats to include new fields if they don't exist
  await trans.table('stats').toCollection().modify(stat => {
    stat.skills = stat.skills || PF1_SKILLS_LIST.map(s => ({
      name: s.name,
      attribute: s.attr,
      ranks: 0,
      isClassSkill: false,
      miscMod: 0
    }));
    stat.spells = stat.spells || [];
    stat.baseFort = stat.baseFort || 0;
    stat.baseRef = stat.baseRef || 0;
    stat.baseWill = stat.baseWill || 0;
    stat.bab = stat.bab || 0;
    stat.ac = stat.ac || 10;
    stat.hpMax = stat.hpMax || 10;
    stat.hpCurrent = stat.hpCurrent || 10;
  });
});

// Version 2 fallback
db.version(2).stores({
  quests: '++id, attribute, isCompleted, createdAt',
  journal: '++id, createdAt',
  stats: '++id',
  feats: '++id, type, createdAt' 
});

db.version(1).stores({
  quests: '++id, attribute, isCompleted, createdAt',
  journal: '++id, createdAt',
  stats: '++id'
});

db.on('populate', () => {
  db.stats.add({
    name: 'Adventurer',
    classType: 'Commoner 1',
    level: 1,
    xp: 0,
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
    strTemp: 0,
    dexTemp: 0,
    conTemp: 0,
    intTemp: 0,
    wisTemp: 0,
    chaTemp: 0,
    // PF1e Defaults
    bab: 0,
    hpMax: 10,
    hpCurrent: 10,
    ac: 10,
    baseFort: 0,
    baseRef: 0,
    baseWill: 0,
    miscFort: 0,
    miscRef: 0,
    miscWill: 0,
    skills: PF1_SKILLS_LIST.map(s => ({
      name: s.name,
      attribute: s.attr,
      ranks: 0,
      isClassSkill: false,
      miscMod: 0
    })),
    spells: []
  });
  
  db.feats.add({ title: 'Task Initiation', description: 'You can start tasks within 5 minutes of thinking about them.', type: 'CLASS_FEATURE', createdAt: Date.now() });
});

export const completeQuestTransaction = async (quest: Quest) => {
  return db.transaction('rw', db.quests, db.stats, async () => {
    await db.quests.update(quest.id!, { isCompleted: true });
    const stats = await db.stats.get(1);
    if (!stats) return;

    const xpGain = 25; 
    let newXp = stats.xp + xpGain;
    let newLevel = stats.level;
    
    // PF1e Leveling: usually 2000 for lvl 2, keeping it linear for app simplicity or custom
    const xpThreshold = newLevel * 1000;
    if (newXp >= xpThreshold) {
      newLevel++;
    }

    const updates: Partial<CharacterStats> = {
      xp: newXp,
      level: newLevel,
    };

    // Attribute Boost (Increases BASE stat)
    if (quest.attribute === AttributeType.STR) updates.str = (stats.str || 10) + 1;
    if (quest.attribute === AttributeType.DEX) updates.dex = (stats.dex || 10) + 1;
    if (quest.attribute === AttributeType.CON) updates.con = (stats.con || 10) + 1;
    if (quest.attribute === AttributeType.INT) updates.int = (stats.int || 10) + 1;
    if (quest.attribute === AttributeType.WIS) updates.wis = (stats.wis || 10) + 1;
    if (quest.attribute === AttributeType.CHA) updates.cha = (stats.cha || 10) + 1;

    await db.stats.update(1, updates);
  });
};

export const deleteQuest = async (id: number) => {
  await db.quests.delete(id);
};

export const addJournalEntry = async (content: string, image?: string) => {
  await db.journal.add({
    content,
    image,
    createdAt: Date.now()
  });
};

export const deleteJournalEntry = async (id: number) => {
  await db.journal.delete(id);
};

export const updateCharacterDetails = async (updates: Partial<CharacterStats>) => {
    await db.stats.update(1, updates);
}

export const updateSkill = async (skillName: string, updates: Partial<{ranks: number, isClassSkill: boolean, miscMod: number}>) => {
  const stats = await db.stats.get(1);
  if (!stats) return;
  const newSkills = stats.skills.map(s => s.name === skillName ? { ...s, ...updates } : s);
  await db.stats.update(1, { skills: newSkills });
}

export const updateAbilityScore = async (attr: keyof CharacterStats, value: number) => {
    // Force casting to satisfy Partial<CharacterStats> 
    await db.stats.update(1, { [attr]: value } as any);
}

// Helper to calculate mod
export const getMod = (score: number) => Math.floor((score - 10) / 2);