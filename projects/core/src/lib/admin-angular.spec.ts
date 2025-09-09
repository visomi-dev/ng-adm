import { AdminAngular, createAdminAngular } from './admin-angular';
import { ResourceOptions, PropertyOptions } from './types';
import { MemoryAdapter } from './memory-adapter';

describe('AdminAngular', () => {
  let admin: AdminAngular;

  // Mock resource options for testing
  const mockProperty: PropertyOptions<{ id: number; name: string }> = {
    name: 'name',
    type: 'string',
    required: true,
    label: 'Name',
  };

  const mockResource: ResourceOptions<{ id: number; name: string }> = {
    name: 'users',
    properties: [mockProperty],
    adapter: new MemoryAdapter(),
    label: 'Users',
  };

  const mockResource2: ResourceOptions<{ id: number; email: string }> = {
    name: 'posts',
    properties: [
      {
        name: 'email',
        type: 'email',
        required: true,
        label: 'Email',
      },
    ],
    adapter: new MemoryAdapter(),
    label: 'Posts',
  };

  beforeEach(() => {
    admin = new AdminAngular();
  });

  describe('constructor', () => {
    it('should create an instance without resources', () => {
      expect(admin).toBeTruthy();
      expect(admin.getResourceCount()).toBe(0);
    });

    it('should create an instance with initial resources', () => {
      const adminWithResources = new AdminAngular({
        resources: [mockResource],
      });

      expect(adminWithResources).toBeTruthy();
      expect(adminWithResources.getResourceCount()).toBe(1);
      expect(adminWithResources.hasResource('users')).toBe(true);
    });
  });

  describe('registerResource', () => {
    it('should register a single resource successfully', () => {
      admin.registerResource(mockResource);

      expect(admin.hasResource('users')).toBe(true);
      expect(admin.getResourceCount()).toBe(1);
    });

    it('should throw error when registering duplicate resource', () => {
      admin.registerResource(mockResource);

      expect(() => admin.registerResource(mockResource)).toThrow(
        "Resource with name 'users' is already registered",
      );
    });

    it('should handle errors when registering multiple resources', () => {
      admin.registerResource(mockResource);

      const duplicateResource = { ...mockResource, name: 'users' };
      const newResource = { ...mockResource2 };

      expect(() =>
        admin.registerResource([duplicateResource, newResource]),
      ).toThrow(/Failed to register some resources/);
    });
  });

  describe('getResource', () => {
    it('should return the resource when it exists', () => {
      admin.registerResource(mockResource);

      const resource = admin.getResource('users');
      expect(resource).toBe(mockResource);
    });

    it('should return undefined when resource does not exist', () => {
      const resource = admin.getResource('nonexistent');
      expect(resource).toBeUndefined();
    });
  });

  describe('getResources', () => {
    it('should return all registered resources', () => {
      admin.registerResource(mockResource);
      admin.registerResource(mockResource2);

      const resources = admin.getResources();
      expect(resources).toHaveLength(2);
      expect(resources).toContain(mockResource);
      expect(resources).toContain(mockResource2);
    });

    it('should return empty array when no resources are registered', () => {
      const resources = admin.getResources();
      expect(resources).toHaveLength(0);
    });
  });

  describe('hasResource', () => {
    it('should return true when resource exists', () => {
      admin.registerResource(mockResource);
      expect(admin.hasResource('users')).toBe(true);
    });

    it('should return false when resource does not exist', () => {
      expect(admin.hasResource('nonexistent')).toBe(false);
    });
  });

  describe('unregisterResource', () => {
    it('should remove an existing resource and return true', () => {
      admin.registerResource(mockResource);
      expect(admin.hasResource('users')).toBe(true);

      const result = admin.unregisterResource('users');
      expect(result).toBe(true);
      expect(admin.hasResource('users')).toBe(false);
      expect(admin.getResourceCount()).toBe(0);
    });

    it('should return false when trying to remove non-existent resource', () => {
      const result = admin.unregisterResource('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('getResourceCount', () => {
    it('should return 0 when no resources are registered', () => {
      expect(admin.getResourceCount()).toBe(0);
    });

    it('should return correct count after registering resources', () => {
      admin.registerResource(mockResource);
      expect(admin.getResourceCount()).toBe(1);

      admin.registerResource(mockResource2);
      expect(admin.getResourceCount()).toBe(2);

      admin.unregisterResource('users');
      expect(admin.getResourceCount()).toBe(1);
    });
  });

  describe('createAdminAngular', () => {
    it('should create an AdminAngular instance without options', () => {
      const instance = createAdminAngular();
      expect(instance).toBeInstanceOf(AdminAngular);
      expect(instance.getResourceCount()).toBe(0);
    });

    it('should create an AdminAngular instance with resources', () => {
      const instance = createAdminAngular({ resources: [mockResource] });
      expect(instance).toBeInstanceOf(AdminAngular);
      expect(instance.getResourceCount()).toBe(1);
      expect(instance.hasResource('users')).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should handle complex resource management workflow', () => {
      // Register resources
      admin.registerResource([mockResource, mockResource2]);
      expect(admin.getResourceCount()).toBe(2);

      // Verify resources exist
      expect(admin.hasResource('users')).toBe(true);
      expect(admin.hasResource('posts')).toBe(true);

      // Get specific resource
      const usersResource = admin.getResource('users');
      expect(usersResource?.name).toBe('users');

      // Get all resources
      const allResources = admin.getResources();
      expect(allResources).toHaveLength(2);

      // Remove one resource
      admin.unregisterResource('users');
      expect(admin.getResourceCount()).toBe(1);
      expect(admin.hasResource('users')).toBe(false);
      expect(admin.hasResource('posts')).toBe(true);

      // Add resource back
      admin.registerResource(mockResource);
      expect(admin.getResourceCount()).toBe(2);
    });
  });
});
