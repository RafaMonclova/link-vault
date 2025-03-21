"use client"
import { View, Text, StyleSheet, TouchableOpacity, Linking, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../hooks/useTheme"

// Mock data for links
const mockLinks = {
  recent: [
    { id: "1", title: "Google", url: "https://google.com", category: "Buscadores", icon: "G" },
    { id: "2", title: "GitHub", url: "https://github.com", category: "Desarrollo", icon: "GH" },
    { id: "3", title: "Stack Overflow", url: "https://stackoverflow.com", category: "Desarrollo", icon: "SO" },
    { id: "4", title: "YouTube", url: "https://youtube.com", category: "Entretenimiento", icon: "YT" },
  ],
  featured: [
    { id: "5", title: "Vercel", url: "https://vercel.com", category: "Desarrollo", icon: "V" },
    { id: "6", title: "Next.js", url: "https://nextjs.org", category: "Desarrollo", icon: "N" },
    { id: "7", title: "Tailwind CSS", url: "https://tailwindcss.com", category: "Diseño", icon: "TW" },
    { id: "8", title: "React", url: "https://reactjs.org", category: "Desarrollo", icon: "R" },
  ],
}

interface LinkGridProps {
  type: "recent" | "featured"
}

export default function LinkGrid({ type }: LinkGridProps) {
  const { colors } = useTheme()
  const links = mockLinks[type]

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.linkItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => Linking.openURL(item.url)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.iconText, { color: colors.primary }]}>{item.icon}</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <TouchableOpacity style={styles.externalLink}>
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

      <TouchableOpacity style={styles.bookmarkButton}>
        <Ionicons name="bookmark-outline" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={links}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
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
  bookmarkButton: {
    padding: 8,
  },
})

