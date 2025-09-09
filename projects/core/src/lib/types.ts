/**
 * Supported property types for resources
 */
export type PropertyType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'json'
  | 'reference'
  | 'enum'
  | 'array'
  | 'object'
  | 'file'
  | 'password'
  | 'email'
  | 'url'
  | 'tel'
  | 'color'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'textarea'
  | 'html'
  | 'markdown'
  | 'richText'
  | 'text';

/**
 * Options for configuring a property within a resource
 * @template T The type of the object whose keys are valid property names
 */
export type PropertyOptions<T = Record<string, unknown>> = {
  /** The name of the property */
  name: keyof T;
  /** The type of the property */
  type: PropertyType;
  /** Whether this property is visible in list views */
  isVisible?: boolean;
  /** Whether this property is visible in show/detail views */
  isVisibleInShow?: boolean;
  /** Whether this property is visible in edit forms */
  isVisibleInEdit?: boolean;
  /** Whether this property is required */
  required?: boolean;
  /** Reference to another resource (only used when type is 'reference') */
  reference?: string;
  /** Display label for the property */
  label?: string;
};

/**
 * Options for configuring a resource
 * @template T The type of records stored in this resource
 */
export type ResourceOptions<T = Record<string, unknown>> = {
  /** The name/identifier of the resource */
  name: string;
  /** List of properties that define this resource */
  properties: PropertyOptions<T>[];
  /** The adapter that handles CRUD operations for this resource */
  adapter: Adapter<T>;
  /** Display label for the resource */
  label?: string;
};

/**
 * Context passed to adapter methods containing metadata and parameters
 * @template T The type of records stored in the resource
 */

export type ActionContext<T = Record<string, unknown>> = {
  /** The resource being operated on */
  resource: ResourceOptions<T>;
  /** Query parameters for filtering/sorting/pagination */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
  /** Additional metadata for the action */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>;
};

/**
 * Generic CRUD adapter interface
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Adapter<T = any> = {
  /**
   * List records with optional filtering, sorting, and pagination
   */
  list(context: ActionContext<T>): Promise<{ data: T[]; total: number }>;

  /**
   * Get a single record by ID
   */
  show(context: ActionContext<T>, id: string | number): Promise<T>;

  /**
   * Create a new record
   */
  create(context: ActionContext<T>, data: T): Promise<T>;

  /**
   * Update an existing record
   */
  update(context: ActionContext<T>, id: string | number, data: T): Promise<T>;

  /**
   * Delete a record by ID
   */
  delete(context: ActionContext<T>, id: string | number): Promise<boolean>;
};
