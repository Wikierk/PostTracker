import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ReceptionistTabParamList } from "../types/navigation";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import ReceptionistDashboardScreen from "../screens/receptionist/DashboardScreen";
import ScanScreen from "../screens/receptionist/ScanScreen";
import PackageListScreen from "../screens/receptionist/PackageListScreen";
import SettingsScreen from "../screens/shared/SettingsScreen";

const Tab = createBottomTabNavigator<ReceptionistTabParamList>();

const ReceptionistNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={ReceptionistDashboardScreen}
        options={{
          tabBarLabel: "Panel",
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: "Skanuj",
          tabBarIcon: ({ color, size }) => (
            <Icon name="qrcode-scan" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="List"
        component={PackageListScreen}
        options={{
          tabBarLabel: "Wydaj",
          tabBarIcon: ({ color, size }) => (
            <Icon name="hand-coin" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Ustawienia",
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ReceptionistNavigator;
