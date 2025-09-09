import type { Adapter, ActionContext } from '@ng-adm/core';

/**
 * Prisma client interface - using any to avoid direct dependency
 * In practice, this will be a PrismaClient instance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClient = any;

/**
 * PrismaAdapter implements the Adapter interface for Prisma ORM
 * Provides CRUD operations by delegating to Prisma model methods
 */
export class PrismaAdapter<T = Record<string, unknown>> implements Adapter<T> {
  constructor(
    private readonly client: PrismaClient,
    private readonly modelName: string,
  ) {}

  /**
   * List records with optional filtering, sorting, and pagination
   */
  async list(context: ActionContext<T>): Promise<{ data: T[]; total: number }> {
    const model = this.getModel();

    // Extract pagination parameters
    const page = context.params?.['page']
      ? parseInt(String(context.params['page']))
      : 1;

    const limit = context.params?.['limit']
      ? parseInt(String(context.params['limit']))
      : 10;

    const skip = (page - 1) * limit;

    // Extract sorting parameters
    const orderBy: Record<string, 'asc' | 'desc'> = {};

    if (context.params?.['sortBy'] && context.params?.['sortOrder']) {
      orderBy[String(context.params['sortBy'])] =
        context.params['sortOrder'] === 'desc' ? 'desc' : 'asc';
    }

    // Extract filtering parameters
    const where: Record<string, unknown> = {};

    if (context.params?.['filters']) {
      Object.assign(where, context.params['filters']);
    }

    // Execute count and findMany queries
    const [data, total] = await Promise.all([
      model.findMany({
        where,
        orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
        skip,
        take: limit,
      }),

      model.count({ where }),
    ]);

    return { data: data as T[], total };
  }

  /**
   * Get a single record by ID
   */
  async show(_context: ActionContext<T>, id: string | number): Promise<T> {
    const model = this.getModel();

    const record = await model.findUnique({
      where: { id },
    });

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    return record as T;
  }

  /**
   * Create a new record
   */
  async create(_context: ActionContext<T>, data: T): Promise<T> {
    const model = this.getModel();

    const record = await model.create({
      data: data as Record<string, unknown>,
    });

    return record as T;
  }

  /**
   * Update an existing record
   */
  async update(
    _context: ActionContext<T>,
    id: string | number,
    data: T,
  ): Promise<T> {
    const model = this.getModel();

    const record = await model.update({
      where: { id },
      data: data as Record<string, unknown>,
    });

    return record as T;
  }

  /**
   * Delete a record by ID
   */
  async delete(
    _context: ActionContext<T>,
    id: string | number,
  ): Promise<boolean> {
    const model = this.getModel();

    try {
      await model.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      // If record doesn't exist, Prisma throws an error
      return false;
    }
  }

  /**
   * Get the Prisma model instance by name
   * @private
   */
  private getModel() {
    const model = (this.client as any)[this.modelName];

    if (!model) {
      throw new Error(`Model '${this.modelName}' not found in Prisma client`);
    }

    return model;
  }
}

export function createPrismaAdapter<T = Record<string, unknown>>(
  client: PrismaClient,
  modelName: string,
): PrismaAdapter<T> {
  return new PrismaAdapter(client, modelName);
}
