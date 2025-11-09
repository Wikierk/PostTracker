export type UserState = {
  loggedIn: boolean;
  role: "admin" | "employee" | null;
};

export type Package = {
  id: string;
  trackingNumber: string;
  sender: string;
  recipient: string;
  status: "registered" | "delivered" | "pending";
  createdAt: Date;
};
