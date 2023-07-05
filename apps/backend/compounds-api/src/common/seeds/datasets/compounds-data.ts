import { Compound } from '@schemas/compound.schema';
import { v4 as uuidv4 } from 'uuid';

export const WATER = 'water';
export const ETHANOL = 'ethanol';
export const METHANOL = 'methanol';

export const COMPOUNDS: Compound[] = [
  {
    name: WATER,
    reducedFormula: 'H2O',
    uuid: uuidv4(),
  },
  {
    name: ETHANOL,
    reducedFormula: 'C2H5OH',
    uuid: uuidv4(),
  },
  {
    name: METHANOL,
    reducedFormula: 'CH3OH',
    uuid: uuidv4(),
  },
];
