// type guard game
export const isGame = (game: unknown): game is Game => {
  return game !== null && game !== undefined;
};
