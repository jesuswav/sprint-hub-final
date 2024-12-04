import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'

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

  // estados para el envio de datos
  // estados para el formulario
  const [name, setName] = useState(parsedTasks.nombre)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [state, setState] = useState(parsedTasks.estado)
  const [projectId, setProjectId] = useState(parsedTasks._id)
  const [responsibleId, setResponsibleId] = useState(
    parsedTasks.responsable._id
  )

  // nose
  const [showInicioPicker, setShowInicioPicker] = useState(false)
  const [showEntregaPicker, setShowEntregaPicker] = useState(false)

  // funcion para cambiar la fecha
  const handleDateChange = (
    event: any,
    selectedDate?: Date, // selectedDate es ahora opcional
    setDate?: React.Dispatch<React.SetStateAction<Date | undefined>>
  ) => {
    // Si selectedDate es undefined, no se actualiza el estado
    console.log(selectedDate)
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  // funcion para enviar los datos de actualizacion
  const handleSubmit = async () => {
    updateTask()
    console.log('Hola')
  }

  // definicion del router para ir una ventana atras
  const router = useRouter()
  // funcion para eliminar una tarea
  const handleDelete = async () => {
    deleteTask()

    // regresar a la ventana anterior
    router.back()
  }

  // Función para enviar la solicitud PUT
  const updateTask = async () => {
    const body = {
      fechaInicio: startDate,
      fechaEntrega: endDate,
    }

    try {
      const response = await fetch(
        `http://192.168.0.112:5000/api/tareas/${parsedTasks._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      if (response.ok) {
        Alert.alert('Éxito', 'Tarea actualizada correctamente')
        console.log(await response.json()) // Opcional: Ver la respuesta del servidor
      } else {
        Alert.alert('Error', 'No se pudo actualizar la tarea')
        console.error(await response.text()) // Opcional: Ver errores del servidor
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al realizar la solicitud')
      console.error(error)
    }
  }

  // Función para enviar la solicitud DELETE
  const deleteTask = async () => {
    const url = `http://192.168.0.112:5000/api/tareas/${parsedTasks._id}`

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        Alert.alert('Éxito', 'Tarea eliminada correctamente')
        console.log(await response.json()) // Opcional: Ver la respuesta del servidor
      } else {
        Alert.alert('Error', 'No se pudo eliminar la tarea')
        console.error(await response.text()) // Opcional: Ver errores del servidor
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al realizar la solicitud')
      console.error(error)
    }
  }

  return (
    <ThemedView style={{ padding: 18 }}>
      <ThemedText type='title'>{parsedTasks.nombre}</ThemedText>
      <ThemedText
        type='defaultSemiBold'
        style={{ fontSize: 20, paddingTop: 10 }}
      >
        Actualizar las fechas
      </ThemedText>

      {/* Fechas que se pueden editar */}
      {/* Fechas */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 22,
          paddingBottom: 22,
          paddingTop: 22,
        }}
      >
        {/* Fecha Inicio */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowInicioPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {startDate ? startDate.toISOString().split('T')[0] : 'Start Date'}
            </Text>
          </TouchableOpacity>

          {showInicioPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode='date'
              display='default'
              onChange={(event: any, date: any) => {
                handleDateChange(event, date, setStartDate)
              }}
            />
          )}
        </View>

        {/* Fecha Entrega */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEntregaPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {endDate ? endDate.toISOString().split('T')[0] : 'End Date'}
            </Text>
          </TouchableOpacity>

          {showEntregaPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode='date'
              display='default'
              onChange={(event: any, date: any) =>
                handleDateChange(event, date, setEndDate)
              }
            />
          )}
        </View>
      </View>

      {/* otros */}
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Actualizar la fecha</Text>
      </Pressable>
      <Pressable style={styles.cancelButton} onPress={handleDelete}>
        <Text style={styles.cancelButtonText}>Eliminar Tarea</Text>
      </Pressable>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  // date button styles
  dateButton: {
    height: 50,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#EDEDED',
  },
  // styles for button
  submitButton: {
    width: '100%',
    backgroundColor: '#F5A818', // Botón de enviar en verde
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#FFFFFF', // Texto blanco en el botón
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#F44336', // Botón de cancelar en rojo
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#FFFFFF', // Texto blanco en el botón
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default TaskPage
