import 'dotenv/config';
import neo4j from 'neo4j-driver';
import { v4 as uuidv4 } from 'uuid';

import { COMPOUNDS, ETHANOL, WATER } from './datasets/compounds';
import { DENSITY, PROPERTIES } from './datasets/properties';
import {
  ETHANOL_DENSITY_DATA,
  WATER_DENSITY_DATA,
} from './datasets/compound-property-data';

const {
  NEO_PROTOCOL,
  NEO_USERNAME,
  NEO_PASSWORD,
  NEO_PORT,
  NEO_HOST,
  DATABASE_NAME,
} = process.env;

const seed = async () => {
  console.log('Connecting to Neo4j instance...');

  // Create a Driver instance
  const driver = neo4j.driver(
    `${NEO_PROTOCOL}://${NEO_HOST}:${NEO_PORT}`,
    neo4j.auth.basic(NEO_USERNAME, NEO_PASSWORD),
  );

  // Verify the connection details or throw an Error
  await driver.getServerInfo();
  console.log('Connection successful.');

  const session = driver.session({
    database: DATABASE_NAME,
    defaultAccessMode: neo4j.session.WRITE,
  });
  //

  const compoundUuids = new Map<string, string>();
  const propertyUuids = new Map<string, string>();
  const compoundPropertyUuids = new Map<string, string>();

  console.log('=========================================');
  console.log('Seeding compounds...');
  for (const compound of COMPOUNDS) {
    try {
      await session.run(
        'CREATE (c:Compound {name: $name, reducedFormula: $reducedFormula, uuid: $uuid}) RETURN c',
        compound,
      );
      compoundUuids.set(compound.name, compound.uuid);
      console.log(`Compound "${compound.name}" created.`);
    } catch {
      console.log(`Compound "${compound.name}" already exists.`);
    }
  }

  console.log('=========================================');
  console.log('Seeding properties...');
  for (const property of PROPERTIES) {
    try {
      await session.run(
        'CREATE (p:Property {key: $key, name: $name, description: $description, uuid: $uuid, units: $units, type: $type}) RETURN p',
        property,
      );
      propertyUuids.set(property.name, property.uuid);
      console.log(`Property "${property.name}" created.`);
    } catch {
      console.log(`Property "${property.name}" already exists.`);
    }
  }

  console.log('=========================================');
  console.log('Seeding compound properties...');
  const COMPOUND_PROPERTIES = [];
  compoundUuids.forEach((compoundUuid) => {
    propertyUuids.forEach((propertyUuid) => {
      COMPOUND_PROPERTIES.push({
        compoundUuid,
        propertyUuid,
        uuid: uuidv4(),
      });
    });
  });
  for (const compoundProperty of COMPOUND_PROPERTIES) {
    try {
      const { compoundUuid, propertyUuid, uuid } = compoundProperty;

      // Create node
      await session.run(
        `
        MATCH
          (compound:Compound {uuid: $compoundUuid}),
          (property:Property {uuid: $propertyUuid})
        CREATE
          (compound)
          <-[:BELONGS_TO]-
          (compoundProperty:CompoundProperty {
            uuid: $uuid,
            name: property.name,
            compound: compound.name
          })
          -[:IS_PROPERTY]->
          (property)
        `,
        compoundProperty,
      );
      compoundPropertyUuids.set(compoundUuid + propertyUuid, uuid);
      console.log(`Compound property created.`);
    } catch {
      console.log(`Compound property already exists.`);
    }
  }

  console.log('=========================================');
  console.log('Seeding compound property data...');
  console.log('Seeding water density data...');
  const waterUuid = compoundUuids.get(WATER);
  const densityUuid = propertyUuids.get(DENSITY);
  const waterDensityUuid = compoundPropertyUuids.get(waterUuid + densityUuid);

  const cypher = `
    MATCH
      (c:CompoundProperty {uuid: $compoundPropertyUuid})
    CREATE (c)-[:HAS_DATA]->(d:CompoundData {value: $value, temperature: $temperature})
  `;

  for (const compoundData of WATER_DENSITY_DATA(waterDensityUuid)) {
    try {
      // Create node and connection
      await session.run(cypher, {
        ...compoundData,
        compoundPropertyUuid: waterDensityUuid,
      });
      console.log(`Compound property for ${WATER} created.`);
    } catch {
      console.log(`Failed to create compound property data for ${WATER}.`);
    }
  }
  //
  console.log('Seeding ethanol density data...');
  const ethanolUuid = compoundUuids.get(ETHANOL);
  const ethanolDensityUuid = compoundPropertyUuids.get(
    ethanolUuid + densityUuid,
  );

  for (const compoundData of ETHANOL_DENSITY_DATA(ethanolDensityUuid)) {
    try {
      // Create node and connection
      await session.run(cypher, {
        ...compoundData,
        compoundPropertyUuid: ethanolDensityUuid,
      });
      console.log(`Compound property for ${ETHANOL} created.`);
    } catch (error) {
      console.log(error);
      console.log(`Failed to create compound property data for ${ETHANOL}.`);
    }
  }

  console.log('Seed completed successfully, closing connection...');
  driver.close();
};

seed();
