import { Types } from 'mongoose';

export const WATER_DENSITY_DATA = (compoundProperty: Types.ObjectId) => [
  {
    compoundProperty,
    conditions: [
      {
        variable: 'temperature',
        value: 5,
      },
    ],
    value: 999.967,
  },
  {
    compoundProperty,
    conditions: [
      {
        variable: 'temperature',
        value: 10,
      },
    ],
    value: 999.702,
  },
  {
    compoundProperty,
    conditions: [
      {
        variable: 'temperature',
        value: 15,
      },
    ],
    value: 999.103,
  },
  {
    compoundProperty,
    conditions: [
      {
        variable: 'temperature',
        value: 20,
      },
    ],
    value: 998.207,
  },
  {
    compoundProperty,
    conditions: [
      {
        variable: 'temperature',
        value: 25,
      },
    ],
    value: 997.048,
  },
  {
    compoundProperty,
    conditions: [
      {
        variable: 'temperature',
        value: 30,
      },
    ],
    value: 995.65,
  },
  {
    compoundProperty,
    conditions: [
      {
        variable: 'temperature',
        value: 35,
      },
    ],
    value: 994.03,
  },
  {
    compoundProperty,
    conditions: [
      {
        variable: 'temperature',
        value: 40,
      },
    ],
    value: 992.22,
  },
  {
    compoundProperty,
    conditions: [
      {
        variable: 'temperature',
        value: 45,
      },
    ],
    value: 990.21,
  },
];
