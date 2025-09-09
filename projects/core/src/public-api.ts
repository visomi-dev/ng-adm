/*
 * Public API Surface of @ng-adm/core
 */

// Export types and interfaces
export type {
  PropertyType,
  PropertyOptions,
  ResourceOptions,
  ActionContext,
  Adapter,
} from './lib/types';
export type { BaseRecord } from './lib/memory-adapter';

// Export main classes
export { AdminAngular } from './lib/admin-angular';
export { MemoryAdapter } from './lib/memory-adapter';
