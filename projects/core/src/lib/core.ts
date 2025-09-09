export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'enum'
  | 'relation';

export type FieldMetadata = {
  name: string;
  type: FieldType;
  label?: string;
  isId?: boolean;
  isEditable?: boolean;
  isVisible?: boolean;
  enumValues?: string[];
  relation?: {
    resourceId: string;
    foreignKey: string;
    displayField?: string;
  };
};

export type ResourceMetadata = {
  id: string;
  name: string;
  label?: string;
  fields: FieldMetadata[];
};

export type ListQuery = {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
};

export type ListResult<TRecord> = {
  total: number;
  records: TRecord[];
};

export type AdminAdapter<RecordType = any, IdType = string> = {
  getResourceMetadata(): Promise<ResourceMetadata> | ResourceMetadata;
  list(query?: ListQuery): Promise<ListResult<RecordType>>;
  findOne(id: IdType): Promise<RecordType | null>;
  create(data: Partial<RecordType>): Promise<RecordType>;
  update(id: IdType, data: Partial<RecordType>): Promise<RecordType>;
  delete(id: IdType): Promise<{ id: IdType } | void>;
};

export type RegisteredResource = {
  id: string;
  adapter: AdminAdapter<any, any>;
};

export type AdminAngularOptions = {
  resources: RegisteredResource[];
};

export class AdminAngular {
  private resourceIdToAdapter = new Map<string, AdminAdapter<any, any>>();

  constructor(private readonly options: AdminAngularOptions) {
    for (const resource of options.resources) {
      if (this.resourceIdToAdapter.has(resource.id)) {
        throw new Error(`Duplicate resource id: ${resource.id}`);
      }

      this.resourceIdToAdapter.set(resource.id, resource.adapter);
    }
  }

  getResourceIds(): string[] {
    return Array.from(this.resourceIdToAdapter.keys());
  }

  getAdapter(resourceId: string): AdminAdapter<any, any> {
    const adapter = this.resourceIdToAdapter.get(resourceId);

    if (!adapter) {
      throw new Error(`Unknown resource: ${resourceId}`);
    }

    return adapter;
  }

  async getResourcesMetadata(): Promise<ResourceMetadata[]> {
    const metas = await Promise.all(
      this.getResourceIds().map(async (id) => {
        const adapter = this.getAdapter(id);
        const meta = await adapter.getResourceMetadata();
        return { ...meta, id };
      }),
    );

    return metas;
  }
}
