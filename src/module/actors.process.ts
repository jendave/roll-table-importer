const FEATURE_HEADERS = ['Actions', 'Reactions'];

interface Ability {
  value: number;
  mod: number;
}

export interface Abilities {
  str: Ability;
  dex: Ability;
  con: Ability;
  int: Ability;
  wis: Ability;
  cha: Ability;
}
export interface Skill {
  name: string;
  bonus: number;
}

interface Set {
  name: string;
  collection: string[];
}

export interface ArmorClass {
  value: number;
  type: string;
}

export interface Feature {
  name: string;
  description: string;
}

export interface Health {
  value: number;
  min: number;
  max: number;
}

export interface Rating {
  cr?: number;
  xp: number;
}

export interface ImportActor {
  name: string;
  biography: string;
  health: Health;
  rating?: Rating;
  armorClass: ArmorClass;
  stats: Abilities;
  speed: number;
  skills: Skill[];
  features: Feature[];
}

export interface Formula {
  value: number;
  str: string;
  min?: number;
  max?: number;
  mod?: number;
  afterRegex?: string;
  beforeRegex?: string;
  afterFormula?: string;
  beforeFormula?: string;
}

export function parseFormula(line: string, regexStart: RegExp) {
  // line: Hit Points 66 (12d8 + 12)
  // get string from between parentheses
  // match = (12d8 + 12),12d8 + 12
  const formulaArray = line.match(/\(([^)]+)\)/);
  const regexSplit = line.split(regexStart);
  const beforeRegex = regexSplit[0];
  const afterRegex = regexSplit[1];
  if (!formulaArray || formulaArray.length < 2) {
    throw new Error(`Could not parse formula from line: ${line}`);
  }
  // pull formula from match
  const formula = formulaArray[1];

  let dieFormula = '';
  let change = '';
  if (formula.includes('+')) {
    dieFormula = formula.split('+')[0];
    change = formula.split('+')[1];
  } else if (formula.includes('-')) {
    dieFormula = formula.split('-')[0];
    change = '-' + formula.split('-')[1];
  } else {
    dieFormula = formula;
    change = '0';
  }

  const numOfDice = dieFormula.split('d')[0];
  const dieSize = dieFormula.split('d')[1];

  // get value after Hit Points string
  const hp = line.match(regexStart) || '10';
  const formulaSplit: string[] = line.split(formula).map((item) => item.replace('(,', '').replace(')', ''));
  return {
    value: parseInt(hp[1], 10),
    min: Number(numOfDice) + Number(change),
    max: Number(numOfDice) * Number(dieSize) + Number(change),
    str: formula,
    afterRegex,
    beforeRegex,
    mod: Number(change),
    afterFormula: formulaSplit[1],
    beforeFormula: formulaSplit[0],
  };
}

export function parseAC(acString: string): ArmorClass {
  // acString: Armor Class 17 (natural armor)
  // get string from between parentheses
  let ac = 'Natural Armor';
  if (acString.includes('(')) {
    const acArray = acString.match(/\(([^)]+)\)/);
    if (!acArray || acArray.length < 1) {
      throw new Error(`Could not parse armor type from string: ${acString} | array was: ${acArray}`);
    }
    // pull formula from match
    ac = acArray.length > 1 ? acArray[1] : 'Natural Armor';
  }
  // find number in string
  const acNumber = acString.match(/\d+/);
  if (!acNumber || acNumber.length < 1) {
    throw new Error(`Could not parse AC from string: ${acString} | number was: ${acNumber}`);
  }
  return {
    value: Number(acNumber[0]),
    type: ac,
  };
}

function parseAbilityScore(score: number, mod: string): Ability {
  // score: 12
  // mod: (+2)
  // get string from between parentheses
  const modNumberArray = mod.match(/\d+/);
  if (!modNumberArray || modNumberArray.length < 1) {
    throw new Error(`Could not parse ability score from string: ${mod}`);
  }
  let modNumber = modNumberArray[0];
  if (mod.includes('-')) {
    modNumber = '-' + modNumber;
  }

  return {
    value: score,
    mod: Number(modNumber),
  };
}

