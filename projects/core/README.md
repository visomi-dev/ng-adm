# @ng-admin/core

The core headless library for the Angular Admin framework, providing resource management and CRUD operations without any UI components.

## Features

- **Headless Architecture**: No UI components, pure TypeScript
- **Resource Management**: Register and manage admin resources
- **Adapter Pattern**: Pluggable data adapters for different backends
- **TypeScript First**: Full type safety with comprehensive interfaces
- **ESM Only**: Modern ES module support

## Installation

```bash
npm install @ng-admin/core
```

## Usage

### Basic Setup

```typescript
import { AdminAngular, MemoryAdapter, ResourceOptions } from '@ng-admin/core';

// Create admin instance
const admin = new AdminAngular();

// Define a resource
const userResource: ResourceOptions = {
  name: 'users',
  label: 'Users',
  properties: [
    { name: 'id', type: 'number', isVisible: false },
    { name: 'name', type: 'string', required: true },
    { name: 'email', type: 'string', required: true },
    { name: 'isActive', type: 'boolean', required: true },
    { name: 'createdAt', type: 'date', isVisibleInEdit: false },
  ],
  adapter: new MemoryAdapter(),
};

// Register the resource
admin.registerResource(userResource);

// Or register multiple resources at once
admin.registerResource([userResource, anotherResource]);
```

### Constructor-based Resource Registration

You can also initialize AdminAngular with resources directly in the constructor:

```typescript
// Initialize with resources in constructor
const admin = new AdminAngular([userResource, anotherResource]);

// Or create empty and register later
const admin = new AdminAngular();
admin.registerResource(userResource);
```

### Using Adapters

```typescript
// Create adapter instance (untyped - uses BaseRecord)
const adapter = new MemoryAdapter();

// Create typed adapter instance
interface User extends BaseRecord {
  name: string;
  email: string;
  isActive: boolean;
}

const typedAdapter = new MemoryAdapter<User>();

// List records (with type inference)
const users = await typedAdapter.list({
  resource: userResource,
  params: { page: 1, limit: 10 },
});

// Create a record (fully typed)
const newUser = await typedAdapter.create(
  {
    resource: userResource,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    isActive: true,
  },
);

// Update a record (fully typed)
const updatedUser = await typedAdapter.update(
  {
    resource: userResource,
  },
  1,
  {
    name: 'Jane Doe',
  },
);

// Delete a record
await typedAdapter.delete(
  {
    resource: userResource,
  },
  1,
);
```

### Type Safety

The MemoryAdapter supports full TypeScript type safety through generics:

```typescript
// All records must extend BaseRecord
interface User extends BaseRecord {
  name: string;
  email: string;
  isActive: boolean;
  // id, createdAt, updatedAt are automatically managed
}

// Use the typed adapter
const adapter = new MemoryAdapter<User>();

// TypeScript will enforce correct types for all operations
const user = await adapter.create(context, {
  name: 'John',
  email: 'john@example.com',
  isActive: true,
});
// user is typed as User with id, createdAt, updatedAt
```

### Property Types

Supported property types:

- `string`: Text fields
- `number`: Numeric fields
- `boolean`: True/false values
- `date`: Date/time values
- `json`: Complex objects
- `reference`: Links to other resources

### Property Configuration

```typescript
const properties: PropertyOptions[] = [
  {
    name: 'title',
    type: 'string',
    label: 'Title',
    required: true,
    isVisible: true, // Show in list view
    isVisibleInShow: true, // Show in detail view
    isVisibleInEdit: true, // Show in edit form
  },
  {
    name: 'categoryId',
    type: 'reference',
    reference: 'categories', // Reference to categories resource
    required: true,
  },
];
```

## API Reference

### AdminAngular

Main class for managing resources:

**Constructor:**

- `new AdminAngular(resources?: ResourceOptions[])`: Create instance with optional initial resources

**Resource Registration:**

- `registerResource(resource: ResourceOptions)`: Register a single resource
- `registerResource(resources: ResourceOptions[])`: Register multiple resources

**Resource Management:**

- `getResource(name: string)`: Get a resource by name
- `getResources()`: Get all registered resources
- `hasResource(name: string)`: Check if resource exists
- `unregisterResource(name: string)`: Remove a resource
- `getResourceCount()`: Get total number of resources

### BaseRecord

Base type that all stored records should extend:

```typescript
type BaseRecord = {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
};
```

### MemoryAdapter<T extends BaseRecord>

Generic in-memory adapter for testing and development:

**Type Parameters:**

- `T`: The type of records stored (must extend BaseRecord)

**Methods:**

- `list(context: ActionContext): Promise<{ data: T[]; total: number }>`: List records with pagination/filtering
- `show(context: ActionContext, id): Promise<T>`: Get single record
- `create(context: ActionContext, data): Promise<T>`: Create new record
- `update(context: ActionContext, id, data): Promise<T>`: Update existing record
- `delete(context: ActionContext, id): Promise<boolean>`: Delete record
- `clear(resourceName?)`: Clear all data (for testing)

**Usage:**

```typescript
// Untyped (uses BaseRecord)
const adapter = new MemoryAdapter();

// Typed
interface User extends BaseRecord {
  name: string;
  email: string;
}
const typedAdapter = new MemoryAdapter<User>();
```

## Building

```bash
npm run build
```

## License

MIT
