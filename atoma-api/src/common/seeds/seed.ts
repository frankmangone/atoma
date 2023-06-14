import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import { Property, PropertySchema } from '../../schemas/property.schema';
import { COMPOUNDS } from './datasets/compounds';
import { PROPERTIES } from './datasets/properties';
import { Compound, CompoundSchema } from '@schemas/compound.schema';
import {
  CompoundProperty,
  CompoundPropertySchema,
} from '@schemas/compound-property.schema';
import { v4 as uuidv4 } from 'uuid';

const {
  MONGO_PROTOCOL,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_HOST,
  COMPOUNDS_DB_NAME,
} = process.env;
const mongoUri = `${MONGO_PROTOCOL}://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${COMPOUNDS_DB_NAME}?authSource=admin`;

const CompoundModel = mongoose.model(Compound.name, CompoundSchema);
const PropertyModel = mongoose.model(Property.name, PropertySchema);
const CompoundPropertyModel = mongoose.model(
  CompoundProperty.name,
  CompoundPropertySchema,
);

const seed = async () => {
  console.log('Connecting to MongoDB instance...');
  await mongoose.connect(mongoUri);
  console.log('Connection successful.');

  const compoundIds = new Map<string, Types.ObjectId>();
  const propertyIds = new Map<string, Types.ObjectId>();
  const compoundPropertyIds = new Map<[string, string], Types.ObjectId>();

  //
  //
  console.log('=========================================');
  console.log('Seeding compounds...');
  await Promise.all(
    COMPOUNDS.map(async (compound) => {
      try {
        const createdCompound = await CompoundModel.create(compound);
        compoundIds.set(createdCompound.name, createdCompound._id);
        console.log(`Compound "${compound.name}" created.`);
      } catch {
        console.log(`Compound "${compound.name}" already exists.`);
      }
    }),
  );

  //
  //
  console.log('=========================================');
  console.log('Seeding properties...');
  await Promise.all(
    PROPERTIES.map(async (property) => {
      try {
        const createdProperty = await PropertyModel.create(property);
        propertyIds.set(createdProperty.name, createdProperty._id);
        console.log(`Property "${property.name}" created.`);
      } catch {
        console.log(`Property "${property.name}" already exists.`);
      }
    }),
  );

  //
  //
  console.log('=========================================');
  console.log('Seeding compound properties...');

  const COMPOUND_PROPERTIES = [];

  compoundIds.forEach((compoundId) => {
    propertyIds.forEach((propertyId) => {
      COMPOUND_PROPERTIES.push({
        compoundId,
        propertyId,
        uuid: uuidv4(),
      });
    });
  });

  await Promise.all(
    COMPOUND_PROPERTIES.map(async (compoundProperty) => {
      try {
        const { compoundId, propertyId } = compoundProperty;

        const createdCompoundProperty = await CompoundPropertyModel.create(
          compoundProperty,
        );

        compoundPropertyIds.set(
          [compoundId, propertyId],
          createdCompoundProperty._id,
        );
        console.log(`Compound property created.`);
      } catch {
        console.log(`Compound property already exists.`);
      }
    }),
  );

  console.log('Seed completed successfully');
  mongoose.connection.close();
};

seed();
