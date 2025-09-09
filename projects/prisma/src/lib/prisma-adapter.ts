import type {
  AdminAdapter,
  ResourceMetadata,
  ListQuery,
  ListResult,
} from '@ng-admin/core';

export class PrismaAdapter<T extends { id: any }>
  implements AdminAdapter<T, T['id']>
{
  constructor(
    private readonly model: any,
    private readonly metadata: Omit<ResourceMetadata, 'id'> & { id?: string },
  ) {}
  getResourceMetadata(): ResourceMetadata {
    return {
      id: this.metadata.id ?? this.model.name.toLowerCase(),
      ...this.metadata,
    };
  }
  async list(query?: ListQuery): Promise<ListResult<T>> {
    const page = query?.page ?? 1;
    const perPage = query?.perPage ?? 20;
    const skip = (page - 1) * perPage;
    const orderBy = query?.sortBy
      ? { [query.sortBy]: query.sortDirection === 'desc' ? 'desc' : 'asc' }
      : undefined;
    const where = query?.filters as any;
    const [total, records] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({ skip, take: perPage, orderBy, where }),
    ]);
    return { total, records } as ListResult<T>;
  }
  findOne(id: T['id']): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }
  create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }
  update(id: T['id'], data: Partial<T>): Promise<T> {
    return this.model.update({ where: { id }, data });
  }
  async delete(id: T['id']): Promise<void> {
    await this.model.delete({ where: { id } });
  }
}
