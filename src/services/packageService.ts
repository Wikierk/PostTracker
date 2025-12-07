import client from "../api/client";

export interface CreatePackageRequest {
  trackingNumber: string;
  sender: string;
  recipientId: string;
  pickupPoint: string;
  photoUrl?: string;
}

export const packageService = {
  registerPackage: async (data: CreatePackageRequest) => {
    const response = await client.post("/packages", data);
    return response.data;
  },
};
