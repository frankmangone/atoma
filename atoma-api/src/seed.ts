import 'dotenv/config';
import mongoose from 'mongoose';
import { Property, PropertySchema } from './schemas/property.schema';
import { PROPERTIES } from './common/seeds/properties';

const {
  MONGO_PROTOCOL,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_HOST,
  COMPOUNDS_DB_NAME,
} = process.env;
const mongoUri = `${MONGO_PROTOCOL}://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${COMPOUNDS_DB_NAME}?authSource=admin`;

const PropertyModel = mongoose.model(Property.name, PropertySchema);

// TODO: Account for failing scenarios
const seed = async () => {
  console.log('Connecting to MongoDB instance...');
  await mongoose.connect(mongoUri);
  console.log('Connection successful.');

  console.log('Seeding properties...');
  await Promise.all(
    PROPERTIES.map(async (property) => {
      try {
        await PropertyModel.create(property);
        console.log(`Property "${property.name}" created.`);
      } catch {
        console.log(`Property "${property.name}" already exists.`);
      }
    }),
  );

  console.log('Seed completed successfully');
  mongoose.connection.close();
};

seed();
