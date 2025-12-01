import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAuth } from "../hooks/useAuth";

import AdminNavigator from "./AdminNavigator";
import EmployeeNavigator from "./EmployeeNavigator";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import PackageFormScreen from "../screens/admin/PackageFormScreen";
import AdminPackageDetailsScreen from "../screens/admin/PackageDetailsScreen";
import EmployeePackageDetailsScreen from "../screens/employee/PackageDetailsScreen";
import EmployeePackageOrderScreen from "../screens/employee/PackageOrderScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [user] = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user.loggedIn ? (
        <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} /> 
        </Stack.Group>
      ) : user.role === "admin" ? (
        <Stack.Group>
          <Stack.Screen name="AdminApp" component={AdminNavigator} />
          <Stack.Screen
            name="PackageForm"
            component={PackageFormScreen}
            options={{
              headerShown: true,
              title: "Rejestracja Przesyłki",
              presentation: "modal",
              headerBackTitle: "Anuluj",
            }}
          />
          <Stack.Screen
            name="PackageDetails"
            component={AdminPackageDetailsScreen}
            options={{
              headerShown: true,
              title: "Szczegóły Przesyłki",
              headerBackTitle: "Wróć",
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="EmployeeApp" component={EmployeeNavigator}/>
          <Stack.Screen
            name="PackageDetails"
            component={EmployeePackageDetailsScreen}
            options={{
              headerShown: true,
              title: "Szczegóły Przesyłki",
              headerBackTitle: "Wróć",
            }}
          />
          <Stack.Screen
            name="PackageOrder"
            component={EmployeePackageOrderScreen}
            options={{
              headerShown: true,
              title: "Szczegóły Przesyłki",
              headerBackTitle: "Wróć",
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
