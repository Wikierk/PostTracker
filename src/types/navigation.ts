import { NavigatorScreenParams } from "@react-navigation/native";
import { Package } from "./index";
import { User } from "../services/userService";
import { PickupPoint } from "../services/pickupPointService";

export type AdminTabParamList = {
  Dashboard: undefined;
  PackagesList: undefined;
  UsersList: undefined;
  Settings: undefined;
};

export type ReceptionistTabParamList = {
  Dashboard: undefined;
  Scan: undefined;
  List: undefined;
  Settings: undefined;
};

export type EmployeeTabParamList = {
  MyPackages: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Login: undefined;

  AdminApp: NavigatorScreenParams<AdminTabParamList> | undefined;
  ReceptionistApp: NavigatorScreenParams<ReceptionistTabParamList> | undefined;
  EmployeeApp: NavigatorScreenParams<EmployeeTabParamList> | undefined;

  PackageForm:
    | { scannedCode?: string; packageData?: Package; isUpdate?: boolean }
    | undefined;

  PackageDetails: { packageData: Package };

  PackageOrder: { packageData: Package };

  ReportProblem: { packageData: Package };

  AdminUsers: undefined;
  AdminUserForm: { mode: "create" } | { mode: "edit"; user: User };

  AdminPickupPointsList: undefined;
  AdminPickupPointForm:
    | { mode: "create" }
    | { mode: "edit"; point: PickupPoint };

  Register: undefined;
  ReceptionistProblems: undefined;
};
