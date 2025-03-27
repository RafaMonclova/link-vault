"use client"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"

// Screens
import HomeScreen from "./screens/HomeScreen"
import NewLinkScreen from "./screens/NewLinkScreen"
import CategoriesScreen from "./screens/CategoriesScreen"
import SearchScreen from "./screens/SearchScreen"

// Theme provider
import { ThemeProvider } from "./components/ThemeProvider"
import { useTheme } from "./hooks/useTheme"

const Tab = createBottomTabNavigator()

function AppNavigator() {
  const { theme, colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: import("@react-navigation/native").RouteProp<Record<string, object | undefined>, string> }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: string = "home-outline" // Default value

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "New") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Categories") {
            iconName = focused ? "folder" : "folder-outline"
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline"
          }

          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { display: "none" }, // Oculta la barra de navegación
        headerStyle: {
          backgroundColor: colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="New" component={NewLinkScreen} options={{ title: "Nuevo Enlace" }} />
      <Tab.Screen name="Categories" component={CategoriesScreen} options={{ title: "Categorías" }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: "Buscar" }} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}


