# Vinylventory - Backend

![GitHub License](https://img.shields.io/github/license/canardconfit/vinylventory-backend)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/canardconfit/vinylventory-backend)
![GitHub Release](https://img.shields.io/github/v/release/canardconfit/vinylventory-backend)

**Vinylventory** is a simple iOS application that lets you take inventory of these vinyls.

This project is the server you need to store and use the [iOS app](https://github.com/Vinylventory/app-ios).

## Installation

### Docker

The Docker image can be pulled from Docker Hub, here (ghcr.io) or Quay.io:
```sh
# Docker Hub
docker pull canardconfit/vinylventory-backend

# ghcr.io
docker pull ghcr.io/canardconfit/vinylventory-backend

# Quay.io
docker pull quay.io/canardconfit/vinylventory-backend
```

Docker compose file:
```yml
version: '3'

services:
  vinylventory-backend:
    image: canardconfit/vinylventory-backend:latest
    container_name: vinylventory-backend
    restart: always
    env_file:
      - "./environment.env"
```

> **Note**: Create `environment.env` file with a copy of .env.example

### `startServer.sh`

The script will check for necessary directories and files, run build and generate commands if needed, prompt you to initialize migrations and seed the database, and finally start the server.

### Manual Installation

#### Install Node Dependencies

   Ensure you have all necessary Node.js packages installed by running:

   ```bash
   yarn
   ```

#### Generate Prisma Client

   To generate the Prisma client, run:

   ```bash
   yarn generate
   ```

   This should create a `node_modules/@generated` directory.

#### Build the Project

   After installing the dependencies, compile the project by running:

   ```bash
   yarn build
   ```

   This will create a `dist` directory containing the compiled files.

#### Initialize Database Migrations

   Check if the `prisma/migrations` directory exists. If it does not, you need to initialize the migrations to set up the database:

   ```bash
   yarn migrate <name>
   ```

   You will be prompted to provide a name for the initial migration.

#### Seed the Database

   (Optional) If you wish to seed the database after the migration, run:

   ```bash
   yarn seed
   ```

#### Create and Configure the `.env` File

   Ensure there is a `.env` file in the root directory with all necessary environment variables. If this file is missing, create it and populate it with the required variables.

#### Start the Server

   Once all the above steps are complete, you can start the server with:

   ```bash
   yarn start
   ```

## Authenticate to the Server

A UUID will be generated when the server is first launched, and it will be added to the `.env` file. This UUID serves as an authentication token for the server. It must be updated in the `.env` file. You need to provide it with each request using a header like this:
```http request
Authorization: Bearer <token>
```

Here is a cURL example:

```curl
curl --location 'http://localhost:4000/graphql' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{"query":"query GetVinyls {\n    vinyls {\n        idVinyl\n        catNumber\n    }\n}","variables":{}}'
```

## Connect iOS App to Server

When you launch the iOS app, go to the settings and fill in the server URL (without a `/` at the end!) and the token obtained during the server startup.
