import { ResourceOptions } from './types';

/**
 * Main AdminAngular class that manages resources for the admin framework
 */
export class AdminAngular {
  private resources = new Map<string, ResourceOptions>();

  /**
   * Create a new AdminAngular instance
   * @param resources Optional array of resources to register immediately
   */
  constructor(options?: { resources?: ResourceOptions[] }) {
    if (options?.resources) {
      this.registerResources(options.resources);
    }
  }

  /**
   * Register a new resource with the admin framework
   * @param resource The resource options to register
   */
  registerResource(resource: ResourceOptions): void;

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
    resourceOrResources: ResourceOptions | ResourceOptions[],
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
  private registerResources(resources: ResourceOptions[]): void {
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
  private registerSingleResource(resource: ResourceOptions): void {
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
  getResource(name: string): ResourceOptions | undefined {
    return this.resources.get(name);
  }

  /**
   * Get all registered resources
   * @returns Array of all registered resource options
   */
  getResources(): ResourceOptions[] {
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
  resources?: ResourceOptions[];
}): AdminAngular {
  return new AdminAngular(options);
}
