# Identifee Portal

This project is monorepo in which contains ReactJS as the main frontend framework and Express for the API.

UI Demo

[https://demo.identifee.com](https://demo.idetifee.com)

Staging Demo

[https://portal.identifee.dev](https://portal.identifee.dev)

## Client

In the project root directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Server

The API service is under the `api` folder and uses TypeScript. To start the API use

### `npm run dev`

Runs the API express server on port `8080` and all client requests are proxied.

## Production Build

### Client

```shell
npm build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### Server

```shell
cd api/
npm run build
```

Builds and compile TS server code for production to the `dist` folder.

### Migrations

cd api

Run

```shell
  npm run migrate:create <name>
```

for create migration skeleton

Run

```shell
  npm run migrate:up
```
