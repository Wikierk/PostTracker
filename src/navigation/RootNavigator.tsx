import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAuth } from "../hooks/useAuth";

import AdminNavigator from "./AdminNavigator";
import EmployeeNavigator from "./EmployeeNavigator";

import LoginScreen from "../screens/auth/LoginScreen";
import PackageFormScreen from "../screens/admin/PackageFormScreen";
import PackageDetailsScreen from "../screens/admin/PackageDetailsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [user] = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user.loggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />
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
            component={PackageDetailsScreen}
            options={{
              headerShown: true,
              title: "Szczegóły Przesyłki",
              headerBackTitle: "Wróć",
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Screen name="EmployeeApp" component={EmployeeNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
