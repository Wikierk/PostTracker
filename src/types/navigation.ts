import { NavigatorScreenParams } from "@react-navigation/native";
import { Package } from ".";

export type RootStackParamList = {
  Login: undefined;
  AdminApp: NavigatorScreenParams<AdminTabParamList> | undefined;
  EmployeeApp: undefined;
  PackageForm: { scannedCode?: string } | undefined;
  PackageDetails: { packageData: Package };
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Scan: undefined;
  List: undefined;
  Settings: undefined;
};

export type EmployeeTabParamList = {
  MyPackages: undefined;
  Settings: undefined;
};