export function parseStats(inputList: string[]) {
  const abilityLine = inputList.find((line) => line.toUpperCase().includes('CHA'));
  if (!abilityLine) {
    throw new Error('Could not find ability line');
  }
  const abilityIndex = inputList.indexOf(abilityLine);
  const singleLine = abilityLine.includes('STR');
  if (singleLine) {
    // match 3 to 6 letters
    const abilityKeys = abilityLine.match(/\w{3,7}/g);
    if (!abilityKeys || abilityKeys.length < 6) {
      throw new Error('Could not find ability keys');
    }
    const valueLine = inputList[abilityIndex + 1];
    // match 1 to 2 numbers
    const abilityValuesWithMods = valueLine.match(/\d{1,2}/g);
    if (!abilityValuesWithMods || abilityValuesWithMods.length < 6) {
      throw new Error('Could not find ability values');
    }
    const abilityValues: number[] = [];
    abilityValuesWithMods.forEach((value, index) => {
      if (index % 2 === 0) {
        abilityValues.push(Number(value));
      }
    });
    // match + numbers in parentheses
    const abilityModifiers = valueLine.match(/\(([+-]\d+)\)/g);
    if (!abilityModifiers || abilityModifiers.length < 6) {
      throw new Error('Could not find ability modifiers');
    }
    if (!abilityValues || abilityValues.length < 6) {
      throw new Error('Could not find ability values');
    }
    const zipped = abilityKeys.reduce(
      (obj, k, i) => ({ ...obj, [k.toLowerCase()]: parseAbilityScore(abilityValues[i], abilityModifiers[i]) }),
      {},
    );
    return zipped as Abilities;
  }
  throw new Error('Could not parse ability line');
}

function indexOfAbility(lines: string[], ability: string): number {
  let firstIndex = 0;
  lines.forEach((line, index) => {
    if (line.trim().toLowerCase() === ability.trim().toLowerCase()) firstIndex = index;
  });
  return firstIndex;
}

function parseMod(line: string) {
  const components = line.split(' ');
  return {
    value: Number(components[0]),
    mod: Number(components[1].replace('(', '').replace(')', '')),
  };
}

export function parseMultilineStats(lines: string[]): Abilities {
  return {
    str: parseMod(lines[indexOfAbility(lines, 'STR') + 1]),
    dex: parseMod(lines[indexOfAbility(lines, 'DEX') + 1]),
    con: parseMod(lines[indexOfAbility(lines, 'CON') + 1]),
    int: parseMod(lines[indexOfAbility(lines, 'INT') + 1]),
    wis: parseMod(lines[indexOfAbility(lines, 'WIS') + 1]),
    cha: parseMod(lines[indexOfAbility(lines, 'CHA') + 1]),
  };
}

export function parseSpeed(lines: string[]) {
  const speedLine = lines.find((line) => line.toUpperCase().includes('SPEED'));
  if (!speedLine) {
    throw new Error('Could not find speed line');
  }
  const speed = speedLine.match(/\d+/);
  if (!speed || speed.length < 1) {
    throw new Error('Could not find speed');
  }
  return Number(speed[0]);
}

export function parseSkills(lines: string[]): Skill[] {
  let skillLine = lines.find((line) => line.toUpperCase().includes('SKILL'));
  if (!skillLine) {
    throw new Error('Could not find skill line');
  }
  skillLine = skillLine.replace(/skills/i, '');
  const skillKeys = skillLine.match(/\w{3,13}/g);
  if (!skillKeys || skillKeys.length < 1) {
    throw new Error('Could not find skill keys');
  }
  const skillValues = skillLine.match(/\d+/g);
  if (!skillValues || skillValues.length < 1) {
    throw new Error('Could not find skill values');
  }

  const skills = skillKeys.map((value, index) => {
    return {
      name: value.toLowerCase(),
      bonus: Number(skillValues[index]),
    };
  });
  return skills;
}

