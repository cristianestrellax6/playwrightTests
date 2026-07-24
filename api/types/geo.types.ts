export interface GeoLocation {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string; // solo aparece para ubicaciones en US
}

export type GeoDirectResponse = GeoLocation[];