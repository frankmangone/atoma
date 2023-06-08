# ATOMA API

Main API for the ATOMA app.

## Setup

This application uses `pnpm`. `Yarn` or `npm` can also be used, but the lockfiles are git ignored - so when adding packages,
make sure to be using `pnpm`. Remember to install packages before you start working: `$ pnpm install`.

First and foremost, you'll need to run `$ pnpm prepare`. This does some things for you so you don't have many problems during setup.

The application also requires docker to run. Before running the app, you need to start the database container with:

```bash
$ docker compose up -d --build
```

The `--build` flag is generally only required on the first run of this command. Additionally, a database may need to be created (although that should not be the case). But if it is, use either the mongo shell or the [Compass UI](https://www.mongodb.com/products/compass). In case you choose to use the mongo shell, then you can use the following command to access it:

```bash
$ pnpm db:enter
```

This is also handy if you want to create records manually with `db.collection.insert({ ...document... })`.
Once your DB setup is complete, simply start the application by running `$ pnpm start:dev`

## GraphQL playground

With the application running, a GraphQL playground where you can play with queries will be available at `http://localhost:3000/graphql`. It's great for playing around with your resolvers, try it out!