export function parseStandardCSV(lines: string[], name: string): Set {
  let standardLine = lines.find((line) => line.toUpperCase().includes(name.toUpperCase()));
  if (!standardLine) {
    throw new Error(`${name} not found`);
  }
  const rePattern = new RegExp(`${name}`, 'gi');
  standardLine = standardLine.replace(rePattern, '');
  return {
    name,
    collection: standardLine.split(',').map((value) => value.trim()),
  };
}

function extractFeature(checking: string): Feature | undefined {
  if (checking.match(/\.\s\w{3,}/)) {
    const [name, ...rest] = checking.split(/(?=\.)/);
    return {
      name: name.trim(),
      description: rest.join('').trim().replace(/\n/g, ' ').replace(/^\. /, ''),
    };
  }
  return undefined;
}

export function parseFeatures(lines: string[], startIndex: number): Feature[] {
  const features: Feature[] = [];
  for (let i = startIndex; i < lines.length; i++) {
    const checking = lines[i];
    // see if checking has a . followed by 3 or more words
    const feature = extractFeature(checking);
    if (feature) {
      features.push(feature);
      continue;
    }
    return features;
  }
  return features;
}

function isFeatureHeader(check: string) {
  return FEATURE_HEADERS.reduce(
    (acc, feature) => acc || feature.toUpperCase().trim() === check.trim().toUpperCase(),
    false,
  );
}

function getFeatureLines(lines: string[]): number[] {
  return lines.reduce((acc: number[], curr: string, index: number) => {
    if (isFeatureHeader(curr)) acc.push(index);
    return acc;
  }, []);
}

export function getFeatureNames(line: string): string | undefined {
  // match 1 or 2 words in a row that start with a capital letters and ending
  // in a period
  const re = /\b[A-Z]{1}[a-z]{1,}\b\./g;
  const matches = line.match(re);
  if (matches) {
    const name = line.split('.')[0];
    // If our regex didn't grab a match at the beginning of the line, return
    if (name.trim().split(' ').length > 3) {
      return;
    }
    return name;
  }

  return undefined;
}

interface Section {
  name: string;
  features: Feature[];
}

function reduceToFeatures(acc: string[], curr: string) {
  const names = getFeatureNames(curr);
  if (names || acc.length === 0) {
    acc.push(curr.trim());
  } else {
    acc[acc.length - 1] = acc[acc.length - 1] + ' ' + curr.trim();
  }
  return acc;
}

function featureStringsToFeatures(line: string) {
  const fetchedName = getFeatureNames(line);
  let name;
  if (!fetchedName) name = 'Unknown Name';
  else name = fetchedName.trim();

  let cleanLine = line.replace(name, '').trim();
  if (cleanLine.startsWith('.')) cleanLine = cleanLine.substring(1);
  if (cleanLine.startsWith(' ')) cleanLine = cleanLine.substring(1);
  const feature: Feature = {
    name,
    description: cleanLine,
  };
  return feature;
}
function cleanSectionElements(section: string[], sectionTitle: string): Feature[] {
  const formatted: string[] = section.map((line: string) => line.replace(sectionTitle, '').trim()).filter((n) => n);
  const preparedLines = formatted.reduce(reduceToFeatures, []);
  return preparedLines.map(featureStringsToFeatures);
}

function buildSections(featureLine: number[], featureSections: string[][], lines: string[]): Section[] {
  const sections: Section[] = [];
  featureLine.forEach((value: number, index: number) => {
    sections.push({
      name: lines[value].trim(),
      features: cleanSectionElements(featureSections[index], lines[value]),
    });
  });
  return sections;
}

function parseFeatureSection(lines: string[]) {
  let firstFeatureIndex = 0;
  lines.forEach((line, index) => {
    const name = getFeatureNames(line);
    if (name && firstFeatureIndex === 0) firstFeatureIndex = index;
  });
  const validFeatures = lines.slice(firstFeatureIndex);
  const features: Feature[] = cleanSectionElements(validFeatures, 'Features');
  const featureSection: Section = {
    name: 'Features',
    features,
  };
  return featureSection;
}

