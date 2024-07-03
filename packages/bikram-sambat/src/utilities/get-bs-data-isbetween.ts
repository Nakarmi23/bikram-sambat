import type { BoundaryInclusionType } from '..';

export const getBoundaryInclusion = (
  val: BoundaryInclusionType
): [number, number] => {
  switch (val) {
    case '()':
      return [1, 1];
    case '(]':
      return [1, 0];
    case '[)':
      return [0, 1];
    case '[]':
      return [0, 0];
    default:
      throw new Error('boundary inclusion does not match');
  }
};
