import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientsListScreen from '../screens/PatientsListScreen';
import PatientDetailsScreen from '../screens/PatientDetailsScreen';
import PatientFormScreen from '../screens/PatientFormScreen';
import AppointmentsListScreen from '../screens/AppointmentsListScreen';
import AppointmentDetailsScreen from '../screens/AppointmentDetailsScreen';
import AppointmentFormScreen from '../screens/AppointmentFormScreen';
import { Patient, Appointment } from '../types';

export type RootStackParamList = {
  PatientsList: undefined;
  PatientDetails: { patientId: string };
  PatientForm: { patient?: Patient } | undefined;
  AppointmentsList: undefined;
  AppointmentDetails: { appointmentId: string };
  AppointmentForm:
    | { appointment?: Appointment; patientId?: string; patientName?: string }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="PatientsList" component={PatientsListScreen} options={{ title: 'Patients' }} />
    <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} options={{ title: 'Patient' }} />
    <Stack.Screen name="PatientForm" component={PatientFormScreen} options={{ title: 'Edit Patient' }} />
    <Stack.Screen name="AppointmentsList" component={AppointmentsListScreen} options={{ title: 'Appointments' }} />
    <Stack.Screen
      name="AppointmentDetails"
      component={AppointmentDetailsScreen}
      options={{ title: 'Appointment' }}
    />
    <Stack.Screen name="AppointmentForm" component={AppointmentFormScreen} options={{ title: 'Edit Appointment' }} />
  </Stack.Navigator>
);

export default RootNavigator;
