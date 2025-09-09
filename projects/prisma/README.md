## @ng-admin/prisma

Prisma adapter for AdminAngular. Wrap a Prisma model and provide `ResourceMetadata`.

```ts
import { PrismaAdapter } from 'prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const users = new PrismaAdapter(prisma.user, {
  name: 'user',
  label: 'Users',
  fields: [
    { name: 'id', type: 'number', isId: true, isVisible: true },
    { name: 'email', type: 'string', isEditable: true },
    { name: 'name', type: 'string', isEditable: true },
  ],
});
```
