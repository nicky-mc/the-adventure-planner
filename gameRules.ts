import { AttributeType } from './types';

export interface ClassDefinition {
  name: string;
  description: string;
  lifePhilosophy: string; // How this applies to real life
  hitDie: number; // Represents Daily Energy / Burnout Resistance
  babProgression: 'full' | 'medium' | 'poor'; // Represents Task Completion Momentum
  goodSaves: Array<'Fort' | 'Ref' | 'Will'>; // Resiliences
  primaryAttribute: AttributeType; // Suggested focus
  startingSpells?: string[]; // Initial spells (Cantrips/Orisons)
}

export const PF1_CLASSES: ClassDefinition[] = [
  {
    name: 'Barbarian',
    description: 'A fierce warrior of primitive background who can enter a battle rage.',
    lifePhilosophy: 'The Athlete. You rely on bursts of high energy and physical prowess. Great for heavy labor or intense workout regimes.',
    hitDie: 12,
    babProgression: 'full',
    goodSaves: ['Fort'],
    primaryAttribute: AttributeType.STR
  },
  {
    name: 'Bard',
    description: 'A performer whose music and poetics produce magical effects.',
    lifePhilosophy: 'The Networker. You thrive on social connection, communication, and adaptability. Great for sales, management, or content creation.',
    hitDie: 8,
    babProgression: 'medium',
    goodSaves: ['Ref', 'Will'],
    primaryAttribute: AttributeType.CHA,
    startingSpells: ['Detect Magic', 'Prestidigitation', 'Read Magic', 'Summon Instrument']
  },
  {
    name: 'Cleric',
    description: 'A master of divine magic and a capable warrior.',
    lifePhilosophy: 'The Caregiver. You focus on wellness, routine, and supporting others. Great for healthcare, service, or self-improvement focus.',
    hitDie: 8,
    babProgression: 'medium',
    goodSaves: ['Fort', 'Will'],
    primaryAttribute: AttributeType.WIS,
    startingSpells: ['Create Water', 'Detect Magic', 'Light', 'Purify Food and Drink']
  },
  {
    name: 'Druid',
    description: 'A worshiper of the wild nature, maintaining balance.',
    lifePhilosophy: 'The Naturalist. You seek balance in environment and self. Great for outdoor work, biology, or sustainable living.',
    hitDie: 8,
    babProgression: 'medium',
    goodSaves: ['Fort', 'Will'],
    primaryAttribute: AttributeType.WIS,
    startingSpells: ['Detect Magic', 'Know Direction', 'Light', 'Stabilize']
  },
  {
    name: 'Fighter',
    description: 'A master of martial combat, skilled with many weapons.',
    lifePhilosophy: 'The Grinder. You are disciplined, consistent, and tackle tasks head-on. The ultimate generalist productivity build.',
    hitDie: 10,
    babProgression: 'full',
    goodSaves: ['Fort'],
    primaryAttribute: AttributeType.STR
  },
  {
    name: 'Monk',
    description: 'A student of martial arts who trains his body and mind.',
    lifePhilosophy: 'The Disciplined. You value habit stacking, perfectionism, and mental clarity. Excellent for strict routines.',
    hitDie: 8,
    babProgression: 'medium',
    goodSaves: ['Fort', 'Ref', 'Will'],
    primaryAttribute: AttributeType.WIS
  },
  {
    name: 'Paladin',
    description: 'A holy warrior bound to a sacred oath.',
    lifePhilosophy: 'The Crusader. You are driven by a strict code of conduct or moral cause. High discipline and charisma. Leadership roles.',
    hitDie: 10,
    babProgression: 'full',
    goodSaves: ['Fort', 'Will'],
    primaryAttribute: AttributeType.STR,
    startingSpells: ['Detect Poison', 'Read Magic'] // Paladins get spells later, but we give minor boons now
  },
  {
    name: 'Ranger',
    description: 'A warrior who uses martial prowess and nature magic to combat threats.',
    lifePhilosophy: 'The Strategist. You specialize in tracking specific goals (Favored Enemies). Great for project management or research.',
    hitDie: 10,
    babProgression: 'full',
    goodSaves: ['Fort', 'Ref'],
    primaryAttribute: AttributeType.DEX,
    startingSpells: ['Read Magic']
  },
  {
    name: 'Rogue',
    description: 'A skillful thief who relies on stealth and sneak attacks.',
    lifePhilosophy: 'The Freelancer. You are adaptable, skill-focused, and work best with flexible hours and varied tasks.',
    hitDie: 8,
    babProgression: 'medium',
    goodSaves: ['Ref'],
    primaryAttribute: AttributeType.DEX
  },
  {
    name: 'Sorcerer',
    description: 'A spellcaster born with innate magical ability.',
    lifePhilosophy: 'The Prodigy. You rely on natural talent and force of personality rather than book learning. High burst output.',
    hitDie: 6,
    babProgression: 'poor',
    goodSaves: ['Will'],
    primaryAttribute: AttributeType.CHA,
    startingSpells: ['Acid Splash', 'Detect Magic', 'Mage Hand', 'Read Magic']
  },
  {
    name: 'Wizard',
    description: 'A scholarly magic-user capable of manipulating reality.',
    lifePhilosophy: 'The Academic. You focus on deep work, study, and mental expansion. Low physical stamina, but high output in complex tasks.',
    hitDie: 6,
    babProgression: 'poor',
    goodSaves: ['Will'],
    primaryAttribute: AttributeType.INT,
    startingSpells: ['Detect Magic', 'Light', 'Mage Hand', 'Prestidigitation']
  }
];

export const STANDARD_ARRAY = [16, 14, 13, 12, 10, 8];

export const calculateBaseStats = (className: string, level: number) => {
    const cls = PF1_CLASSES.find(c => c.name === className) || PF1_CLASSES[4]; // Default Fighter
    
    // BAB
    let bab = 0;
    if (cls.babProgression === 'full') bab = level;
    if (cls.babProgression === 'medium') bab = Math.floor(level * 0.75);
    if (cls.babProgression === 'poor') bab = Math.floor(level * 0.5);

    // Saves (PF1e Standard Progression)
    // Good: 2 + level/2 | Poor: level/3
    const getSave = (type: 'Fort' | 'Ref' | 'Will') => {
        const isGood = cls.goodSaves.includes(type);
        return isGood ? Math.floor(2 + level / 2) : Math.floor(level / 3);
    };

    return {
        bab,
        baseFort: getSave('Fort'),
        baseRef: getSave('Ref'),
        baseWill: getSave('Will'),
        hpMax: cls.hitDie + (level - 1) * (cls.hitDie / 2 + 1) // Max at lvl 1, average after
    };
};