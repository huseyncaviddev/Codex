import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Appointment, AppointmentStatus, Patient } from '../types';
import { appointmentsApi } from '../api/appointments';
import { patientsApi } from '../api/patients';

type Props = NativeStackScreenProps<RootStackParamList, 'AppointmentForm'>;

const AppointmentFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const appointment = route.params?.appointment;
  const presetPatientId = route.params?.patientId;
  const patientName = route.params?.patientName;
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState<Partial<Appointment>>({
    patientId: appointment?.patientId || presetPatientId || '',
    date: appointment?.date ? appointment.date : '',
    status: appointment?.status || 'scheduled',
    reason: appointment?.reason || '',
    notes: appointment?.notes || '',
    durationMinutes: appointment?.durationMinutes || 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await patientsApi.list();
        setPatients(data.items);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    loadPatients();
  }, []);

  const onChange = (key: keyof Appointment, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    if (!form.patientId || !form.date) {
      setError('Patient and date are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (appointment) {
        await appointmentsApi.update(appointment.id, form);
      } else {
        await appointmentsApi.create(form);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text>Patient</Text>
      <TextInput
        placeholder="Patient ID"
        value={String(form.patientId || '')}
        style={styles.input}
        onChangeText={(text) => onChange('patientId', text)}
      />
      {patientName && <Text>Prefilled: {patientName}</Text>}
      <TextInput
        placeholder="Date (ISO 8601)"
        value={form.date as string}
        onChangeText={(text) => onChange('date', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Status (scheduled/done/cancelled)"
        value={form.status as AppointmentStatus}
        onChangeText={(text) => onChange('status', text as AppointmentStatus)}
        style={styles.input}
      />
      <TextInput
        placeholder="Reason"
        value={form.reason || ''}
        onChangeText={(text) => onChange('reason', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Notes"
        value={form.notes || ''}
        onChangeText={(text) => onChange('notes', text)}
        style={[styles.input, styles.textArea]}
        multiline
      />
      <TextInput
        placeholder="Duration Minutes"
        value={String(form.durationMinutes || 30)}
        onChangeText={(text) => onChange('durationMinutes', Number(text))}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title={appointment ? 'Update Appointment' : 'Create Appointment'} onPress={onSubmit} disabled={loading} />
      <View style={styles.helper}>
        <Text>Available patients:</Text>
        {patients.map((p) => (
          <Text key={p.id}>
            {p.id} - {p.firstName} {p.lastName}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  input: { borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 4 },
  textArea: { height: 100, textAlignVertical: 'top' },
  error: { color: 'red' },
  helper: { marginTop: 12, gap: 4 },
});

export default AppointmentFormScreen;
