# Express + Angular 1 + Webpack + Massive Boilerplate
A full-stack angular/express/webpack/massive.js (postgreSQL) scaffold.  

## Features
- Express API server
- Authentication
- Authorization
- Migrations
- [Webpack](https://www.npmjs.com/package/webpack) build pipeline (with babel es2015 preset)
- Responsive Angular.js + Bootstrap UI.
- Premade user & authorization scope management interface.
- Simple style-switching with [Bootswatch](https://bootswatch.com/)

## Prerequisites
Install:
- [docker](https://docs.docker.com/engine/installation/)
- [docker-compose](https://docs.docker.com/compose/install/)

## Quickstart
#### Install dependencies
```
npm install
```
#### Run PostgreSQL & Apply migrations
```
# run postgreSQL with compose in detached mode
docker-compose -f docker-compose-dev.yml up -d

# export postgres connection string variable
source ./env.sh

# apply migrations
npm run pg-migrate-up
```
#### Build Client
```
npm run build
```
#### Run dev server
```
npm run dev-server
```
#### Open
Point your browser to [http://localhost:3000](http://localhost:3000)
A default superuser user will have been created with the username/pass `admin/admin`

---

## Environment Variables
- `NODE_ENV` - `production` or `development`
- `NODE_SERVE_STATIC`- when `true` the client will be served by the Express server

## NPM Scripts
`package.json` contains a number of useful scripts.

### Client Build
#### Building
Webpack build:
```
npm run build
```
Webpack build & watch for changes
```
npm run webpack
```
### Dev Server
Run development server (reloads after file changes)
```
npm run dev-server
```
### Migrations
Migrations are handled with [node-pg-migrate](https://www.npmjs.com/package/node-pg-migrate). For further information, check out the documentation [here](https://www.npmjs.com/package/node-pg-migrate)

Create new migration. A file will be created in `migrations/`
```
npm run pg-migrate-create {migration_name}
```

Apply migrations
```
npm run pg-migrate-up
```

roll back migration
```
npm run pg-migrate-down
```

### Changing Bootswatch Style
Change line 1 in `client/src/index.js`, replacing `{bootswatch_theme}` with your chosen theme on [bootswatch.com](https://www.bootswatch.com)
```text
import "bootswatch/{bootswatch_theme}/bootstrap.min.css";
```


---

## TODO:
- tests
- add SASS to webpack build pipeline
- development/production environment settings
- remove scopes from users when deleting an authorization scope
- server + nginx (for static files) definition in compose


---

## License
Copyright 2017 Simon Tweed

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
