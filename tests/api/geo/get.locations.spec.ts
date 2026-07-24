import { test, expect } from '../../../api/fixtures/api.fixtures';
import { GeoDirectResponse } from '../../../api/types/geo.types';

test.describe('GET /geo/1.0/direct', () => {
  test('should return coordinates for a valid city', async ({ geoClient }) => {
    const response = await geoClient.getLocationsByName({ city: 'London' });

    expect(response.status()).toBe(200);

    const body: GeoDirectResponse = await response.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toMatchObject({
      name: expect.any(String),
      lat: expect.any(Number),
      lon: expect.any(Number),
      country: expect.any(String),
    });
  });

  test('should respect the limit parameter', async ({ geoClient }) => {
    const response = await geoClient.getLocationsByName({ city: 'London', limit: 2 });
    const body: GeoDirectResponse = await response.json();

    expect(body.length).toBeLessThanOrEqual(2);
  });

  test('should filter by state code for US cities', async ({ geoClient }) => {
    const response = await geoClient.getLocationsByName({
      city: 'Springfield',
      state: 'IL',
      country: 'US',
    });
    const body: GeoDirectResponse = await response.json();

    expect(body[0].state).toBe('Illinois');
  });

  test('should return an empty array for a nonexistent city', async ({ geoClient }) => {
    const response = await geoClient.getLocationsByName({ city: 'Qwertyzxcvxyz12345' });

    expect(response.status()).toBe(200);
    const body: GeoDirectResponse = await response.json();
    expect(body).toEqual([]);
  });

  test('should return 401 when appid is invalid', async ({ apiContext }) => {
    const response = await apiContext.get('/geo/1.0/direct', {
      params: { q: 'London', appid: 'invalid-key-123' },
    });

    expect(response.status()).toBe(401);
  });
});