import { Compound } from '@schemas/compound.schema';
import { v4 as uuidv4 } from 'uuid';

export const WATER = 'water';
export const ETHANOL = 'ethanol';

export const COMPOUNDS: Compound[] = [
  {
    name: WATER,
    reducedFormula: 'H2O',
    alternativeNames: [],
    uuid: uuidv4(),
  },
  {
    name: ETHANOL,
    reducedFormula: 'C2H5OH',
    alternativeNames: ['alcohol'],
    uuid: uuidv4(),
  },
];
