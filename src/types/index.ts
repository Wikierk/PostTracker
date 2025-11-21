export type UserState = {
  loggedIn: boolean;
  role: "admin" | "employee" | null;
};

export type PackageStatus =
  | "registered"
  | "assigned"
  | "delivered"
  | "archived";

export type Package = {
  id: string;
  trackingNumber: string;
  sender: string;
  recipient: string;
  status: PackageStatus;
  pickupPoint: string;
  photoUrl?: string;
  createdAt: string;
};
