/*
 * Public API Surface of @ng-adm/express
 */

export { buildAdminRouter } from './lib/express';
export { buildAuthenticatedRouter } from './lib/auth-router';
export type { User, AuthConfig, SessionOptions } from './lib/auth-router';
