import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  testPassword: required('TEST_PASSWORD'),
  apiKey: required('API_KEY'),
  apiBaseUrl: required('API_BASE_URL'),
} as const;