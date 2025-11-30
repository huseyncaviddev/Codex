import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Patient } from '../types';
import { patientsApi } from '../api/patients';

type Props = NativeStackScreenProps<RootStackParamList, 'PatientsList'>;

const PatientsListScreen: React.FC<Props> = ({ navigation }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientsApi.list({ search });
      setPatients(data.items);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search by name or phone"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          onSubmitEditing={loadPatients}
        />
        <Button title="Search" onPress={loadPatients} />
      </View>
      {loading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('PatientDetails', { patientId: item.id })}
          >
            <Text style={styles.title}>
              {item.firstName} {item.lastName}
            </Text>
            <Text>{item.phone}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Patient" onPress={() => navigation.navigate('PatientForm')} />
      <View style={styles.spacer} />
      <Button title="View Appointments" onPress={() => navigation.navigate('AppointmentsList')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchRow: { flexDirection: 'row', marginBottom: 12, gap: 8, alignItems: 'center' },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, padding: 8, borderRadius: 4 },
  item: { paddingVertical: 12, borderBottomColor: '#eee', borderBottomWidth: 1 },
  title: { fontWeight: '600', fontSize: 16 },
  spacer: { height: 8 },
  error: { color: 'red', marginBottom: 8 },
});

export default PatientsListScreen;
