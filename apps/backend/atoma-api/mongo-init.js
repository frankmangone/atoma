import 'dotenv/config';

const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;

db.createUser({
  user: MONGO_USERNAME,
  pwd: MONGO_PASSWORD,
  roles: [
    { role: 'userAdminAnyDatabase', db: 'admin' },
    { role: 'readWriteAnyDatabase', db: 'admin' },
  ],
});
