import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Colors } from "../../assets/Colors";

export default function TabsLayout() {
  return <Tabs  screenOptions={{headerShown:false,tabBarActiveTintColor:Colors.PRIMARY, tabBarInactiveTintColor:Colors.dark.text,
    tabBarStyle:{
      backgroundColor:Colors.SECONDARY,
      paddingBottom:14,
      height:75
    },
    tabBarLabelStyle:{fontSize:12,fontWeight:'bold'}
  }}>
    <Tabs.Screen name="home" options={{tabBarIcon:({color})=>(
      <Ionicons name="home" size={24} color={color} />
    )}}/>
      <Tabs.Screen name="history" options={{tabBarIcon:({color})=>(
        <Ionicons name="time-sharp" size={24} color={color} />
      )}} />
    <Tabs.Screen name="profile" options={{tabBarIcon:({color})=>(
      <Ionicons name="person-sharp" size={24} color={color} />
    )}} />
  </Tabs>;
}
