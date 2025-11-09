import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AdminTabParamList } from "../types/navigation";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import ScanScreen from "../screens/admin/ScanScreen";
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
          tabBarLabel: "Panel",
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: "Skanuj",
          tabBarIcon: ({ color, size }) => (
            <Icon name="qrcode-scan" color={color} size={size} />
          ),
        }}
      />
      <AdminTab.Screen
        name="List"
        component={PackageListScreen}
        options={{
          tabBarLabel: "Lista",
          tabBarIcon: ({ color, size }) => (
            <Icon name="format-list-bulleted" color={color} size={size} />
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
