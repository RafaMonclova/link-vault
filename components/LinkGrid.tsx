"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../hooks/useTheme"
import { type Link, getRecentLinks, getFeaturedLinks, deleteLink, updateLink } from "../utils/storage"

interface LinkGridProps {
  type: "recent" | "featured"
  onUpdate: () => void
}

export default function LinkGrid({ type, onUpdate }: LinkGridProps) {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadLinks = async () => {
    setLoading(true)
    try {
      if (type === "recent") {
        const recentLinks = await getRecentLinks()
        setLinks(recentLinks)
      } else {
        const featuredLinks = await getFeaturedLinks()
        setLinks(featuredLinks)
      }
    } catch (error) {
      console.error("Error loading links:", error)
      Alert.alert("Error", "No se pudieron cargar los enlaces")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadLinks()
  }, [type])

  // Recargar cuando se solicite una actualización
  useEffect(() => {
    loadLinks()
  }, [onUpdate])

  const handleRefresh = () => {
    setRefreshing(true)
    loadLinks()
  }
  

  const toggleFavorite = async (link: Link) => {
    try {
      const updatedLink = { ...link, isFeatured: !link.isFeatured }
      await updateLink(updatedLink)

      // Actualizar la lista local
      setLinks(
        (prevLinks) =>
          type === "featured"
            ? prevLinks.filter((l) => l.id !== link.id) // Eliminar de destacados si estamos en esa vista
            : prevLinks.map((l) => (l.id === link.id ? updatedLink : l)), // Actualizar en recientes
      )

      // Notificar al componente padre para actualizar otras listas
      onUpdate()
    } catch (error) {
      console.error("Error toggling favorite:", error)
      Alert.alert("Error", "No se pudo actualizar el enlace")
    }
  }

  const handleDelete = (link: Link) => {
    Alert.alert("Eliminar enlace", `¿Estás seguro de que quieres eliminar "${link.title}"?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLink(link.id)
            setLinks((prevLinks) => prevLinks.filter((l) => l.id !== link.id))
            onUpdate()
          } catch (error) {
            console.error("Error deleting link:", error)
            Alert.alert("Error", "No se pudo eliminar el enlace")
          }
        },
      },
    ])
  }

  const renderLinkIcon = (link: Link) => {
    switch (link.iconType) {
      case "gallery":
      case "url":
        return (
          <Image
            source={{ uri: link.iconValue }}
            style={styles.iconImage}
            resizeMode="cover"
            //defaultSource={require("../assets/icon-placeholder.png")}
          />
        )
      case "initials":
      default:
        return <Text style={[styles.iconText, { color: colors.primary }]}>{link.iconValue}</Text>
    }
  }

  const renderItem = ({ item }: { item: Link }) => (
    <View style={[styles.linkItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity style={styles.linkContent} onPress={() => Linking.openURL(item.url)} activeOpacity={0.7}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.iconType === "initials" ? colors.primaryLight : "transparent",
              overflow: "hidden",
            },
          ]}
        >
          {renderLinkIcon(item)}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <TouchableOpacity style={styles.externalLink} onPress={() => Linking.openURL(item.url)}>
              <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: colors.backgroundVariant, borderColor: colors.border }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{item.category}</Text>
            </View>

            {type === "recent" ? (
              <View style={styles.tagContainer}>
                <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>Reciente</Text>
              </View>
            ) : (
              <View style={styles.tagContainer}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={[styles.tagText, { color: colors.textSecondary }]}>Destacado</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => toggleFavorite(item)}>
          <Ionicons
            name={item.isFeatured ? "star" : "star-outline"}
            size={20}
            color={item.isFeatured ? "#F59E0B" : colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
          <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name={type === "recent" ? "time-outline" : "star-outline"} size={40} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {type === "recent" ? "No hay enlaces recientes" : "No hay enlaces destacados"}
      </Text>
      <TouchableOpacity
        style={[styles.emptyButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("New")}
      >
        <Text style={styles.emptyButtonText}>Añadir enlace</Text>
      </TouchableOpacity>
    </View>
  )

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Cargando enlaces...</Text>
      </View>
    )
  }

  return (
    <FlatList
      scrollEnabled={false}
      data={links}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={renderEmptyComponent}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    minHeight: 200,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  linkContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  externalLink: {
    padding: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  emptyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "500",
  },
})

