import { ResourceOptions } from './types';

/**
 * Main AdminAngular class that manages resources for the admin framework
 */
export class AdminAngular {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resources = new Map<string, ResourceOptions<any>>();

  /**
   * Create a new AdminAngular instance
   * @param resources Optional array of resources to register immediately
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options?: { resources?: ResourceOptions<any>[] }) {
    if (options?.resources) {
      this.registerResources(options.resources);
    }
  }

  /**
   * Register a new resource with the admin framework
   * @param resource The resource options to register
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerResource(resource: ResourceOptions<any>): void;

  /**
   * Register multiple resources with the admin framework
   * @param resources Array of resource options to register
   */

  registerResource(resources: ResourceOptions[]): void;

  /**
   * Register resource(s) with the admin framework
   * @param resourceOrResources Single resource or array of resources to register
   */
  registerResource(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resourceOrResources: ResourceOptions<any> | ResourceOptions<any>[],
  ): void {
    if (Array.isArray(resourceOrResources)) {
      this.registerResources(resourceOrResources);
    } else {
      this.registerSingleResource(resourceOrResources);
    }
  }

  /**
   * Register multiple resources with the admin framework
   * @param resources Array of resource options to register
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private registerResources(resources: ResourceOptions<any>[]): void {
    const errors: string[] = [];

    for (const resource of resources) {
      try {
        this.registerSingleResource(resource);
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error.message);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(
        `Failed to register some resources:\n${errors.join('\n')}`,
      );
    }
  }

  /**
   * Register a single resource with the admin framework
   * @param resource The resource options to register
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private registerSingleResource(resource: ResourceOptions<any>): void {
    if (this.resources.has(resource.name)) {
      throw new Error(
        `Resource with name '${resource.name}' is already registered`,
      );
    }

    this.resources.set(resource.name, resource);
  }

  /**
   * Get a specific resource by name
   * @param name The name of the resource to retrieve
   * @returns The resource options or undefined if not found
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getResource(name: string): ResourceOptions<any> | undefined {
    return this.resources.get(name);
  }

  /**
   * Get all registered resources
   * @returns Array of all registered resource options
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getResources(): ResourceOptions<any>[] {
    return Array.from(this.resources.values());
  }

  /**
   * Check if a resource is registered
   * @param name The name of the resource to check
   * @returns True if the resource exists, false otherwise
   */
  hasResource(name: string): boolean {
    return this.resources.has(name);
  }

  /**
   * Remove a resource from the admin framework
   * @param name The name of the resource to remove
   * @returns True if the resource was removed, false if it didn't exist
   */
  unregisterResource(name: string): boolean {
    return this.resources.delete(name);
  }

  /**
   * Get the total number of registered resources
   * @returns The number of registered resources
   */
  getResourceCount(): number {
    return this.resources.size;
  }
}

/**
 * Create a new AdminAngular instance
 * @param options Optional options to pass to the AdminAngular constructor
 * @returns A new AdminAngular instance
 */
export function createAdminAngular(options?: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources?: ResourceOptions<any>[];
}): AdminAngular {
  return new AdminAngular(options);
}
