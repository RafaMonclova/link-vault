"use client"

import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../hooks/useTheme"
import FloatingNavbar from "../components/FloatingNavbar"
import LinkGrid from "../components/LinkGrid"
import CategoryList from "../components/CategoryList"
import { useFocusEffect } from "@react-navigation/native"
import React from "react"


export default function HomeScreen() {
  const { colors, theme, setTheme } = useTheme()
  const [scrollY] = useState(new Animated.Value(0))
  const [refreshing, setRefreshing] = useState(false)
  const [updateTimestamp, setUpdateTimestamp] = useState(Date.now())

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })
  
  // Cargar categorías cada vez que la pantalla recibe el foco
    useFocusEffect(
      React.useCallback(() => {
        triggerUpdate()
        return () => {}
      }, [])
    )


  const handleRefresh = () => {
    setRefreshing(true)
    // Forzar actualización de componentes hijos
    setUpdateTimestamp(Date.now())
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Función para forzar actualización de los componentes hijos
  const triggerUpdate = () => {
    setUpdateTimestamp(Date.now())
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["bottom"]}>
      <Animated.View
        style={[
          styles.floatingHeader,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            opacity: headerOpacity,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Gestor de Enlaces</Text>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Ionicons name={theme === "dark" ? "sunny-outline" : "moon-outline"} size={24} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Gestor de Enlaces</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Organiza y accede a tus enlaces favoritos en un solo lugar
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Enlaces Recientes</Text>
          <LinkGrid type="recent" onUpdate={triggerUpdate} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Enlaces Destacados</Text>
          <LinkGrid type="featured" onUpdate={triggerUpdate} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Todas las Categorías</Text>
          <CategoryList onUpdate={updateTimestamp} />
        </View>
      </ScrollView>

      <FloatingNavbar />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  themeButton: {
    padding: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
})

