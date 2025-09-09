/**
 * Supported property types for resources
 */
export type PropertyType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'json'
  | 'reference';

/**
 * Options for configuring a property within a resource
 */
export type PropertyOptions = {
  /** The name of the property */
  name: string;
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
 */
export type ResourceOptions = {
  /** The name/identifier of the resource */
  name: string;
  /** List of properties that define this resource */
  properties: PropertyOptions[];
  /** The adapter that handles CRUD operations for this resource */
  adapter: Adapter;
  /** Display label for the resource */
  label?: string;
};

/**
 * Context passed to adapter methods containing metadata and parameters
 */

export type ActionContext = {
  /** The resource being operated on */
  resource: ResourceOptions;
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
  list(context: ActionContext): Promise<{ data: T[]; total: number }>;

  /**
   * Get a single record by ID
   */
  show(context: ActionContext, id: string | number): Promise<T>;

  /**
   * Create a new record
   */
  create(context: ActionContext, data: T): Promise<T>;

  /**
   * Update an existing record
   */
  update(context: ActionContext, id: string | number, data: T): Promise<T>;

  /**
   * Delete a record by ID
   */
  delete(context: ActionContext, id: string | number): Promise<boolean>;
};
