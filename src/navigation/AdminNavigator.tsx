import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AdminTabParamList } from "../types/navigation";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import AdminDashboardScreen from "../screens/admin/DashboardScreen";
import PackageListScreen from "../screens/admin/PackageListScreen";
import SettingsScreen from "../screens/shared/SettingsScreen";

const AdminTab = createBottomTabNavigator<AdminTabParamList>();

const AdminNavigator = () => {
  return (
    <AdminTab.Navigator screenOptions={{ headerShown: false }}>
      <AdminTab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: "Panel Admina",
          tabBarIcon: ({ color, size }) => (
            <Icon name="security" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen
        name="PackagesList"
        component={PackageListScreen}
        options={{
          tabBarLabel: "Paczki",
          tabBarIcon: ({ color, size }) => (
            <Icon name="package-variant" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Ustawienia",
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </AdminTab.Navigator>
  );
};

export default AdminNavigator;
