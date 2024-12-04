import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'

// time pickers
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'

interface FormModalProps {
  onClose: () => void
}

const TaskForm: React.FC<FormModalProps> = ({ onClose }) => {
  // estados para el formulario
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [state, setState] = useState('')
  const [projectId, setProjectId] = useState('')
  const [responsibleId, setResponsibleId] = useState('')

  // para los proyectos y responsables desde la api
  const [projects, setProjects] = useState([
    { id: '674fa7e675c85aa64e39e9b0', nombre: 'Proyecto A' },
    { id: '674fa7e675c85aa64e39e9b2', nombre: 'Proyecto B' },
  ])
  const [members, setMembers] = useState([
    { id: '674fa9750af4be9629c58ce7', nombre: 'Carlos García' },
    { id: '674fa9750af4be9629c58ce5', nombre: 'Alan García' },
  ])

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
    console.log({ name, startDate, endDate, projectId, responsibleId })
    onClose()
  }

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
          <Picker.Item key={1} label={'en progreso'} value={'en progreso'} />
          <Picker.Item key={1} label={'terminado'} value={'terminado'} />
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
                  key={member.id}
                  label={member.nombre}
                  value={member.id}
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
