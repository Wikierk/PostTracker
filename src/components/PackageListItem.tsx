import { View, Text } from "react-native"
import { List, useTheme } from "react-native-paper"
import { Package } from "../types"
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAuth } from "../hooks/useAuth";

type PackageListItemProps = Package;

const PackageListItem = (props: PackageListItemProps) => {
  const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userState] = useAuth();    
  const theme = useTheme();

  const getDescription = () => {
    if (userState.role === 'employee') {
      return `Dotarła: ${props.createdAt} | ${props.trackingNumber}`
    } else if (userState.role === 'admin') {
      return `Do: ${props.recipient} | ${props.trackingNumber}`
    }
  };

  return (
    <List.Item
      title={props.sender}
      description={getDescription()}
      left={() => (
        <View style={{ width: 48, justifyContent: 'center', alignItems: 'center', marginRight: -12 }}>
          <List.Icon icon="package-variant" />
        </View>
      )}
      right={() => (
        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 1 }}>
          <Text
            style={{
              color: props.status === "delivered" ? "green" : "orange",
              marginRight: 10,
              fontSize: 12,
            }}
          >
            {props.status === "delivered" ? "ODEBRANA" : "W RECEPCJI"}
          </Text>
          <List.Icon {...props} icon="chevron-right" />
        </View>
      )}
      onPress={() =>
        navigation.navigate("PackageDetails", { packageData: props })
      }
      style={{ backgroundColor: theme.colors.surface }}
    />
  )
};

export default PackageListItem;