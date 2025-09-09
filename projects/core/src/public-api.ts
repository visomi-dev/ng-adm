/*
 * Public API Surface of @ng-admin/core
 */

// Export types and interfaces
export type {
  PropertyType,
  PropertyOptions,
  ResourceOptions,
  ActionContext,
  Adapter,
} from './lib/types';

// Export main classes
export { AdminAngular } from './lib/admin-angular';
export { MemoryAdapter } from './lib/memory-adapter';
export type { BaseRecord } from './lib/memory-adapter';
