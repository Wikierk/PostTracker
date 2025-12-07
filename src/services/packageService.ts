import { Alert } from "react-native";
import client from "../api/client";
import { Package } from "../types";

export interface CreatePackageRequest {
  trackingNumber: string;
  sender: string;
  recipientId: string;
  pickupPoint: string;
  photoUrl?: string;
}

export interface UpdatePackageRequest {
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
  getAllPackages: async (): Promise<Package[]> => {
    const response = await client.get("/packages");
    return response.data;
  },
  deletePackage: async (packageId: string) => {
    const response = await client.delete(`/packages/${packageId}`);
    return response.data;
  },
  deliverPackage: async (packageId: string) => {
    const response = await client.put(`/packages/${packageId}/deliver`);
    return response.data;
  },
  updatePackage: async (packageId: string, data: UpdatePackageRequest) => {
    const response = await client.patch(`/packages/${packageId}`, data);
    return response.data;
  },
};
