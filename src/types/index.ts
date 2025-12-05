export type UserRole = "admin" | "receptionist" | "employee";

export type UserState = {
  loggedIn: boolean;
  role: UserRole | null;
  userId?: string;
  email?: string;
  token?: string;
};

export type PackageStatus = "registered" | "delivered" | "problem";

export type Package = {
  id: string;
  trackingNumber: string;
  sender: string;
  recipient?: { fullName: string; id: string };
  recipientId?: string;
  status: PackageStatus;
  pickupPoint: string;
  photoUrl?: string;
  createdAt: string;
};
