import { NavigatorScreenParams } from "@react-navigation/native";
import { Package } from "./index";

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

  ReportProblem: { packageData: Package };

  PackageOrder: { packageData: Package };

  Register: undefined;

  ReceptionistProblems: undefined;
};
