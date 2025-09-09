import { Router, Request, Response, NextFunction, json } from 'express';
import session from 'express-session';
import type { AdminAngular } from '@ng-adm/core';

import { buildAdminRouter } from './express';

/**
 * User type for authenticated sessions
 */
export type User = {
  id: string | number;
  username: string;
  [key: string]: unknown;
};

/**
 * Authentication configuration interface
 */
export type AuthConfig = {
  /** Function to authenticate user with username and password */
  authenticate(username: string, password: string): Promise<User | null>;
  /** Cookie name for session */
  cookieName: string;
  /** Secret for session cookie signing */
  cookiePassword: string;
};

/**
 * Session options type (from express-session)
 */
export type SessionOptions = session.SessionOptions;

/**
 * Error response type for API errors
 */
type ErrorResponse = {
  error: string;
};

/**
 * Extended Request interface to include session user
 */
declare module 'express-serve-static-core' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Request {
    session: session.Session & {
      user?: User;
    };
  }
}

/**
 * Authentication middleware that checks if user is logged in
 */
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.user) {
    const errorResponse: ErrorResponse = {
      error: 'unauthorized',
    };

    res.status(401).json(errorResponse);

    return;
  }

  next();
}

/**
 * Build an authenticated Express router that provides REST API endpoints for all registered resources
 * in an AdminAngular instance, protected by session-based authentication.
 *
 * @param admin The AdminAngular instance containing registered resources
 * @param auth Authentication configuration with authenticate function and cookie settings
 * @param sessionOptions Optional session configuration options
 * @returns Express Router with authentication and dynamically generated routes
 */
export function buildAuthenticatedRouter(
  admin: AdminAngular,
  auth: AuthConfig,
  sessionOptions?: SessionOptions,
): Router {
  const router = Router();

  // Default session configuration
  const defaultSessionOptions: SessionOptions = {
    name: auth.cookieName,
    secret: auth.cookiePassword,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  // Merge user-provided options with defaults
  const finalSessionOptions = { ...defaultSessionOptions, ...sessionOptions };

  // Apply session middleware
  router.use(session(finalSessionOptions));

  // Middleware to parse JSON bodies
  router.use(json());

  // Authentication routes
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        const errorResponse: ErrorResponse = {
          error: 'username and password are required',
        };

        res.status(400).json(errorResponse);

        return;
      }

      const user = await auth.authenticate(username, password);

      if (!user) {
        const errorResponse: ErrorResponse = {
          error: 'Invalid credentials',
        };

        res.status(401).json(errorResponse);

        return;
      }

      // Store user in session
      req.session.user = user;

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: error instanceof Error ? error.message : 'Authentication failed',
      };

      res.status(500).json(errorResponse);
    }
  });

  router.post('/logout', (req: Request, res: Response) => {
    try {
      req.session.destroy((error: unknown) => {
        if (error) {
          const errorResponse: ErrorResponse = {
            error: 'Failed to logout',
          };

          res.status(500).json(errorResponse);

          return;
        }

        res.json({ success: true });
      });
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: error instanceof Error ? error.message : 'Logout failed',
      };

      res.status(500).json(errorResponse);
    }
  });

  router.get('/me', (req: Request, res: Response) => {
    try {
      if (!req.session.user) {
        const errorResponse: ErrorResponse = {
          error: 'Not authenticated',
        };

        res.status(401).json(errorResponse);

        return;
      }

      res.json({
        user: {
          id: req.session.user.id,
          username: req.session.user.username,
        },
      });
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error:
          error instanceof Error ? error.message : 'Failed to get user info',
      };

      res.status(500).json(errorResponse);
    }
  });

  // Get the admin router and mount it with authentication protection
  const adminRouter = buildAdminRouter(admin);

  router.use('/resources', requireAuth, adminRouter);

  return router;
}
