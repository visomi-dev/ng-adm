# NgAdmin

An AdminJS-inspired Angular admin framework with PrimeNG UI and pluggable backend.

## Packages

- `@ng-admin/core` – resource metadata and `AdminAngular` class
- `@ng-admin/express` – Express plugin exposing `/admin` CRUD endpoints
- `@ng-admin/prisma` – Prisma adapter
- `@ng-admin/ui` – Angular standalone PrimeNG UI

## Quick start (Express + Prisma)

```ts
import express from 'express';
import bodyParser from 'body-parser';
import { AdminAngular } from 'core';
import { buildExpressRouter } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from 'prisma';

const prisma = new PrismaClient();
const admin = new AdminAngular({
  resources: [
    {
      id: 'user',
      adapter: new PrismaAdapter(prisma.user, {
        name: 'user',
        label: 'Users',
        fields: [
          { name: 'id', type: 'number', isId: true, isVisible: true },
          { name: 'email', type: 'string', isEditable: true },
          { name: 'name', type: 'string', isEditable: true },
        ],
      }),
    },
  ],
});

const app = express();
app.use(bodyParser.json());
app.use(buildExpressRouter(admin, { basePath: '/admin' }));
app.listen(3000);
```

## Embed UI in Angular routing

```ts
import { Routes } from '@angular/router';
import { UiComponent } from 'ui';

export const routes: Routes = [{ path: 'admin-panel', component: UiComponent }];
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