export function featureFromSection(sections: Section[], match: string): Section {
  return (
    sections.find(({ name }) => {
      return name.toUpperCase() === match.toUpperCase();
    }) || { features: [], name: 'No matching feature' }
  );
}

export function parseFeatureSections(text: string): Section[] {
  const lines = text.split('\n');
  const featureLine = getFeatureLines(lines);
  // create start and end indexes for each featureLine
  const featureSections = featureLine.reduce((acc: string[][], value, index) => {
    if (index === 0) {
      acc.push(lines.slice(0, featureLine[index]));
    }

    if (featureLine.length >= index + 1) {
      if (lines.length >= featureLine[index + 1]) {
        acc.push(lines.slice(value, featureLine[index + 1]));
      } else {
        acc.push(lines.slice(value, lines.length));
      }
    }
    return acc;
  }, []);
  const features = featureSections.shift();
  if (!features) throw new Error('Could not parse first feature section');
  const featureSection = parseFeatureSection(features);
  const sections = buildSections(featureLine, featureSections, lines);
  return [featureSection, ...sections];
}

export function findFirstSectionIndex(lines: string[], term: string): number {
  let firstMatch = 0;
  lines.forEach((line) => {
    if (line.toUpperCase().includes(term.toUpperCase()) && line.split(' ').length < 3) {
      firstMatch = lines.indexOf(line);
    }
  });
  if (firstMatch === 0) {
    return -1;
  }
  return firstMatch + 1;
}

function tryStatParsers(lines: string[]): Abilities {
  let stats: Abilities | undefined;
  try {
    stats = parseStats(lines);
  } catch (error) {
    stats = parseMultilineStats(lines);
  }
  if (!stats) throw new Error('could not parse stats.');
  return stats;
}
function getBiography(lines: string[]): string {
  let firstBioIndex = 0;
  lines.forEach((line: string, index: number) => {
    if (firstBioIndex === 0 && line.toUpperCase().includes('MEDIUM' || 'LARGE' || 'TINY')) {
      firstBioIndex = index;
    }
  });
  return lines[firstBioIndex].trim();
}

function getChallenge(challengeLine: string): Rating {
  // challengeLine : Challenge 1 (200 XP)
  // get the first number in the line
  const cr = Number(challengeLine.split(' ')[1]);
  // get the number in the parentheses
  const xp = Number(challengeLine.split('(')[1].split(')')[0].replace('xp', '').replace('XP', ''));
  return {
    cr,
    xp,
  };
}

export function getAllFeatures(text: string): Feature[] {
  const lines = text.split('\n');
  const firstFeatureLine = lines.findIndex((line) => getFeatureNames(line) !== undefined);
  const featureLines = lines.slice(firstFeatureLine);
  const featureStrings: string[] = featureLines.reduce(reduceToFeatures, []);
  return featureStrings.map(featureStringsToFeatures);
}

export function textToActor(input: string): ImportActor {
  const lines = input.split('\n');
  let featureLines = input.split('\n\n');
  if (featureLines.length === 1) {
    featureLines = lines;
  }
  const healthLine = lines.find((line) => line.includes('Hit Points')) || '(1d6 + 1)';
  const acLine = lines.find((line) => line.includes('Armor Class')) || 'Armor Class 12';
  if (!acLine || typeof acLine !== 'string') {
    throw new Error('Could not find AC line');
  }

  const challengeLine = lines.find((line) => line.includes('Challenge'));
  let rating = undefined;
  if (challengeLine) {
    rating = getChallenge(challengeLine);
  }

  let skills: Skill[] = [];
  try {
    skills = parseSkills(lines);
  } catch (error) {
    console.log('Could not parse skills');
  }

  return {
    name: lines[0].trim(),
    rating,
    biography: getBiography(lines),
    health: parseFormula(healthLine, /Hit Points (.*)/),
    armorClass: parseAC(acLine),
    stats: tryStatParsers(lines),
    speed: parseSpeed(lines),
    skills,
    features: getAllFeatures(input),
  };
}
