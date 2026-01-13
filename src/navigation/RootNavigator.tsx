import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAuth } from "../hooks/useAuth";

import AdminNavigator from "./AdminNavigator";
import ReceptionistNavigator from "./ReceptionistNavigator";
import EmployeeNavigator from "./EmployeeNavigator";

import LoginScreen from "../screens/auth/LoginScreen";

import AdminPackageDetailsScreen from "../screens/admin/PackageDetailsScreen";

import EmployeePackageDetailsScreen from "../screens/employee/PackageDetailsScreen";
import PackageOrderScreen from "../screens/employee/PackageOrderScreen";
import AdminPackageFormScreen from "../screens/admin/PackageFormScreen";
import ReceptionistPackageDetailsScreen from "../screens/receptionist/PackageDetailsScreen.tsx";
import ReceptionistPackageFormScreen from "../screens/receptionist/PackageFormScreen";
import ReceptionistProblemsScreen from "../screens/receptionist/ProblemsScreen";
import ReportProblemScreen from "../screens/employee/ReportProblemScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#006874" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user.loggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : user.role === "admin" ? (
        <Stack.Group>
          <Stack.Screen name="AdminApp" component={AdminNavigator} />

          <Stack.Screen
            name="PackageDetails"
            component={AdminPackageDetailsScreen}
            options={{
              title: "Zarządzanie Przesyłką",
              headerShown: true,
              headerBackTitle: "Wróć",
            }}
          />
          <Stack.Screen
            name="PackageForm"
            component={AdminPackageFormScreen}
            options={{
              title: "Dodaj Przesyłkę",
              headerShown: true,
              presentation: "modal",
            }}
          />
        </Stack.Group>
      ) : user.role === "receptionist" ? (
        <Stack.Group>
          <Stack.Screen
            name="ReceptionistApp"
            component={ReceptionistNavigator}
          />

          <Stack.Screen
            name="PackageDetails"
            component={ReceptionistPackageDetailsScreen}
            options={{
              title: "Wydanie Przesyłki",
              headerShown: true,
              headerBackTitle: "Wróć",
            }}
          />
          <Stack.Screen
            name="PackageForm"
            component={ReceptionistPackageFormScreen}
            options={{
              title: "Rejestracja",
              headerShown: true,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="ReceptionistProblems"
            component={ReceptionistProblemsScreen}
            options={{
              title: "Zgłoszone Problemy",
              headerShown: true,
              headerBackTitle: "Panel",
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="EmployeeApp" component={EmployeeNavigator} />

          <Stack.Screen
            name="PackageDetails"
            component={EmployeePackageDetailsScreen}
            options={{
              title: "Szczegóły",
              headerShown: true,
              headerBackTitle: "Wróć",
            }}
          />

          <Stack.Screen
            name="PackageOrder"
            component={PackageOrderScreen}
            options={{
              title: "Odbiór Przesyłki",
              headerShown: true,
              headerBackTitle: "Wróć",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="ReportProblem"
            component={ReportProblemScreen}
            options={{
              title: "Zgłoś problem",
              headerShown: true,
              headerBackTitle: "Wróć",
              presentation: "modal",
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
