import { Ionicons } from '@expo/vector-icons'
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { ThemedText } from '../ThemedText'
import { useRouter } from 'expo-router'
import { useThemeColor } from '@/hooks/useThemeColor'

export type TaskItemProps = {
  title: string
}

// Cálculo del ancho para los elementos en dos columnas
const ITEM_SIZE = Dimensions.get('window').width / 2 - 20

const TaskItem = ({ title }: TaskItemProps) => {
  const router = useRouter()

  const handlePress = () => {
    // Navega a la pantalla de detalles pasando el arreglo completo en JSON
    router.push({
      pathname: '/taskPage',
      params: { taskName: 'Task name' },
    })
  }

  const backgroundColor = useThemeColor(
    { light: '#D9D9D9', dark: '#000000' },
    'background'
  )

  const iconColor = useThemeColor(
    { light: '#F5A818', dark: '#F5A818' },
    'background'
  )

  return (
    <TouchableOpacity onPress={handlePress} style={styles.itemWrapper}>
      <View style={[styles.itemContainer, { backgroundColor }]}>
        <ThemedText style={styles.itemText}>{title}</ThemedText>
        <Ionicons name='arrow-forward-outline' size={32} color={iconColor} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: ITEM_SIZE - 10,
    height: ITEM_SIZE - 10,
    margin: 10, // Separación alrededor de cada elemento
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
  },
  itemText: {
    fontSize: 22,
    textAlign: 'center',
  },
})

export default TaskItem
