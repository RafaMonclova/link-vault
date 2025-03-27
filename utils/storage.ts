import AsyncStorage from "@react-native-async-storage/async-storage"

// Definición de tipos
export interface Link {
  id: string
  title: string
  url: string
  category: string
  isFeatured: boolean
  createdAt: number
  iconType: "initials" | "gallery" | "url"
  iconValue: string // Iniciales, URI de la imagen o URL
}

// Claves para AsyncStorage
const LINKS_STORAGE_KEY = "@gestor_enlaces:links"
const CATEGORIES_STORAGE_KEY = "@gestor_enlaces:categories"

// Categorías por defecto (se usarán si no hay categorías guardadas)
// const DEFAULT_CATEGORIES = [
//   "Trabajo",
//   "Educación",
//   "Entretenimiento",
//   "Redes Sociales",
//   "Noticias",
//   "Compras",
//   "Herramientas",
//   "Desarrollo",
//   "Diseño",
//   "Otros",
// ]

// ==================== FUNCIONES PARA ENLACES ====================

// Guardar todos los enlaces
export const saveLinks = async (links: Link[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(links)
    await AsyncStorage.setItem(LINKS_STORAGE_KEY, jsonValue)
  } catch (error) {
    console.error("Error saving links to AsyncStorage:", error)
    throw error
  }
}

// Obtener todos los enlaces
export const getLinks = async (): Promise<Link[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(LINKS_STORAGE_KEY)
    return jsonValue != null ? JSON.parse(jsonValue) : []
  } catch (error) {
    console.error("Error getting links from AsyncStorage:", error)
    return []
  }
}

// Añadir un nuevo enlace
export const addLink = async (link: Omit<Link, "id" | "createdAt">): Promise<Link> => {
  try {
    const links = await getLinks()

    const newLink: Link = {
      ...link,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }

    links.push(newLink)
    await saveLinks(links)

    return newLink
  } catch (error) {
    console.error("Error adding link to AsyncStorage:", error)
    throw error
  }
}

// Eliminar un enlace
export const deleteLink = async (id: string): Promise<void> => {
  try {
    const links = await getLinks()
    const filteredLinks = links.filter((link) => link.id !== id)
    await saveLinks(filteredLinks)
  } catch (error) {
    console.error("Error deleting link from AsyncStorage:", error)
    throw error
  }
}

// Actualizar un enlace
export const updateLink = async (updatedLink: Link): Promise<void> => {
  try {
    const links = await getLinks()
    const updatedLinks = links.map((link) => (link.id === updatedLink.id ? updatedLink : link))
    await saveLinks(updatedLinks)
  } catch (error) {
    console.error("Error updating link in AsyncStorage:", error)
    throw error
  }
}

// Obtener enlaces recientes (últimos 10)
export const getRecentLinks = async (): Promise<Link[]> => {
  try {
    const links = await getLinks()
    return links.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10)
  } catch (error) {
    console.error("Error getting recent links:", error)
    return []
  }
}

// Obtener enlaces destacados
export const getFeaturedLinks = async (): Promise<Link[]> => {
  try {
    const links = await getLinks()
    return links.filter((link) => link.isFeatured)
  } catch (error) {
    console.error("Error getting featured links:", error)
    return []
  }
}

// Obtener enlaces por categoría
export const getLinksByCategory = async (category: string): Promise<Link[]> => {
  try {
    const links = await getLinks()
    return links.filter((link) => link.category === category)
  } catch (error) {
    console.error("Error getting links by category:", error)
    return []
  }
}

// Obtener todas las categorías únicas de los enlaces
export const getUniqueCategories = async (): Promise<string[]> => {
  try {
    const links = await getLinks()
    const categories = links.map((link) => link.category)
    return [...new Set(categories)]
  } catch (error) {
    console.error("Error getting unique categories:", error)
    return []
  }
}

// ==================== FUNCIONES PARA CATEGORÍAS ====================

// Guardar todas las categorías
export const saveCategories = async (categories: string[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(categories)
    await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, jsonValue)
  } catch (error) {
    console.error("Error saving categories to AsyncStorage:", error)
    throw error
  }
}

// Obtener todas las categorías
export const getCategories = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY)

    // // Si no hay categorías guardadas, usar las categorías por defecto
    // if (!jsonValue) {
    //   await saveCategories(DEFAULT_CATEGORIES)
    //   return DEFAULT_CATEGORIES
    // }

    if (!jsonValue) {
      return []
    }

    return JSON.parse(jsonValue)
  } catch (error) {
    console.error("Error getting categories from AsyncStorage:", error)
    //return DEFAULT_CATEGORIES
  }
}

// Añadir una nueva categoría
export const addCategory = async (category: string): Promise<void> => {
  try {
    const categories = await getCategories()

    // Verificar si la categoría ya existe
    if (categories.includes(category)) {
      throw new Error("La categoría ya existe")
    }

    categories.push(category)
    await saveCategories(categories)
  } catch (error) {
    console.error("Error adding category to AsyncStorage:", error)
    throw error
  }
}

// Eliminar una categoría
export const deleteCategory = async (category: string): Promise<void> => {
  try {
    const categories = await getCategories()
    const filteredCategories = categories.filter((cat) => cat !== category)

    // Verificar si hay enlaces que usan esta categoría
    const links = await getLinks()
    const linksWithCategory = links.filter((link) => link.category === category)

    if (linksWithCategory.length > 0) {
      // Actualizar los enlaces que usan esta categoría a "Otros"
      const updatedLinks = links.map((link) => (link.category === category ? { ...link, category: "Otros" } : link))

      await saveLinks(updatedLinks)
    }

    await saveCategories(filteredCategories)
  } catch (error) {
    console.error("Error deleting category from AsyncStorage:", error)
    throw error
  }
}

// Verificar si una categoría está en uso
export const isCategoryInUse = async (category: string): Promise<boolean> => {
  try {
    const links = await getLinks()
    return links.some((link) => link.category === category)
  } catch (error) {
    console.error("Error checking if category is in use:", error)
    return false
  }
}

// Obtener el conteo de enlaces por categoría
export const getCategoryCounts = async (): Promise<Record<string, number>> => {
  try {
    const links = await getLinks()
    const categories = await getCategories()

    const counts: Record<string, number> = {}
    categories.forEach((category) => {
      counts[category] = links.filter((link) => link.category === category).length
    })

    return counts
  } catch (error) {
    console.error("Error getting category counts:", error)
    return {}
  }
}

