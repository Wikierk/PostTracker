import client from "../api/client";
import { Package } from "../types";

export interface ReceptionistStats {
  toDeliver: number;
  receivedToday: number;
}

export interface AdminStats {
  employeesCount: number;
  packagesThisMonth: number;
}

export interface CreatePackageRequest {
  trackingNumber: string;
  sender: string;
  recipientId: string;
  pickupPoint: string;
  photoUrl?: string;
}

export interface UpdatePackageRequest {
  trackingNumber?: string;
  sender?: string;
  recipientId?: string;
  pickupPoint?: string;
  photoUrl?: string;
  status?: string;
}

export interface DeliverPackageRequest {
  pickupCode: string;
}

export const packageService = {
  registerPackage: async (data: any) => {
    const formData = new FormData();
    formData.append("trackingNumber", data.trackingNumber);
    formData.append("sender", data.sender);
    formData.append("recipientId", data.recipientId);
    formData.append("pickupPoint", data.pickupPoint);

    if (data.photo) {
      const localUri = data.photo;
      const filename = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      // @ts-ignore: React Native FormData specific formatting
      formData.append("photo", { uri: localUri, name: filename, type });
    }

    const response = await client.post("/packages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAllPackages: async (search?: string): Promise<Package[]> => {
    const params: any = {};
    if (search) params.search = search;

    const response = await client.get("/packages", { params });
    return response.data;
  },

  deletePackage: async (packageId: string) => {
    const response = await client.delete(`/packages/${packageId}`);
    return response.data;
  },

  deliverPackage: async (packageId: string, pickupCode: string) => {
    const response = await client.put(`/packages/${packageId}/deliver`, {
      pickupCode,
    });
    return response.data;
  },

  updatePackage: async (packageId: string, data: UpdatePackageRequest) => {
    const response = await client.patch(`/packages/${packageId}`, data);
    return response.data;
  },

  getPackageById: async (packageId: string): Promise<Package> => {
    const response = await client.get(`/packages/${packageId}`);
    return response.data;
  },

  getReceptionistStats: async (): Promise<ReceptionistStats> => {
    const response = await client.get("/packages/stats/receptionist");
    return response.data;
  },
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await client.get("/packages/stats/admin");
    return response.data;
  },

  getProblems: async (): Promise<Package[]> => {
    const response = await client.get("/packages/problems");
    return response.data;
  },

  reportProblem: async (packageId: string, description: string) => {
    const response = await client.put(`/packages/${packageId}/problem`, {
      description,
    });
    return response.data;
  },
};
