import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { appointmentsApi } from '../api/appointments';
import { patientsApi } from '../api/patients';
import { Appointment, Patient } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PatientDetails'>;

const PatientDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patientId } = route.params;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientData, appointmentData] = await Promise.all([
        patientsApi.get(patientId),
        appointmentsApi.list({ patientId }),
      ]);
      setPatient(patientData);
      const sorted = appointmentData.items.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      setAppointments(sorted);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  if (loading) return <ActivityIndicator style={styles.center} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!patient) return <Text style={styles.error}>Patient not found</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {patient.firstName} {patient.lastName}
      </Text>
      <Text>Phone: {patient.phone}</Text>
      {patient.email && <Text>Email: {patient.email}</Text>}
      {patient.dateOfBirth && <Text>DOB: {patient.dateOfBirth?.split('T')[0]}</Text>}
      {patient.notes && <Text>Notes: {patient.notes}</Text>}

      <View style={styles.buttonRow}>
        <Button title="Edit" onPress={() => navigation.navigate('PatientForm', { patient })} />
        <Button
          title="Add Appointment"
          onPress={() =>
            navigation.navigate('AppointmentForm', {
              patientId: patient.id,
              patientName: `${patient.firstName} ${patient.lastName}`,
            })
          }
        />
      </View>

      <Text style={styles.subtitle}>Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentItem}>
            <Text>{new Date(item.date).toLocaleString()}</Text>
            <Text>Status: {item.status}</Text>
            <Button
              title="Details"
              onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: item.id })}
            />
          </View>
        )}
        ListEmptyComponent={<Text>No appointments yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { marginTop: 16, fontSize: 16, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  appointmentItem: { paddingVertical: 8, borderBottomColor: '#eee', borderBottomWidth: 1, gap: 4 },
  center: { flex: 1, justifyContent: 'center' },
  error: { color: 'red', padding: 16 },
});

export default PatientDetailsScreen;
