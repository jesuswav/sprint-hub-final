import { Ionicons } from '@expo/vector-icons'
import { View, StyleSheet, ViewProps, TouchableOpacity } from 'react-native'
import { ThemedText } from '../ThemedText'
import { useRouter } from 'expo-router'

import { useThemeColor } from '@/hooks/useThemeColor'

// type for Tasks
export type Task = {
  id: string
  name: string
  // Agrega más propiedades según sea necesario
}

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
  projectName?: string
  projectId?: string
  tasks?: Task[]
}

const ProjectItem = ({
  lightColor,
  darkColor,
  projectName,
  projectId,
  tasks,
}: ThemedViewProps) => {
  const router = useRouter()

  const handlePress = () => {
    // Navega a la pantalla de detalles pasando el arreglo completo en JSON
    router.push({
      pathname: '/projectPage',
      params: {
        projectName: projectName,
        projectId: projectId,
        tasks: JSON.stringify(tasks),
      },
    })
  }

  const backgroundColor = useThemeColor(
    { light: '#D9D9D9', dark: '#000000' },
    'background'
  )

  const iconColor = useThemeColor(
    {
      light: '#F5A818',
      dark: '#F5A818',
    },
    'background'
  )

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.itemContainer, { backgroundColor }]}>
        <ThemedText style={{ fontSize: 20 }}>{projectName}</ThemedText>
        <Ionicons name='arrow-forward-outline' size={32} color={iconColor} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    height: 72,
  },
})

export default ProjectItem
