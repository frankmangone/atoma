import { PROPERTY_TYPES } from '@common/enums';
import { Property } from '@schemas/property.schema';
import { v4 as uuidv4 } from 'uuid';

export const PROPERTIES: Property[] = [
  {
    key: 'density',
    name: 'density',
    description: 'Relation of mass over volume.',
    uuid: uuidv4(),
    units: 'kg/m^3',
    type: PROPERTY_TYPES.PHYSICAL,
  },
  {
    key: 'viscosity',
    name: 'viscosity',
    uuid: uuidv4(),
    description: `Shear viscosity of the substance, used in newton's law.`,
    units: 'kg/m.s',
    type: PROPERTY_TYPES.PHYSICAL,
  },
];
