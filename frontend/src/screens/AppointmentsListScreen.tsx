import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Appointment, AppointmentStatus } from '../types';
import { appointmentsApi } from '../api/appointments';

type Props = NativeStackScreenProps<RootStackParamList, 'AppointmentsList'>;

const statusFilters: (AppointmentStatus | 'all')[] = ['all', 'scheduled', 'done', 'cancelled'];

const AppointmentsListScreen: React.FC<Props> = ({ navigation }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<AppointmentStatus | 'all'>('scheduled');
  const [todayOnly, setTodayOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const dateFrom = todayOnly ? new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString() : undefined;
      const dateTo = todayOnly
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString()
        : undefined;
      const data = await appointmentsApi.list({
        status: status === 'all' ? undefined : status,
        dateFrom,
        dateTo,
      });
      setAppointments(data.items);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [status, todayOnly]);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {statusFilters.map((item) => (
          <TouchableOpacity key={item} onPress={() => setStatus(item)} style={styles.filterButton}>
            <Text style={{ fontWeight: status === item ? '700' : '400' }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.filterRow}>
        <Button title={todayOnly ? 'Showing Today' : 'Showing All'} onPress={() => setTodayOnly(!todayOnly)} />
        <Button title="Refresh" onPress={loadAppointments} />
      </View>
      {loading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: item.id })}
          >
            <Text style={styles.title}>{new Date(item.date).toLocaleString()}</Text>
            <Text>Status: {item.status}</Text>
            <Text>
              Patient: {typeof item.patientId === 'object'
                ? `${item.patientId.firstName} ${item.patientId.lastName}`
                : item.patientId}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No appointments found.</Text>}
      />
      <Button title="Add Appointment" onPress={() => navigation.navigate('AppointmentForm')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  item: { paddingVertical: 10, borderBottomColor: '#eee', borderBottomWidth: 1 },
  title: { fontWeight: '600' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  filterButton: { padding: 6, borderColor: '#ddd', borderWidth: 1, borderRadius: 4 },
  error: { color: 'red' },
});

export default AppointmentsListScreen;
