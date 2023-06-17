import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import { Property } from '../../schemas/property.schema';
import { COMPOUNDS, ETHANOL, WATER } from './datasets/compounds';
import { DENSITY, PROPERTIES } from './datasets/properties';
import { Compound } from '@schemas/compound.schema';
import { CompoundProperty } from '@schemas/compound-property.schema';
import { v4 as uuidv4 } from 'uuid';
import {
  ETHANOL_DENSITY_DATA,
  WATER_DENSITY_DATA,
} from './datasets/compound-property-data';
import { CompoundData } from '@schemas/compound-data.schema';

// const {
//   MONGO_PROTOCOL,
//   MONGO_USERNAME,
//   MONGO_PASSWORD,
//   MONGO_PORT,
//   MONGO_HOST,
//   COMPOUNDS_DB_NAME,
// } = process.env;
// const mongoUri = `${MONGO_PROTOCOL}://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${COMPOUNDS_DB_NAME}?authSource=admin`;

// const CompoundModel = mongoose.model(Compound.name, CompoundSchema);
// const PropertyModel = mongoose.model(Property.name, PropertySchema);
// const CompoundPropertyModel = mongoose.model(
//   CompoundProperty.name,
//   CompoundPropertySchema,
// );
// const CompoundDataModel = mongoose.model(CompoundData.name, CompoundDataSchema);

// TODO: Disabled for now; need to rework this to Neo4j version
const seed = async () => {
  // console.log('Connecting to MongoDB instance...');
  // await mongoose.connect(mongoUri);
  // console.log('Connection successful.');
  // const compoundIds = new Map<string, Types.ObjectId>();
  // const propertyIds = new Map<string, Types.ObjectId>();
  // const compoundPropertyIds = new Map<
  //   [Types.ObjectId, Types.ObjectId],
  //   Types.ObjectId
  // >();
  // //
  // //
  // console.log('=========================================');
  // console.log('Seeding compounds...');
  // await Promise.all(
  //   COMPOUNDS.map(async (compound) => {
  //     try {
  //       const createdCompound = await CompoundModel.create(compound);
  //       compoundIds.set(createdCompound.name, createdCompound._id);
  //       console.log(`Compound "${compound.name}" created.`);
  //     } catch {
  //       console.log(`Compound "${compound.name}" already exists.`);
  //     }
  //   }),
  // );
  // //
  // //
  // console.log('=========================================');
  // console.log('Seeding properties...');
  // await Promise.all(
  //   PROPERTIES.map(async (property) => {
  //     try {
  //       const createdProperty = await PropertyModel.create(property);
  //       propertyIds.set(createdProperty.name, createdProperty._id);
  //       console.log(`Property "${property.name}" created.`);
  //     } catch {
  //       console.log(`Property "${property.name}" already exists.`);
  //     }
  //   }),
  // );
  // //
  // //
  // console.log('=========================================');
  // console.log('Seeding compound properties...');
  // const COMPOUND_PROPERTIES = [];
  // compoundIds.forEach((compound) => {
  //   propertyIds.forEach((property) => {
  //     COMPOUND_PROPERTIES.push({
  //       compound,
  //       property,
  //       uuid: uuidv4(),
  //     });
  //   });
  // });
  // await Promise.all(
  //   COMPOUND_PROPERTIES.map(async (compoundProperty) => {
  //     try {
  //       const { compound, property } = compoundProperty;
  //       const createdCompoundProperty = await CompoundPropertyModel.create(
  //         compoundProperty,
  //       );
  //       compoundPropertyIds.set(
  //         [compound, property],
  //         createdCompoundProperty._id,
  //       );
  //       console.log(`Compound property created.`);
  //     } catch {
  //       console.log(`Compound property already exists.`);
  //     }
  //   }),
  // );
  // //
  // //
  // console.log('=========================================');
  // console.log('Seeding compound property data...');
  // console.log('Seeding water density data...');
  // const waterId = compoundIds.get(WATER);
  // const densityId = propertyIds.get(DENSITY);
  // const waterDensityId = compoundPropertyIds.get([waterId, densityId]);
  // await Promise.all(
  //   WATER_DENSITY_DATA(waterDensityId).map(async (compoundData) => {
  //     try {
  //       await CompoundDataModel.create(compoundData);
  //       console.log(`Compound property for ${WATER} created.`);
  //     } catch {
  //       console.log(`Failed to create compound property data for ${WATER}.`);
  //     }
  //   }),
  // );
  // console.log('Seeding ethanol density data...');
  // const ethanolId = compoundIds.get(ETHANOL);
  // const ethanolDensityId = compoundPropertyIds.get([ethanolId, densityId]);
  // await Promise.all(
  //   ETHANOL_DENSITY_DATA(ethanolDensityId).map(async (compoundData) => {
  //     try {
  //       await CompoundDataModel.create(compoundData);
  //       console.log(`Compound property for ${WATER} created.`);
  //     } catch {
  //       console.log(`Failed to create compound property data for ${WATER}.`);
  //     }
  //   }),
  // );
  // console.log('Seed completed successfully');
  // mongoose.connection.close();
};

seed();
