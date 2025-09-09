import { Adapter, ActionContext } from './types';

/**
 * Base record type that all stored records should extend
 */
export type BaseRecord = {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * In-memory adapter implementation for testing and development
 * Stores data in arrays and provides basic CRUD operations
 *
 * @template T The type of records stored in this adapter
 */
export class MemoryAdapter<T extends BaseRecord = BaseRecord>
  implements Adapter<T>
{
  private data = new Map<string, T[]>();
  private idCounter = new Map<string, number>();

  /**
   * Get or create data array for a resource
   */
  private getDataArray(resourceName: string): T[] {
    if (!this.data.has(resourceName)) {
      this.data.set(resourceName, []);
    }
    return this.data.get(resourceName)!;
  }

  /**
   * Generate next ID for a resource
   */
  private getNextId(resourceName: string): number {
    const currentId = this.idCounter.get(resourceName) || 0;
    const nextId = currentId + 1;
    this.idCounter.set(resourceName, nextId);
    return nextId;
  }

  /**
   * List records with optional filtering, sorting, and pagination
   */
  async list(context: ActionContext<T>): Promise<{ data: T[]; total: number }> {
    const { resource, params = {} } = context;

    const dataArray = this.getDataArray(resource.name);

    let filteredData = [...dataArray];

    // Basic filtering support
    if (params['filter']) {
      const filter = params['filter'];

      filteredData = filteredData.filter((item) => {
        return Object.entries(filter).every(([key, value]) => {
          return (item as T)[key as keyof T] === value;
        });
      });
    }

    // Basic sorting support
    if (params['sortBy']) {
      const sortBy = params['sortBy'];
      const sortOrder = params['sortOrder'] === 'desc' ? -1 : 1;

      filteredData.sort((a, b) => {
        const aVal = (a as T)[sortBy as keyof T];
        const bVal = (b as T)[sortBy as keyof T];
        if (aVal == null && bVal == null) {
          return 0;
        }

        if (aVal == null) {
          return sortOrder;
        }

        if (bVal == null) {
          return -sortOrder;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * sortOrder;
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * sortOrder;
        }

        return 0;
      });
    }

    // Basic pagination support
    const page = params['page'] ?? 1;
    const limit = params['limit'] ?? 10;
    const offset = (page - 1) * limit;
    const paginatedData = filteredData.slice(offset, offset + limit);

    return {
      data: paginatedData,
      total: filteredData.length,
    };
  }

  /**
   * Get a single record by ID
   */
  async show(context: ActionContext<T>, id: string | number): Promise<T> {
    const { resource } = context;
    const dataArray = this.getDataArray(resource.name);
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    const item = dataArray.find((item) => item.id === numericId);
    if (!item) {
      throw new Error(
        `Record with id ${id} not found in resource ${resource.name}`,
      );
    }

    return item;
  }

  /**
   * Create a new record
   */
  async create(context: ActionContext<T>, data: T): Promise<T> {
    const { resource } = context;
    const dataArray = this.getDataArray(resource.name);

    const newItem = {
      id: this.getNextId(resource.name),
      ...(data as Omit<T, 'id' | 'createdAt' | 'updatedAt'>),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    dataArray.push(newItem);
    return newItem;
  }

  /**
   * Update an existing record
   */
  async update(
    context: ActionContext<T>,
    id: string | number,
    data: T,
  ): Promise<T> {
    const { resource } = context;
    const dataArray = this.getDataArray(resource.name);
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    const index = dataArray.findIndex((item) => item.id === numericId);

    if (index === -1) {
      throw new Error(
        `Record with id ${id} not found in resource ${resource.name}`,
      );
    }

    const updatedItem = {
      ...dataArray[index],
      ...(data as Omit<T, 'id' | 'createdAt' | 'updatedAt'>),
      updatedAt: new Date(),
    } as T;

    dataArray[index] = updatedItem;

    return updatedItem;
  }

  /**
   * Delete a record by ID
   */
  async delete(
    context: ActionContext<T>,
    id: string | number,
  ): Promise<boolean> {
    const { resource } = context;
    const dataArray = this.getDataArray(resource.name);
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    const index = dataArray.findIndex((item) => item.id === numericId);

    if (index === -1) {
      return false;
    }

    dataArray.splice(index, 1);

    return true;
  }

  /**
   * Clear all data for testing purposes
   */
  clear(resourceName?: string): void {
    if (resourceName) {
      this.data.delete(resourceName);
      this.idCounter.delete(resourceName);
    } else {
      this.data.clear();
      this.idCounter.clear();
    }
  }
}
