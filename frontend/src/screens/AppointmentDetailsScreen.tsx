import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { appointmentsApi } from '../api/appointments';
import { Appointment, AppointmentStatus, Patient } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AppointmentDetails'>;

const statuses: AppointmentStatus[] = ['scheduled', 'done', 'cancelled'];

const AppointmentDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentsApi.get(appointmentId);
      setAppointment(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [appointmentId]);

  const changeStatus = async (status: AppointmentStatus) => {
    if (!appointment) return;
    try {
      await appointmentsApi.update(appointment.id, { status });
      loadData();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  if (loading) return <ActivityIndicator style={styles.center} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!appointment) return <Text>Appointment not found</Text>;

  const patient = appointment.patientId as Patient | string;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{new Date(appointment.date).toLocaleString()}</Text>
      <Text>Status: {appointment.status}</Text>
      <Text>Duration: {appointment.durationMinutes || 30} minutes</Text>
      <Text>Reason: {appointment.reason || 'N/A'}</Text>
      <Text>Notes: {appointment.notes || 'N/A'}</Text>
      <Text>
        Patient:
        {typeof patient === 'string'
          ? patient
          : ` ${patient.firstName} ${patient.lastName} (${patient.phone})`}
      </Text>

      <View style={styles.buttonRow}>
        {statuses.map((status) => (
          <Button key={status} title={`Mark ${status}`} onPress={() => changeStatus(status)} />
        ))}
      </View>

      <Button
        title="Edit Appointment"
        onPress={() => navigation.navigate('AppointmentForm', { appointment })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 20, fontWeight: '700' },
  buttonRow: { flexDirection: 'row', gap: 8 },
  center: { flex: 1, justifyContent: 'center' },
  error: { color: 'red' },
});

export default AppointmentDetailsScreen;
