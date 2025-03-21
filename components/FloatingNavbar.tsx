"use client"

import { useEffect } from "react"
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions, Text } from "react-native"
import { useNavigation, NavigationProp, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../hooks/useTheme"

const { width } = Dimensions.get("window")

type RootStackParamList = {
  Home: undefined
  New: undefined
  Categories: undefined
  Search: undefined
  Profile: undefined
}

export default function FloatingNavbar() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute() // Obtiene la ruta actual
  const { colors } = useTheme()
  const visible = new Animated.Value(1)

  const navItems = [
    { icon: "home", label: "Inicio", screen: "Home" },
    { icon: "add-circle", label: "Nuevo", screen: "New" },
    { icon: "folder", label: "Categorías", screen: "Categories" },
    { icon: "search", label: "Buscar", screen: "Search" },
    { icon: "person", label: "Perfil", screen: "Profile" },
  ]

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          transform: [
            {
              translateY: visible.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
          opacity: visible,
        },
      ]}
    >
      <View style={styles.navbar}>
        {navItems.map((item, index) => {
          const isActive = route.name === item.screen // Usa la ruta actual en lugar de useState
          return (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isActive ? colors.primary : colors.primaryLight,
                  },
                ]}
              >
                <Ionicons name={item.icon} size={24} color={isActive ? "#FFF" : colors.primary} />
              </View>
              <Text style={[styles.navLabel, { color: isActive ? colors.primary : colors.text }]}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: width - 32,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    paddingVertical: 12,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
})
