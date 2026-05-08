import { parseResultText } from '../formatters';
import { TableEntry } from './types';

export const WEIGHT_RANGE_REGEX = /^[0-9]{1,3}-[0-9]{1,3}./;
export const WEIGHT_REGEX = /^[0-9]{1,3}./;

export function hasWeightsRange(item: string) {
  return WEIGHT_RANGE_REGEX.test(item.trim());
}

export function hasWeights(item: string): boolean {
  return WEIGHT_REGEX.test(item.trim());
}

export const breakLines = (data: string): string[] => data.split('\n').filter((line) => line !== '');

export const rangeStringMap = (current: string): [number, number] => {
  let start: number, end: number;
  if (current.includes('–')) {
    [start, end] = current.split('–').map(Number);
  } else if (current.includes('-')) {
    [start, end] = current.split('-').map(Number);
  } else {
    start = Number(current);
    end = start;
  }
  if (end === 0) end = 100;
  if (start === 0) start = 1;
  return [start, end];
};

export function addWeight(line: string): TableEntry {
  const regex = hasWeightsRange(line) ? WEIGHT_RANGE_REGEX : WEIGHT_REGEX;
  const matches = line.trim().match(regex);
  if (!matches) throw new Error(`Invalid weighted line: ${line}`);
  const text = line.replace(regex, '').trim();
  const { name, description } = parseResultText(text);
  return { name, description, range: rangeStringMap(matches[0]) };
}
