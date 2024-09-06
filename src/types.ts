export type IconData = {
  src: string;
  height: number;
  width: number;
  base64: string;
};
export type AbilityChangesScrapped = {
  abilityName: string;
  changes: string;
  iconName: string;
};
export type ChampionDataScrapped = {
  [key: string]: {
    champion: string;
    damageDealt: number;
    damageReceived: number;
    generalChanges: string[];
    abilityChanges: AbilityChangesScrapped[];
  };
};

export interface ChampionDataApi {
  champion: string;
  damageDealt: number;
  damageReceived: number;
  generalChanges: string[];
  abilityChanges: AbilityChangesScrapped[];
  winRate: number;
  icon: IconData;
  title?: string;
  spells: Record<string, IconData>;
}

export type ItemChangesScrapped = {
  itemName: string;
  changes: string[];
  icon: IconData;
};
export type RunesChangesScrapped = {
  runeName: string;
  changes: string[];
  icon: IconData;
};

export type ItemDataScrapped = {
  [key: string]: ItemChangesScrapped;
};
export type RunesDataScrapped = {
  [key: string]: RunesChangesScrapped;
};
export type ScrappedData = {
  championData: ChampionDataScrapped;
  itemData: ItemDataScrapped;
  runeData: RunesDataScrapped;
};
export type ChampionData = {
  version: string;
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
  partype: string;
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
};

export interface ChampionWinRates {
  [key: string]: number;
}

export type Rune = {
  id: number;
  key: string;
  icon: string;
  name: string;
  shortDesc: string;
  longDesc: string;
};

export type RuneSlot = {
  runes: Rune[];
};

export type RuneData = {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: RuneSlot[];
};

export type Item = {
  name: string;
  description: string;
  colloq: string;
  plaintext: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  gold: {
    base: number;
    purchasable: boolean;
    total: number;
    sell: number;
  };
  tags: string[];
  maps: {
    [key: string]: boolean;
  };
  stats: {
    FlatMovementSpeedMod: number;
  };
  effect: {
    Effect1Amount: string;
  };
};

export type AbilityChanges = {
  abilityName: string;
  changes: string;
  iconName: string;
};
