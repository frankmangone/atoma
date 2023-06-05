# ATOMA API

Main API for the ATOMA app.

## Setup

This application uses `pnpm`. `Yarn` or `npm` can also be used, but the lockfiles are git ignored - so when adding packages,
make sure to be using `pnpm`. Remember to install packages before you start working: `$ pnpm install`.

The application also requires docker to run. Before getting started, you need to start the database container with:

```bash
$ docker compose up -d --build
```

The `--build` flag is generally only required on the first run of this command. Additionally, a database may need to be created. If that's the case, use either the mongo shell or the [Compass UI](https://www.mongodb.com/products/compass). In case you choose to use the mongo shell, then the commands would look something like:

```bash
$ docker exec -it atoma-compound-db bash
$ mongosh "<MONGO_URI>" --username <MONGO_USERNAME> --password <MONGO_PASSWORD>
$ db.createCollection('compounds') # If needed.
```

Once your DB setup is complete, simply start the application by running `$ pnpm start:dev`
