import { Compound } from '@schemas/compound.schema';
import { v4 as uuidv4 } from 'uuid';

export const COMPOUNDS: Compound[] = [
  {
    name: 'water',
    reducedFormula: 'H2O',
    alternativeNames: [],
    uuid: uuidv4(),
  },
  {
    name: 'ethanol',
    reducedFormula: 'C2H5OH',
    alternativeNames: ['alcohol'],
    uuid: uuidv4(),
  },
];
