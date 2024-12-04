import { useLocalSearchParams } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

const TaskPage = () => {
  // recibir las tareas por medio de parametros de router
  const { projectName, tasks } = useLocalSearchParams<{
    projectName?: string
    tasks?: string // Aquí pasamos tasks como string para luego parsearlo
  }>()

  // Parsear tasks si existe
  const parsedTasks = tasks ? JSON.parse(tasks) : []
  console.log(parsedTasks)

  return (
    <ThemedView style={{ padding: 18 }}>
      <ThemedText type='title'>{parsedTasks.nombre}</ThemedText>
    </ThemedView>
  )
}

export default TaskPage
