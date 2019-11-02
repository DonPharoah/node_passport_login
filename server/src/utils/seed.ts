import * as short from 'short-uuid';
let seed: short.Translator = short();
seed = short();

export const getSeed = () => {
  return seed;
};
