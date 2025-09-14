import { MemoryAdapter, BaseRecord } from './memory-adapter';
import { ResourceOptions, PropertyOptions, ActionContext } from './types';

// Test record type
type TestRecord = BaseRecord & {
  name: string;
  email: string;
  age?: number;
  active: boolean;
};

describe('MemoryAdapter', () => {
  let adapter: MemoryAdapter<TestRecord>;
  let mockResource: ResourceOptions<TestRecord>;
  let context: ActionContext<TestRecord>;

  beforeEach(() => {
    adapter = new MemoryAdapter();

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

  afterEach(() => {
    adapter.clear();
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      expect(adapter).toBeTruthy();
    });
  });

  describe('list', () => {
    it('should return empty array when no records exist', async () => {
      const result = await adapter.list(context);
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should return all records when no filtering is applied', async () => {
      const record1: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      const record2: TestRecord = {
        id: 2,
        name: 'Jane',
        email: 'jane@example.com',
        active: false,
      };

      await adapter.create(context, record1);
      await adapter.create(context, record2);

      const result = await adapter.list(context);
      expect(result.data.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.data[0]).toEqual(record1);
      expect(result.data[1]).toEqual(record2);
    });

    it('should support filtering', async () => {
      const record1: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      const record2: TestRecord = {
        id: 2,
        name: 'Jane',
        email: 'jane@example.com',
        active: false,
      };

      await adapter.create(context, record1);
      await adapter.create(context, record2);

      const filterContext: ActionContext<TestRecord> = {
        ...context,
        params: { filter: { active: true } },
      };

      const result = await adapter.list(filterContext);
      expect(result.data.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.data[0]).toEqual(record1);
    });

    it('should support sorting by string fields', async () => {
      const record1: TestRecord = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        active: true,
      };
      const record2: TestRecord = {
        id: 2,
        name: 'Bob',
        email: 'bob@example.com',
        active: true,
      };
      const record3: TestRecord = {
        id: 3,
        name: 'Charlie',
        email: 'charlie@example.com',
        active: true,
      };

      await adapter.create(context, record3);
      await adapter.create(context, record1);
      await adapter.create(context, record2);

      const sortContext: ActionContext<TestRecord> = {
        ...context,
        params: { sortBy: 'name', sortOrder: 'asc' },
      };

      const result = await adapter.list(sortContext);
      expect(result.data[0].name).toBe('Alice');
      expect(result.data[1].name).toBe('Bob');
      expect(result.data[2].name).toBe('Charlie');
    });

    it('should support sorting by string fields in descending order', async () => {
      const record1: TestRecord = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        active: true,
      };
      const record2: TestRecord = {
        id: 2,
        name: 'Bob',
        email: 'bob@example.com',
        active: true,
      };

      await adapter.create(context, record1);
      await adapter.create(context, record2);

      const sortContext: ActionContext<TestRecord> = {
        ...context,
        params: { sortBy: 'name', sortOrder: 'desc' },
      };

      const result = await adapter.list(sortContext);
      expect(result.data[0].name).toBe('Bob');
      expect(result.data[1].name).toBe('Alice');
    });

    it('should support sorting by number fields', async () => {
      const record1: TestRecord = {
        id: 1,
        name: 'User1',
        email: 'user1@example.com',
        active: true,
        age: 25,
      };
      const record2: TestRecord = {
        id: 2,
        name: 'User2',
        email: 'user2@example.com',
        active: true,
        age: 20,
      };
      const record3: TestRecord = {
        id: 3,
        name: 'User3',
        email: 'user3@example.com',
        active: true,
        age: 30,
      };

      await adapter.create(context, record1);
      await adapter.create(context, record3);
      await adapter.create(context, record2);

      const sortContext: ActionContext<TestRecord> = {
        ...context,
        params: { sortBy: 'age', sortOrder: 'asc' },
      };

      const result = await adapter.list(sortContext);
      expect(result.data[0].age).toBe(20);
      expect(result.data[1].age).toBe(25);
      expect(result.data[2].age).toBe(30);
    });

    it('should handle null values in sorting', async () => {
      const record1: TestRecord = {
        id: 1,
        name: 'User1',
        email: 'user1@example.com',
        active: true,
        age: 25,
      };
      const record2: TestRecord = {
        id: 2,
        name: 'User2',
        email: 'user2@example.com',
        active: true,
      }; // no age
      const record3: TestRecord = {
        id: 3,
        name: 'User3',
        email: 'user3@example.com',
        active: true,
        age: 30,
      };

      await adapter.create(context, record1);
      await adapter.create(context, record2);
      await adapter.create(context, record3);

      const sortContext: ActionContext<TestRecord> = {
        ...context,
        params: { sortBy: 'age', sortOrder: 'asc' },
      };

      const result = await adapter.list(sortContext);
      expect(result.data[0].age).toBeUndefined();
      expect(result.data[1].age).toBe(25);
      expect(result.data[2].age).toBe(30);
    });

    it('should support pagination', async () => {
      // Create 5 records
      for (let i = 1; i <= 5; i++) {
        const record: TestRecord = {
          id: i,
          name: `User${i}`,
          email: `user${i}@example.com`,
          active: true,
        };
        await adapter.create(context, record);
      }

      // Get page 1 with limit 2
      const page1Context: ActionContext<TestRecord> = {
        ...context,
        params: { page: 1, limit: 2 },
      };

      const page1Result = await adapter.list(page1Context);
      expect(page1Result.data.length).toBe(2);
      expect(page1Result.total).toBe(5);
      expect(page1Result.data[0].name).toBe('User1');
      expect(page1Result.data[1].name).toBe('User2');

      // Get page 2 with limit 2
      const page2Context: ActionContext<TestRecord> = {
        ...context,
        params: { page: 2, limit: 2 },
      };

      const page2Result = await adapter.list(page2Context);
      expect(page2Result.data.length).toBe(2);
      expect(page2Result.total).toBe(5);
      expect(page2Result.data[0].name).toBe('User3');
      expect(page2Result.data[1].name).toBe('User4');

      // Get page 3 with limit 2 (should have only 1 record)
      const page3Context: ActionContext<TestRecord> = {
        ...context,
        params: { page: 3, limit: 2 },
      };

      const page3Result = await adapter.list(page3Context);
      expect(page3Result.data.length).toBe(1);
      expect(page3Result.total).toBe(5);
      expect(page3Result.data[0].name).toBe('User5');
    });

    it('should use default pagination values', async () => {
      // Create 15 records
      for (let i = 1; i <= 15; i++) {
        const record: TestRecord = {
          id: i,
          name: `User${i}`,
          email: `user${i}@example.com`,
          active: true,
        };
        await adapter.create(context, record);
      }

      const result = await adapter.list(context); // no pagination params
      expect(result.data.length).toBe(10); // default limit
      expect(result.total).toBe(15);
    });

    it('should handle empty params', async () => {
      const record: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      await adapter.create(context, record);

      const result = await adapter.list(context);
      expect(result.data.length).toBe(1);
      expect(result.total).toBe(1);
    });
  });

  describe('show', () => {
    it('should return a record by numeric ID', async () => {
      const record: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      await adapter.create(context, record);

      const result = await adapter.show(context, 1);
      expect(result).toEqual(record);
    });

    it('should return a record by string ID', async () => {
      const record: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      await adapter.create(context, record);

      const result = await adapter.show(context, '1');
      expect(result).toEqual(record);
    });

    it('should throw error when record not found', async () => {
      await expectAsync(adapter.show(context, 999)).toBeRejectedWith(
        'Record with id 999 not found in resource users',
      );
    });
  });

  describe('create', () => {
    it('should create a new record with auto-generated ID', async () => {
      const data: Omit<TestRecord, 'id'> = {
        name: 'John',
        email: 'john@example.com',
        active: true,
      };

      const result = await adapter.create(context, data as TestRecord);

      expect(result.id).toBe(1);
      expect(result.name).toBe('John');
      expect(result.email).toBe('john@example.com');
      expect(result.active).toBe(true);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate sequential IDs', async () => {
      const data1: Omit<TestRecord, 'id'> = {
        name: 'User1',
        email: 'user1@example.com',
        active: true,
      };
      const data2: Omit<TestRecord, 'id'> = {
        name: 'User2',
        email: 'user2@example.com',
        active: true,
      };

      const result1 = await adapter.create(context, data1 as TestRecord);
      const result2 = await adapter.create(context, data2 as TestRecord);

      expect(result1.id).toBe(1);
      expect(result2.id).toBe(2);
    });

    it('should preserve existing ID if provided', async () => {
      const data: TestRecord = {
        id: 100,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      const result = await adapter.create(context, data);

      expect(result.id).toBe(100);
    });

    it('should override createdAt and updatedAt timestamps', async () => {
      const existingDate = new Date('2020-01-01');
      const data: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
        createdAt: existingDate,
        updatedAt: existingDate,
      };

      const result = await adapter.create(context, data);

      expect(result.createdAt).not.toBe(existingDate);
      expect(result.updatedAt).not.toBe(existingDate);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('update', () => {
    it('should update an existing record by numeric ID', async () => {
      const originalRecord: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      await adapter.create(context, originalRecord);

      const updateData: TestRecord = {
        id: 1,
        name: 'John Updated',
        email: 'john@example.com',
        active: false,
      };
      const result = await adapter.update(context, 1, updateData);

      expect(result.id).toBe(1);
      expect(result.name).toBe('John Updated');
      expect(result.active).toBe(false);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should update an existing record by string ID', async () => {
      const originalRecord: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      await adapter.create(context, originalRecord);

      const updateData: TestRecord = {
        id: 1,
        name: 'John Updated',
        email: 'john@example.com',
        active: false,
      };
      const result = await adapter.update(context, '1', updateData);

      expect(result.name).toBe('John Updated');
    });

    it('should preserve original data when not provided in update', async () => {
      const originalRecord: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      await adapter.create(context, originalRecord);

      const updateData: TestRecord = {
        id: 1,
        name: 'John Updated',
        email: 'john@example.com',
        active: true,
      };
      const result = await adapter.update(context, 1, updateData);

      expect(result.name).toBe('John Updated');
      expect(result.email).toBe('john@example.com'); // preserved
      expect(result.active).toBe(true); // preserved
    });

    it('should throw error when updating non-existent record', async () => {
      const updateData: TestRecord = {
        id: 999,
        name: 'Non-existent',
        email: 'test@example.com',
        active: true,
      };

      await expectAsync(
        adapter.update(context, 999, updateData),
      ).toBeRejectedWith('Record with id 999 not found in resource users');
    });

    it('should update updatedAt timestamp', async () => {
      const originalRecord: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      const createdRecord = await adapter.create(context, originalRecord);

      const originalUpdatedAt = createdRecord.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => {
        setTimeout(resolve, 1);
      });

      const updateData: TestRecord = {
        id: 1,
        name: 'John Updated',
        email: 'john@example.com',
        active: true,
      };
      const updatedRecord = await adapter.update(context, 1, updateData);

      expect(updatedRecord.updatedAt!.getTime()).toBeGreaterThan(
        originalUpdatedAt!.getTime(),
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing record by numeric ID and return true', async () => {
      const record: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      await adapter.create(context, record);

      const result = await adapter.delete(context, 1);
      expect(result).toBe(true);

      // Verify record is deleted
      await expectAsync(adapter.show(context, 1)).toBeRejected();
    });

    it('should delete an existing record by string ID and return true', async () => {
      const record: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      await adapter.create(context, record);

      const result = await adapter.delete(context, '1');
      expect(result).toBe(true);
    });

    it('should return false when deleting non-existent record', async () => {
      const result = await adapter.delete(context, 999);
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all data for a specific resource', async () => {
      const record1: TestRecord = {
        id: 1,
        name: 'User1',
        email: 'user1@example.com',
        active: true,
      };
      const record2: TestRecord = {
        id: 2,
        name: 'User2',
        email: 'user2@example.com',
        active: true,
      };

      await adapter.create(context, record1);
      await adapter.create(context, record2);

      expect((await adapter.list(context)).total).toBe(2);

      adapter.clear('users');

      expect((await adapter.list(context)).total).toBe(0);
    });

    it('should clear all data when no resource specified', async () => {
      const record1: TestRecord = {
        id: 1,
        name: 'User1',
        email: 'user1@example.com',
        active: true,
      };
      const record2: TestRecord = {
        id: 2,
        name: 'User2',
        email: 'user2@example.com',
        active: true,
      };

      await adapter.create(context, record1);
      await adapter.create(context, record2);

      expect((await adapter.list(context)).total).toBe(2);

      adapter.clear();

      expect((await adapter.list(context)).total).toBe(0);
    });
  });

  describe('resource isolation', () => {
    it('should maintain separate data for different resources', async () => {
      const userAdapter = new MemoryAdapter<TestRecord>();
      const postAdapter = new MemoryAdapter<BaseRecord>();

      const userResource: ResourceOptions<TestRecord> = {
        name: 'users',
        properties: [],
        adapter: userAdapter,
      };

      const postResource: ResourceOptions<BaseRecord> = {
        name: 'posts',
        properties: [],
        adapter: postAdapter,
      };

      const userContext: ActionContext<TestRecord> = { resource: userResource };
      const postContext: ActionContext<BaseRecord> = { resource: postResource };

      const userRecord: TestRecord = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        active: true,
      };
      const postRecord = { id: 1, title: 'Post 1', content: 'Content 1' };

      // Use correct ActionContext types for create/list to avoid type errors
      await userAdapter.create(userContext as any, userRecord);
      await postAdapter.create(postContext as any, postRecord);

      expect((await userAdapter.list(userContext as any)).total).toBe(1);
      expect((await postAdapter.list(postContext as any)).total).toBe(1);
    });
  });
});
