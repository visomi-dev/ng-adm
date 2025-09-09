import { PrismaAdapter, createPrismaAdapter } from './prisma';
import { ResourceOptions, PropertyOptions, ActionContext } from '@ng-adm/core';

// Mock Prisma client
type MockPrismaClient = {
  [key: string]: {
    findMany: jasmine.Spy;
    findUnique: jasmine.Spy;
    create: jasmine.Spy;
    update: jasmine.Spy;
    delete: jasmine.Spy;
    count: jasmine.Spy;
  };
};

type TestRecord = {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

describe('PrismaAdapter', () => {
  let adapter: PrismaAdapter<TestRecord>;
  let mockClient: MockPrismaClient;
  let mockModel: any;
  let mockResource: ResourceOptions<TestRecord>;
  let context: ActionContext<TestRecord>;

  beforeEach(() => {
    // Create mock model methods
    mockModel = {
      findMany: jasmine.createSpy(),
      findUnique: jasmine.createSpy(),
      create: jasmine.createSpy(),
      update: jasmine.createSpy(),
      delete: jasmine.createSpy(),
      count: jasmine.createSpy(),
    };

    // Create mock client with the model
    mockClient = {
      users: mockModel,
    };

    adapter = new PrismaAdapter(mockClient, 'users');

    const mockProperty: PropertyOptions<TestRecord> = {
      name: 'name',
      type: 'string',
      required: true,
      label: 'Name',
    };

    mockResource = {
      name: 'users',
      properties: [mockProperty],
      adapter: adapter,
      label: 'Users',
    };

    context = {
      resource: mockResource,
      params: {},
    };
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      expect(adapter).toBeTruthy();
    });

    it('should store client and model name', () => {
      expect((adapter as any).client).toBe(mockClient);
      expect((adapter as any).modelName).toBe('users');
    });
  });

  describe('list', () => {
    it('should return data and total count', async () => {
      const mockData = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ];

      mockModel.findMany.and.resolveTo(mockData);
      mockModel.count.and.resolveTo(2);

      const result = await adapter.list(context);

      expect(result.data).toEqual(mockData);
      expect(result.total).toBe(2);
      expect(mockModel.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: undefined,
        skip: 0,
        take: 10,
      });
      expect(mockModel.count).toHaveBeenCalledWith({ where: {} });
    });

    it('should handle pagination parameters', async () => {
      const mockData = [{ id: 1, name: 'John', email: 'john@example.com' }];
      mockModel.findMany.and.resolveTo(mockData);
      mockModel.count.and.resolveTo(25);

      const paginatedContext: ActionContext<TestRecord> = {
        ...context,
        params: { page: '2', limit: '5' },
      };

      const result = await adapter.list(paginatedContext);

      expect(result.data).toEqual(mockData);
      expect(result.total).toBe(25);
      expect(mockModel.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: undefined,
        skip: 5, // (page - 1) * limit = (2 - 1) * 5 = 5
        take: 5,
      });
    });

    it('should handle sorting parameters', async () => {
      const mockData = [{ id: 1, name: 'John', email: 'john@example.com' }];
      mockModel.findMany.and.resolveTo(mockData);
      mockModel.count.and.resolveTo(1);

      const sortedContext: ActionContext<TestRecord> = {
        ...context,
        params: { sortBy: 'name', sortOrder: 'desc' },
      };

      const result = await adapter.list(sortedContext);

      expect(mockModel.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { name: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should handle filtering parameters', async () => {
      const mockData = [{ id: 1, name: 'John', email: 'john@example.com' }];
      mockModel.findMany.and.resolveTo(mockData);
      mockModel.count.and.resolveTo(1);

      const filteredContext: ActionContext<TestRecord> = {
        ...context,
        params: { filters: { active: true } },
      };

      const result = await adapter.list(filteredContext);

      expect(mockModel.findMany).toHaveBeenCalledWith({
        where: { active: true },
        orderBy: undefined,
        skip: 0,
        take: 10,
      });
      expect(mockModel.count).toHaveBeenCalledWith({ where: { active: true } });
    });
  });

  describe('show', () => {
    it('should return a record by ID', async () => {
      const mockRecord = { id: 1, name: 'John', email: 'john@example.com' };
      mockModel.findUnique.and.resolveTo(mockRecord);

      const result = await adapter.show(context, 1);

      expect(result).toEqual(mockRecord);
      expect(mockModel.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw error when record not found', async () => {
      mockModel.findUnique.and.resolveTo(null);

      try {
        await adapter.show(context, 999);
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Record with id 999 not found');
      }
    });
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const newRecord = { id: 1, name: 'John', email: 'john@example.com' };
      const inputData = { name: 'John', email: 'john@example.com' };

      mockModel.create.and.resolveTo(newRecord);

      const result = await adapter.create(context, inputData as TestRecord);

      expect(result).toEqual(newRecord);
      expect(mockModel.create).toHaveBeenCalledWith({
        data: inputData,
      });
    });
  });

  describe('update', () => {
    it('should update an existing record', async () => {
      const updatedRecord = {
        id: 1,
        name: 'John Updated',
        email: 'john@example.com',
      };
      const updateData = { name: 'John Updated' };

      mockModel.update.and.resolveTo(updatedRecord);

      const result = await adapter.update(context, 1, updateData as TestRecord);

      expect(result).toEqual(updatedRecord);
      expect(mockModel.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });
  });

  describe('delete', () => {
    it('should delete a record successfully', async () => {
      mockModel.delete.and.resolveTo({ id: 1, name: 'Deleted User' });

      const result = await adapter.delete(context, 1);

      expect(result).toBe(true);
      expect(mockModel.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return false when record does not exist', async () => {
      // Prisma throws an error when trying to delete a non-existent record
      mockModel.delete.and.rejectWith(new Error('Record not found'));

      const result = await adapter.delete(context, 999);

      expect(result).toBe(false);
    });
  });

  describe('createPrismaAdapter', () => {
    it('should create a PrismaAdapter instance', () => {
      const adapter = createPrismaAdapter(mockClient, 'users');
      expect(adapter).toBeInstanceOf(PrismaAdapter);
    });
  });

  describe('error handling', () => {
    it('should handle Prisma client errors in list', async () => {
      mockModel.findMany.and.rejectWith(new Error('Database connection error'));
      mockModel.count.and.rejectWith(new Error('Database connection error'));

      try {
        await adapter.list(context);
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Database connection error');
      }
    });

    it('should handle Prisma client errors in show', async () => {
      mockModel.findUnique.and.rejectWith(new Error('Database error'));

      try {
        await adapter.show(context, 1);
        fail('Expected to throw an error');
      } catch (error) {
        expect(error.message).toBe('Database error');
      }
    });
  });
});
