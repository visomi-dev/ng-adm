import type {
  Express as ExpressApp,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import type { AdminAngular } from '@ng-admin/core';

export type ExpressPluginOptions = {
  basePath?: string;
};

export function buildExpressRouter(
  admin: AdminAngular,
  options: ExpressPluginOptions = {},
): Router {
  const basePath = options.basePath ?? '/admin';
  // Dynamically import express only when used (ESM-friendly)
  const express = require('express');
  const router: Router = express.Router();

  router.get('/', async (_req: Request, res: Response) => {
    const resources = await admin.getResourcesMetadata();
    res.json({ resources });
  });

  router.get('/resources', async (_req: Request, res: Response) => {
    const resources = await admin.getResourcesMetadata();
    res.json(resources);
  });

  router.get('/resources/:resourceId', async (req: Request, res: Response) => {
    const metaList = await admin.getResourcesMetadata();
    const meta = metaList.find((m) => m.id === req.params['resourceId']);
    if (!meta) return res.status(404).json({ error: 'Resource not found' });
    res.json(meta);
  });

  router.get(
    '/resources/:resourceId/records',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const adapter = admin.getAdapter(req.params['resourceId']);
        const page = Number(req.query['page'] ?? 1);
        const perPage = Number(req.query['perPage'] ?? 20);
        const sortBy =
          typeof req.query['sortBy'] === 'string'
            ? req.query['sortBy']
            : undefined;
        const sortDirection =
          req.query['sortDirection'] === 'desc' ? 'desc' : 'asc';
        const filters =
          typeof req.query['filters'] === 'string'
            ? JSON.parse(req.query['filters'])
            : undefined;
        const result = await adapter.list({
          page,
          perPage,
          sortBy,
          sortDirection,
          filters,
        });
        res.json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  router.get(
    '/resources/:resourceId/records/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const adapter = admin.getAdapter(req.params['resourceId']);
        const record = await adapter.findOne(req.params['id']);
        if (!record) return res.status(404).json({ error: 'Not found' });
        res.json(record);
      } catch (err) {
        next(err);
      }
    },
  );

  router.post(
    '/resources/:resourceId/records',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const adapter = admin.getAdapter(req.params['resourceId']);
        const created = await adapter.create(req.body ?? {});
        res.status(201).json(created);
      } catch (err) {
        next(err);
      }
    },
  );

  router.put(
    '/resources/:resourceId/records/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const adapter = admin.getAdapter(req.params['resourceId']);
        const updated = await adapter.update(req.params['id'], req.body ?? {});
        res.json(updated);
      } catch (err) {
        next(err);
      }
    },
  );

  router.delete(
    '/resources/:resourceId/records/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const adapter = admin.getAdapter(req.params['resourceId']);
        await adapter.delete(req.params['id']);
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  );

  // Attach under basePath via a wrapper router to avoid confusion for consumers
  const root: Router = express.Router();
  root.use(basePath, router);
  return root;
}
