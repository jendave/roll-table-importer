import { isCSVTable, parseFromTxt } from '../../src/module/table/parse';
import { rangeStringMap } from '../../src/module/table/lineManipulators';

describe('parseFromTxt ranges', () => {
  it('accepts a tab or non-breaking space between the range and the text', () => {
    const txt = 'My Table\n1\tFirst, with a comma.\n2-11 Second.\n12–13\tThird.';
    const table = parseFromTxt(txt);
    expect(table.results.map((r) => r.range)).toEqual([
      [1, 1],
      [2, 11],
      [12, 13],
    ]);
    expect(table.results.map((r) => r.description)).toEqual(['First, with a comma.', 'Second.', 'Third.']);
  });

  it('parses an open-ended N+ range', () => {
    const table = parseFromTxt('My Table\n1-31 Low.\n32+ High.');
    expect(table.results[1].range).toEqual([32, 32]);
    expect(table.formula).toBe('1d32');
  });

  it('does not treat a literal "/t" in the text as a line break', () => {
    const table = parseFromTxt('My Table\n1 Read w/the lamp.\n2 Other.');
    expect(table.results).toHaveLength(2);
    expect(table.results[0].description).toBe('Read w/the lamp.');
  });
});

describe('rangeStringMap', () => {
  it('maps N+ to [N, N]', () => {
    expect(rangeStringMap('32+')).toEqual([32, 32]);
  });
});

describe('isCSVTable', () => {
  it('requires a pipe, not just a comma, on the first line', () => {
    expect(isCSVTable('1|Cloth\n2|Leather')).toBe(true);
    expect(isCSVTable('Traps, Tricks, and Treasure\n1 Pit.')).toBe(false);
  });
});
