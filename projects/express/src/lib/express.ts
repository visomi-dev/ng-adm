import { Router, Request, Response, json } from 'express';
import type { AdminAngular } from '@ng-adm/core';

/**
 * Error response type for API errors
 */
type ErrorResponse = {
  error: string;
};

/**
 * Build an Express router that provides REST API endpoints for all registered resources
 * in an AdminAngular instance.
 *
 * @param admin The AdminAngular instance containing registered resources
 * @returns Express Router with dynamically generated routes
 */
export function buildAdminRouter(admin: AdminAngular): Router {
  const router = Router();

  // Middleware to parse JSON bodies
  router.use(json());

  // GET /resources - Returns all resource metadata
  router.get('/resources', (_req: Request, res: Response) => {
    try {
      const resources = admin.getResources();

      res.json(resources);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };

      res.status(500).json(errorResponse);
    }
  });

  // GET /resources/:name - Returns single resource metadata
  router.get('/resources/:name', (req: Request, res: Response) => {
    try {
      const { name } = req.params;

      const resource = admin.getResource(name);

      if (!resource) {
        const errorResponse: ErrorResponse = {
          error: `Resource '${name}' not found`,
        };

        res.status(404).json(errorResponse);

        return;
      }

      res.json({
        name: resource.name,
        label: resource.label,
        properties: resource.properties,
      });
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
      res.status(500).json(errorResponse);
    }
  });

  // GET /resources/:name/list - Lists records using adapter.list
  router.get('/resources/:name/list', async (req: Request, res: Response) => {
    try {
      const { name } = req.params;

      const resource = admin.getResource(name);

      if (!resource) {
        const errorResponse: ErrorResponse = {
          error: `Resource '${name}' not found`,
        };

        res.status(404).json(errorResponse);

        return;
      }

      const result = await resource.adapter.list({
        resource,
        params: req.query,
      });

      res.json(result);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };

      res.status(500).json(errorResponse);
    }
  });

  // GET /resources/:name/:id - Gets single record using adapter.show
  router.get('/resources/:name/:id', async (req: Request, res: Response) => {
    try {
      const { name, id } = req.params;

      const resource = admin.getResource(name);

      if (!resource) {
        const errorResponse: ErrorResponse = {
          error: `Resource '${name}' not found`,
        };

        res.status(404).json(errorResponse);

        return;
      }

      const result = await resource.adapter.show(
        {
          resource,
          params: req.query,
        },
        id,
      );
      res.json(result);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };

      res.status(500).json(errorResponse);
    }
  });

  // POST /resources/:name - Creates new record using adapter.create
  router.post('/resources/:name', async (req: Request, res: Response) => {
    try {
      const { name } = req.params;

      const resource = admin.getResource(name);

      if (!resource) {
        const errorResponse: ErrorResponse = {
          error: `Resource '${name}' not found`,
        };

        res.status(404).json(errorResponse);

        return;
      }

      const result = await resource.adapter.create(
        {
          resource,
          params: req.query,
        },
        req.body,
      );

      res.status(201).json(result);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };

      res.status(500).json(errorResponse);
    }
  });

  // PUT /resources/:name/:id - Updates record using adapter.update
  router.put('/resources/:name/:id', async (req: Request, res: Response) => {
    try {
      const { name, id } = req.params;

      const resource = admin.getResource(name);

      if (!resource) {
        const errorResponse: ErrorResponse = {
          error: `Resource '${name}' not found`,
        };

        res.status(404).json(errorResponse);

        return;
      }

      const result = await resource.adapter.update(
        {
          resource,
          params: req.query,
        },
        id,
        req.body,
      );

      res.json(result);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };

      res.status(500).json(errorResponse);
    }
  });

  // DELETE /resources/:name/:id - Deletes record using adapter.delete
  router.delete('/resources/:name/:id', async (req: Request, res: Response) => {
    try {
      const { name, id } = req.params;

      const resource = admin.getResource(name);

      if (!resource) {
        const errorResponse: ErrorResponse = {
          error: `Resource '${name}' not found`,
        };

        res.status(404).json(errorResponse);

        return;
      }

      const success = await resource.adapter.delete(
        {
          resource,
          params: req.query,
        },
        id,
      );

      if (success) {
        res.status(204).send();
      } else {
        const errorResponse: ErrorResponse = {
          error: 'Failed to delete record',
        };

        res.status(500).json(errorResponse);
      }
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };

      res.status(500).json(errorResponse);
    }
  });

  return router;
}
