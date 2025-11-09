import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { EmployeeTabParamList } from "../types/navigation";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import EmployeeDashboardScreen from "../screens/employee/EmployeeDashboardScreen";
import SettingsScreen from "../screens/shared/SettingsScreen";

const EmployeeTab = createBottomTabNavigator<EmployeeTabParamList>();

const EmployeeNavigator = () => {
  return (
    <EmployeeTab.Navigator screenOptions={{ headerShown: false }}>
      <EmployeeTab.Screen
        name="MyPackages"
        component={EmployeeDashboardScreen}
        options={{
          tabBarLabel: "Moje paczki",
          tabBarIcon: ({ color, size }) => (
            <Icon name="package-variant-closed" color={color} size={size} />
          ),
        }}
      />
      <EmployeeTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Ustawienia",
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </EmployeeTab.Navigator>
  );
};

export default EmployeeNavigator;
