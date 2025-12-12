export enum AttributeType {
  STR = 'STR', 
  DEX = 'DEX', 
  CON = 'CON', 
  INT = 'INT', 
  WIS = 'WIS', 
  CHA = 'CHA', 
}

export interface Quest {
  id?: number;
  title: string;
  description?: string;
  attribute: AttributeType;
  isCompleted: boolean;
  createdAt: number;
}

export interface JournalEntry {
  id?: number;
  content: string;
  image?: string; 
  createdAt: number;
}

export interface Feat {
  id?: number;
  title: string;
  description: string;
  type: 'FEAT' | 'CLASS_FEATURE';
  createdAt: number;
}

export interface Skill {
  name: string;
  attribute: AttributeType;
  ranks: number;
  isClassSkill: boolean;
  miscMod: number;
}

export interface Spell {
  id?: number; // Unique ID for listing
  level: number;
  name: string;
  description?: string;
  prepared: boolean; // Is it prepared for the day?
  used: boolean; // Has it been cast?
}

export interface CharacterStats {
  id?: number; 
  name: string;
  classType: string; // e.g., "Wizard 3 / Fighter 1"
  level: number;
  xp: number;
  
  // Attributes (Base Scores)
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;

  // Attributes (Temporary Modifiers: Enhancements, Spells, Items)
  strTemp: number;
  dexTemp: number;
  conTemp: number;
  intTemp: number;
  wisTemp: number;
  chaTemp: number;

  // Combat Stats
  bab: number; // Base Attack Bonus
  hpMax: number;
  hpCurrent: number;
  ac: number;

  // PF1e Saves (Base values, misc mods stored here)
  baseFort: number;
  baseRef: number;
  baseWill: number;
  miscFort: number;
  miscRef: number;
  miscWill: number;

  // Embedded Arrays for simplicity in single-row fetch
  skills: Skill[];
  spells: Spell[];
}

export const getXpForNextLevel = (level: number) => {
  // PF1e Fast XP Track approximation or custom linear
  return level * 1000; 
};

export const PF1_SKILLS_LIST = [
  { name: 'Acrobatics', attr: AttributeType.DEX },
  { name: 'Appraise', attr: AttributeType.INT },
  { name: 'Bluff', attr: AttributeType.CHA },
  { name: 'Climb', attr: AttributeType.STR },
  { name: 'Craft', attr: AttributeType.INT },
  { name: 'Diplomacy', attr: AttributeType.CHA },
  { name: 'Disable Device', attr: AttributeType.DEX },
  { name: 'Disguise', attr: AttributeType.CHA },
  { name: 'Escape Artist', attr: AttributeType.DEX },
  { name: 'Fly', attr: AttributeType.DEX },
  { name: 'Handle Animal', attr: AttributeType.CHA },
  { name: 'Heal', attr: AttributeType.WIS },
  { name: 'Intimidate', attr: AttributeType.CHA },
  { name: 'Knowledge (Arcana)', attr: AttributeType.INT },
  { name: 'Knowledge (Dungeoneering)', attr: AttributeType.INT },
  { name: 'Knowledge (Engineering)', attr: AttributeType.INT },
  { name: 'Knowledge (Geography)', attr: AttributeType.INT },
  { name: 'Knowledge (History)', attr: AttributeType.INT },
  { name: 'Knowledge (Local)', attr: AttributeType.INT },
  { name: 'Knowledge (Nature)', attr: AttributeType.INT },
  { name: 'Knowledge (Nobility)', attr: AttributeType.INT },
  { name: 'Knowledge (Planes)', attr: AttributeType.INT },
  { name: 'Knowledge (Religion)', attr: AttributeType.INT },
  { name: 'Linguistics', attr: AttributeType.INT },
  { name: 'Perception', attr: AttributeType.WIS },
  { name: 'Perform', attr: AttributeType.CHA },
  { name: 'Profession', attr: AttributeType.WIS },
  { name: 'Ride', attr: AttributeType.DEX },
  { name: 'Sense Motive', attr: AttributeType.WIS },
  { name: 'Sleight of Hand', attr: AttributeType.DEX },
  { name: 'Spellcraft', attr: AttributeType.INT },
  { name: 'Stealth', attr: AttributeType.DEX },
  { name: 'Survival', attr: AttributeType.WIS },
  { name: 'Swim', attr: AttributeType.STR },
  { name: 'Use Magic Device', attr: AttributeType.CHA },
];