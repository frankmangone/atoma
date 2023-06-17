# ATOMA API

Main API for the ATOMA app.

## Setup

This application uses `pnpm`. `Yarn` or `npm` can also be used, but the lockfiles are git ignored - so when adding packages,
make sure to be using `pnpm`. Remember to install packages before you start working: `$ pnpm install`.

First and foremost, you'll need to run `$ pnpm prepare`. This does some things for you so you don't have many problems during setup.

After that, make sure you have appropriate environment variables. An example `.env` file is provided in `.env.example`. Copy the contents into a `.env` file, and you should be good to go for local development.

The application also requires docker to run. Before running the app, you need to start the database container with:

```bash
$ docker compose up -d --build
```

The `--build` flag is generally only required on the first run of this command. Additionally, a database may need to be created (although that should not be the case).

Once your setup is complete, simply start the application by running `$ pnpm start:dev`

## Neo4j playground

This project uses the graph database _Neo4j_ as its backbone for data modeling.
A graphical interface is provided out of the box with the Neo4j container, which can be accessed at `http://localhost:7474/`.

## GraphQL playground

With the application running, a GraphQL playground where you can play with queries will be available at `http://localhost:3000/graphql`. It's great for playing around with your resolvers, try it out!
