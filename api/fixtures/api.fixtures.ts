import { test as base, request, APIRequestContext } from '@playwright/test';
import { GeoClient } from '../../api/clients/geo.client';
import { env } from '../../config/env';

type Fixtures = {
  apiContext: APIRequestContext;
  geoClient: GeoClient;
};

export const test = base.extend<Fixtures>({
  apiContext: async ({}, use) => {
    const context = await request.newContext({
      baseURL: env.apiBaseUrl,
    });
    await use(context);
    await context.dispose();
  },

  geoClient: async ({ apiContext }, use) => {
    await use(new GeoClient(apiContext, env.apiKey));
  },
});

export { expect } from '@playwright/test';