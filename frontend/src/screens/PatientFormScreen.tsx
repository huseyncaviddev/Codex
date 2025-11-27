import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { patientsApi } from '../api/patients';
import { Patient } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PatientForm'>;

const PatientFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const patient = route.params?.patient;
  const [form, setForm] = useState<Partial<Patient>>({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    phone: patient?.phone || '',
    email: patient?.email || '',
    dateOfBirth: patient?.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
    notes: patient?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (key: keyof Patient, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.phone) {
      setError('First name, last name, and phone are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (patient) {
        await patientsApi.update(patient.id, form);
      } else {
        await patientsApi.create(form);
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
      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={form.firstName}
        onChangeText={(text) => onChange('firstName', text)}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={form.lastName}
        onChangeText={(text) => onChange('lastName', text)}
      />
      <TextInput
        placeholder="Phone"
        style={styles.input}
        value={form.phone}
        onChangeText={(text) => onChange('phone', text)}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        onChangeText={(text) => onChange('email', text)}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Date of Birth (YYYY-MM-DD)"
        style={styles.input}
        value={form.dateOfBirth}
        onChangeText={(text) => onChange('dateOfBirth', text)}
      />
      <TextInput
        placeholder="Notes"
        style={[styles.input, styles.textArea]}
        value={form.notes}
        onChangeText={(text) => onChange('notes', text)}
        multiline
      />
      <Button title={patient ? 'Update Patient' : 'Create Patient'} onPress={onSubmit} disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  input: { borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 4 },
  textArea: { height: 100, textAlignVertical: 'top' },
  error: { color: 'red' },
});

export default PatientFormScreen;
