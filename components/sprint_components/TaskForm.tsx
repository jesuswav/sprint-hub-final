import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native'

// time pickers
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'

interface FormModalProps {
  projectIdProp?: string
  projectName?: string
  onClose: () => void
}

const TaskForm: React.FC<FormModalProps> = ({
  onClose,
  projectIdProp,
  projectName,
}) => {
  // estados para el formulario
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [state, setState] = useState('')
  const [projectId, setProjectId] = useState('')
  const [responsibleId, setResponsibleId] = useState('')

  // para los proyectos y responsables desde la api
  const [projects, setProjects] = useState([
    { id: projectIdProp, nombre: projectName },
    { id: '674fa9750af4be9629c58ce7', nombre: 'Carlos García' },
  ])
  const [members, setMembers] = useState([])

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

  const handleSubmit = () => {
    if (
      !name ||
      !startDate ||
      !endDate ||
      !state ||
      !projectId ||
      !responsibleId
    ) {
      console.log('Por favor complete todos los campos')
      return
    }
    console.log({ name, startDate, endDate, state, projectId, responsibleId })

    // enviar los datos por medio de una funcion
    registerTask()

    // cerrar el modal despues de la peticion
    onClose()
  }

  // Función para enviar la solicitud
  const registerTask = async () => {
    const body = {
      nombre: name,
      fechaInicio: startDate,
      fechaEntrega: endDate,
      estado: state,
      idProyecto: projectId,
      responsableId: responsibleId,
    }

    try {
      const response = await fetch(
        'http://192.168.0.112:5000/api/tareas/registrar',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      if (response.ok) {
        Alert.alert('Éxito', 'Tarea registrada correctamente')
        console.log(await response.json()) // Opcional: Ver la respuesta del servidor
      } else {
        Alert.alert('Error', 'No se pudo registrar la tarea')
        console.error(await response.text()) // Opcional: Ver errores del servidor
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al realizar la solicitud')
      console.error(error)
    }
  }

  // traer los proyectos para renderizar en los estados
  const [allProjects, setAllProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para obtener datos desde un endpoint
  const getData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `http://192.168.0.112:5000/api/proyectos/${projectIdProp}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setMembers(data.miembros) // Actualizar el estado con los datos recibidos
      console.log('Response:', data.miembros)
    } catch (err: any) {
      setError(err.message)
      console.error('Fetch error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Llama a la función al montar el componente
    getData()
  }, [])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.modalBackground}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Create New Task</Text>

        {/* Input de nombre */}
        <TextInput
          style={styles.input}
          placeholder='Task title'
          placeholderTextColor='#888'
          value={name}
          onChangeText={setName}
        />

        {/* Fechas */}
        <View style={{ display: 'flex', flexDirection: 'row', gap: 22 }}>
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
                {startDate
                  ? startDate.toISOString().split('T')[0]
                  : 'Start Date'}
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

        {/* proyecto */}
        <Picker
          selectedValue={state}
          onValueChange={(itemValue: any) => setState(itemValue)}
          style={{ height: 180, width: 300 }}
        >
          <Picker.Item key={1} label={'pendiente'} value={'pendiente'} />
          <Picker.Item key={1} label={'en proceso'} value={'en proceso'} />
          <Picker.Item key={1} label={'terminada'} value={'terminada'} />
        </Picker>

        {/* pickers para proyecto y responsable */}
        {/* Select Proyecto */}
        <View style={{ display: 'flex', flexDirection: 'row', height: 200 }}>
          <View>
            <Picker
              selectedValue={projectId}
              onValueChange={(itemValue: any) => setProjectId(itemValue)}
              style={{ height: 50, width: 150 }}
            >
              <Picker.Item label='Seleccionar proyecto' value='' />
              {projects.map((proyecto) => (
                <Picker.Item
                  key={proyecto.id}
                  label={proyecto.nombre}
                  value={proyecto.id}
                />
              ))}
            </Picker>
          </View>
          {/* Select Responsable */}
          <View>
            <Picker
              selectedValue={responsibleId}
              onValueChange={(itemValue: any) => setResponsibleId(itemValue)}
              style={{ height: 50, width: 150 }}
            >
              <Picker.Item label='Seleccionar responsable' value='' />
              {members.map((member) => (
                <Picker.Item
                  key={member._id}
                  label={member.nombre}
                  value={member._id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Botones */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1E1E1E', // Color de fondo oscuro
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF', // Texto claro para modo oscuro
  },
  input: {
    width: '100%',
    backgroundColor: '#2C2C2C', // Fondo oscuro para el input
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#EDEDED', // Texto claro en el input
    borderWidth: 1,
    borderColor: '#3A3A3A', // Borde más oscuro
  },
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
  // para time pickers
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
  // estilos para el picker
  picker: {
    height: 50,
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    marginBottom: 10,
    color: '#EDEDED',
  },
})

export default TaskForm
