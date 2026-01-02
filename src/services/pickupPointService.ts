import client from "../api/client";

export interface PickupPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface FindNearestResponse {
  found: boolean;
  point?: PickupPoint;
  distance?: number;
  message?: string;
}

export const pickupPointService = {
  findNearest: async (
    lat: number,
    lon: number
  ): Promise<FindNearestResponse> => {
    const response = await client.get<FindNearestResponse>(
      `/pickup-points/find-nearest`,
      {
        params: { lat, lon },
      }
    );
    return response.data;
  },

  getAll: async () => {
    const response = await client.get<PickupPoint[]>("/pickup-points");
    return response.data;
  },
};
