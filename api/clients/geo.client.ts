import { APIRequestContext } from '@playwright/test';

export class GeoClient {
  constructor(private request: APIRequestContext, private apiKey: string) {}

  async getLocationsByName(params: {
    city: string;
    state?: string;
    country?: string;
    limit?: number;
  }) {
    const query = [params.city, params.state, params.country]
      .filter(Boolean)
      .join(',');

    return this.request.get('/geo/1.0/direct', {
      params: {
        q: query,
        limit: params.limit ?? 5,
        appid: this.apiKey,
      },
    });
  }
}