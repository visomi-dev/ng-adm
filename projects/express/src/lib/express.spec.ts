import { Router, Request, Response } from 'express';
import {
  AdminAngular,
  MemoryAdapter,
  ResourceOptions,
  PropertyOptions,
} from '@ng-adm/core';

import { buildAdminRouter } from './express';

// Mock Express types
type TestRecord = {
  id: number;
  name: string;
  email: string;
};

describe('buildAdminRouter', () => {
  let admin: AdminAngular;
  let mockAdapter: MemoryAdapter<TestRecord>;
  let mockResource: ResourceOptions<TestRecord>;
  let router: Router;

  beforeEach(() => {
    admin = new AdminAngular();

    const mockProperty: PropertyOptions<TestRecord> = {
      name: 'name',
      type: 'string',
      required: true,
      label: 'Name',
    };

    mockAdapter = new MemoryAdapter<TestRecord>();

    mockResource = {
      name: 'users',
      properties: [mockProperty],
      adapter: mockAdapter,
      label: 'Users',
    };

    admin.registerResource(mockResource);
    router = buildAdminRouter(admin);
  });

  describe('router creation', () => {
    it('should create a router instance', () => {
      expect(router).toBeDefined();
      expect(typeof router).toBe('function');
    });
  });

  describe('GET /resources', () => {
    it('should return all resources metadata', async () => {
      const mockReq = {} as Request;
      const mockRes = {
        json: jasmine.createSpy(),
      } as unknown as Response;

      // Mock router.get to capture the handler
      const getSpy = spyOn(router, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.json).toHaveBeenCalledWith([mockResource]);
    });

    it('should handle errors and return 500 status', async () => {
      const mockReq = {} as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      // Create admin that will throw error
      const errorAdmin = new AdminAngular();
      Object.defineProperty(errorAdmin, 'getResources', {
        value: () => {
          throw new Error('Test error');
        },
      });

      const errorRouter = buildAdminRouter(errorAdmin);
      const getSpy = spyOn(errorRouter, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return errorRouter;
      });

      buildAdminRouter(errorAdmin);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Test error',
      });
    });
  });

  describe('GET /resources/:name', () => {
    it('should return single resource metadata', async () => {
      const mockReq = {
        params: { name: 'users' },
      } as unknown as Request;
      const mockRes = {
        json: jasmine.createSpy(),
      } as unknown as Response;

      const getSpy = spyOn(router, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.json).toHaveBeenCalledWith({
        name: 'users',
        label: 'Users',
        properties: mockResource.properties,
      });
    });

    it('should return 404 for non-existent resource', async () => {
      const mockReq = {
        params: { name: 'nonexistent' },
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const getSpy = spyOn(router, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Resource 'nonexistent' not found",
      });
    });

    it('should handle errors and return 500 status', async () => {
      const mockReq = {
        params: { name: 'users' },
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const errorAdmin = new AdminAngular();
      Object.defineProperty(errorAdmin, 'getResource', {
        value: () => {
          throw new Error('Test error');
        },
      });

      const errorRouter = buildAdminRouter(errorAdmin);
      const getSpy = spyOn(errorRouter, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return errorRouter;
      });

      buildAdminRouter(errorAdmin);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Test error',
      });
    });
  });

  describe('GET /resources/:name/list', () => {
    it('should list records using adapter.list', async () => {
      // Create a test record
      await mockAdapter.create(
        { resource: mockResource, params: {} },
        { id: 1, name: 'John', email: 'john@example.com' },
      );

      const mockReq = {
        params: { name: 'users' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        json: jasmine.createSpy(),
      } as unknown as Response;

      const getSpy = spyOn(router, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/list') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.json).toHaveBeenCalledWith({
        data: [
          {
            id: 1,
            name: 'John',
            email: 'john@example.com',
            createdAt: jasmine.any(Date),
            updatedAt: jasmine.any(Date),
          },
        ],
        total: 1,
      });
    });

    it('should return 404 for non-existent resource', async () => {
      const mockReq = {
        params: { name: 'nonexistent' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const getSpy = spyOn(router, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/list') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Resource 'nonexistent' not found",
      });
    });

    it('should pass query parameters to adapter', async () => {
      const mockReq = {
        params: { name: 'users' },
        query: {
          page: '1',
          limit: '10',
          filter: JSON.stringify({ name: 'John' }),
        },
      } as unknown as Request;
      const mockRes = {
        json: jasmine.createSpy(),
      } as unknown as Response;

      const getSpy = spyOn(router, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/list') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      // The adapter should receive the query parameters
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('GET /resources/:name/:id', () => {
    it('should return single record by ID', async () => {
      // Create a test record
      const testRecord = await mockAdapter.create(
        { resource: mockResource, params: {} },
        { id: 1, name: 'John', email: 'john@example.com' },
      );

      const mockReq = {
        params: { name: 'users', id: '1' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        json: jasmine.createSpy(),
      } as unknown as Response;

      const getSpy = spyOn(router, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/:id') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.json).toHaveBeenCalledWith(testRecord);
    });

    it('should return 404 for non-existent resource', async () => {
      const mockReq = {
        params: { name: 'nonexistent', id: '1' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const getSpy = spyOn(router, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/:id') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Resource 'nonexistent' not found",
      });
    });
  });

  describe('POST /resources/:name', () => {
    it('should create new record and return 201 status', async () => {
      const newRecord = { name: 'Jane', email: 'jane@example.com' };

      const mockReq = {
        params: { name: 'users' },
        query: {},
        body: newRecord,
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const postSpy = spyOn(router, 'post');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      postSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should return 404 for non-existent resource', async () => {
      const mockReq = {
        params: { name: 'nonexistent' },
        query: {},
        body: { name: 'Test' },
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const postSpy = spyOn(router, 'post');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      postSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Resource 'nonexistent' not found",
      });
    });
  });

  describe('PUT /resources/:name/:id', () => {
    it('should update record and return updated data', async () => {
      // Create a test record
      await mockAdapter.create(
        { resource: mockResource, params: {} },
        { id: 1, name: 'John', email: 'john@example.com' },
      );

      const updateData = {
        id: 1,
        name: 'John Updated',
        email: 'john@example.com',
      };

      const mockReq = {
        params: { name: 'users', id: '1' },
        query: {},
        body: updateData,
      } as unknown as Request;
      const mockRes = {
        json: jasmine.createSpy(),
      } as unknown as Response;

      const putSpy = spyOn(router, 'put');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      putSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/:id') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should return 404 for non-existent resource', async () => {
      const mockReq = {
        params: { name: 'nonexistent', id: '1' },
        query: {},
        body: { name: 'Test' },
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const putSpy = spyOn(router, 'put');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      putSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/:id') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Resource 'nonexistent' not found",
      });
    });
  });

  describe('DELETE /resources/:name/:id', () => {
    it('should delete record and return 204 status', async () => {
      // Create a test record
      await mockAdapter.create(
        { resource: mockResource, params: {} },
        { id: 1, name: 'John', email: 'john@example.com' },
      );

      const mockReq = {
        params: { name: 'users', id: '1' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        send: jasmine.createSpy(),
      } as unknown as Response;

      const deleteSpy = spyOn(router, 'delete');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/:id') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return 404 for non-existent resource', async () => {
      const mockReq = {
        params: { name: 'nonexistent', id: '1' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const deleteSpy = spyOn(router, 'delete');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/:id') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Resource 'nonexistent' not found",
      });
    });

    it('should return 500 status when delete fails', async () => {
      const mockReq = {
        params: { name: 'users', id: '999' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const deleteSpy = spyOn(router, 'delete');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deleteSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/:id') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return router;
      });

      buildAdminRouter(admin);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Failed to delete record',
      });
    });
  });

  describe('middleware setup', () => {
    it('should use JSON middleware', () => {
      const useSpy = spyOn(router, 'use');
      buildAdminRouter(admin);

      // Check if JSON middleware was applied
      expect(useSpy).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle adapter errors properly', async () => {
      // Create a mock adapter that throws an error
      const errorAdapter = {
        list: jasmine.createSpy().and.rejectWith(new Error('Adapter error')),
        show: jasmine.createSpy().and.rejectWith(new Error('Adapter error')),
        create: jasmine.createSpy().and.rejectWith(new Error('Adapter error')),
        update: jasmine.createSpy().and.rejectWith(new Error('Adapter error')),
        delete: jasmine.createSpy().and.rejectWith(new Error('Adapter error')),
      };

      const errorResource: ResourceOptions<TestRecord> = {
        ...mockResource,
        adapter: errorAdapter as unknown as MemoryAdapter<TestRecord>,
      };

      const errorAdmin = new AdminAngular();
      errorAdmin.registerResource(errorResource);

      const mockReq = {
        params: { name: 'users' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const errorRouter = buildAdminRouter(errorAdmin);
      const getSpy = spyOn(errorRouter, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/list') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return errorRouter;
      });

      buildAdminRouter(errorAdmin);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Adapter error',
      });
    });

    it('should handle unknown errors', async () => {
      const errorAdapter = {
        list: jasmine.createSpy().and.rejectWith('Unknown error'),
      };

      const errorResource: ResourceOptions<TestRecord> = {
        ...mockResource,
        adapter: errorAdapter as unknown as MemoryAdapter<TestRecord>,
      };

      const errorAdmin = new AdminAngular();
      errorAdmin.registerResource(errorResource);

      const mockReq = {
        params: { name: 'users' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const errorRouter = buildAdminRouter(errorAdmin);
      const getSpy = spyOn(errorRouter, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/list') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return errorRouter;
      });

      buildAdminRouter(errorAdmin);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Adapter error',
      });
    });

    it('should handle unknown errors', async () => {
      const errorAdapter = {
        list: jasmine.createSpy().and.rejectWith('Unknown error'),
      };

      const errorResource: ResourceOptions<TestRecord> = {
        ...mockResource,
        adapter: errorAdapter as unknown as MemoryAdapter<TestRecord>,
      };

      const errorAdmin = new AdminAngular();
      errorAdmin.registerResource(errorResource);

      const mockReq = {
        params: { name: 'users' },
        query: {},
      } as unknown as Request;
      const mockRes = {
        status: jasmine
          .createSpy()
          .and.returnValue({ json: jasmine.createSpy() }),
        json: jasmine.createSpy(),
      } as unknown as Response;

      const errorRouter = buildAdminRouter(errorAdmin);
      const getSpy = spyOn(errorRouter, 'get');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSpy.and.callFake((path: unknown, ...handlers: any[]) => {
        if (path === '/resources/:name/list') {
          const handler = handlers[0];
          if (typeof handler === 'function') {
            handler(mockReq, mockRes, jasmine.createSpy());
          }
        }
        return errorRouter;
      });

      buildAdminRouter(errorAdmin);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Unknown error occurred',
      });
    });
  });
});
