# Rishi Singh - Blog

## Setup

Create a `.env` file and add following values to that file
| Key | Comment |
|-----|---------|
|AUTH_TOKEN_SECRET | Used for signing auth tokens |
| REFRESH_TOKEN_SECRET | Used for signing refresh tokens |
| PORT | Port on which the application will run |
| DATABASE_HOST | MySql database host |
| DATABASE_NAME | MySql database name |
| DATABASE_USER | MySql database user |
| DATABASE_PORT | MySql database port |
| DATABASE_PASSWORD | MySql database password |

## Project Structure

```
RishiSingh-Blog/
├── admin-app/         # Admin react app
│   ├── build/         # React production build
│   ├── src/           # React source files
│   └── package.json   # React project
├── controllers/       # Express controllers
├── dist               # Transpiled JavaScript (ignored)
│   ├── build/         # React production build
│   ├── controllers/   # Express controllers
│   ├── middleware/    # Data validation and other middleware
│   ├── models/        # Ssequelize models
│   ├── node_modules/  # Node.js dependencies (ignored)
│   ├── public/        # Public files
│   ├── routes/        # Express routes
│   ├── schema/        # Zod form validation schema
│   ├── util/          # Utility functions
│   ├── access.log     # Access log created by morgan at runtime
│   ├── app.js         # Transpiled express server
│   └── socket.js      # Transpiled socket.io configuration
├── middleware/        # Data validation and other middleware
├── models/            # Ssequelize models
├── node_modules/      # Node.js dependencies (ignored)
├── public/            # Public files
├── routes/            # Express routes
├── schema/            # Zod form validation schema
├── util/              # Utility functions
├── views/             # EJS views
├── .env               # Environment variables (ignored)
├── .gitignore         # Gitignore
├── app.ts             # Express server
├── package.json       # Root Node.js project
├── Readme.md          # Readme
└── socket.ts          # Socket.io configuration
```

## Scripts
In the production environment use the `build-prod` command to build the application and `start` command to start.
While running in local, assuming that `node_modules` have been installed for both node and react application, use the  `start-dev` command.

```JSON
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node dist/app.js",
  "start-dev": "npm run build-dev && npm start",
  "install-client": "cd admin-app && npm install && cd ..",
  "build-client": "cd admin-app && npm run build && cd ..",
  "build-dev": "npm run build-client && tsc && cp -R public dist && cp -R admin-app/build dist && mv dist/build/index.html dist/build/app.html",
  "build-prod": "npm run install-client && npm run build-client && tsc && cp -R public dist && cp -R admin-app/build dist && mv dist/build/index.html dist/build/app.html"
}
```

### `start`
| Command | Description |
|---------|-------------|
| `node dist/app.js` | Execute the `app.js` file with node. |


### `start-dev`
| Command | Description |
|---------|-------------|
| `npm run build` | Build the react application for production |
| `node dist/app.js` | Execute the `app.js` file with node. |


### `install-client`
| Command | Description |
|---------|-------------|
| `cd admin-app` | Go to the `admin-app` diractory |
| `npm install` | Run the `npm install` command to install the node modules for the react application |
| `cd ..` | Move back to root directory |


### `build-client`
| Command | Description |
|---------|-------------|
| `cd admin-app` | Go to the `admin-app` diractory |
| `npm run build` | Build the react application for production |
| `cd ..` | Move back to root directory |


### `build-dev`
| Command | Description |
|---------|-------------|
| `npm run build-client` | Run the `build-client` script |
| `tsc`    | Transpile all `ts` code to `js` and place the output to `/dist` folder. |
| `cp -R public dist` | Move the `public` folder to the `dist` folder. |
| `cp -R admin-app/build dist` | Move the build folder at `/admin-app/build` to `/dist/build`. |
| `mv dist/build/index.html dist/build/app.html` | Rename `dist/build/index.html` to `dist/build/app.html`. |


### `build-prod`
| Command | Description |
|---------|-------------|
| `npm install` | Install the node modules for nodejs application |
| `npm run install-client` | Run the `install-client` script |
| `npm run build-client` | Run the `build-client` script |
| `tsc` | Transpile all `ts` code to `js` and place the output to `/dist` folder. |
| `cp -R public dist` | Move the `public` folder to the `dist` folder. |
| `cp -R admin-app/build dist` | Move the build folder at `/admin-app/build` to `/dist/build`. |
| `mv dist/build/index.html dist/build/app.html` | Rename `dist/build/index.html` to `dist/build/app.html`. |
