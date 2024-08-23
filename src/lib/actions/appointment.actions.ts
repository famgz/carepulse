'use server';

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from '@/lib/appwrite.config';
import { parseStringify } from '@/lib/utils';
import { Appointment } from '@/types/appwrite.types';
import { ID, Query } from 'node-appwrite';

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (err) {
    console.log(err);
  }
};

export const getAppointment = async (
  appointmentId: string
): Promise<Appointment | undefined> => {
  try {
    const appointments = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointments);
  } catch (err) {
    console.log(err);
  }
};
