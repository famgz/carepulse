'use server';

import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from '@/lib/appwrite.config';
import { formatDateTime, parseStringify } from '@/lib/utils';
import { Appointment } from '@/types/appwrite.types';
import { revalidatePath } from 'next/cache';
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

export const getAppointment = async (appointmentId: string) => {
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

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );

    const initialCounts = {
      scheduled: 0,
      pending: 0,
      canceled: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        acc[appointment.status] += 1;
        return acc;
      },
      initialCounts
    );

    const data = {
      scheduledCount: counts.scheduled,
      pendingCount: counts.pending,
      canceledCount: counts.canceled,
      totalCount: appointments.total,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (err) {
    console.log(err);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw new Error('Appointment not found');

    // TODO: Validate Twilio account and setup in .env

    const smsMessage = `
    Hi, it's CarePulse.
    ${
      type === 'schedule'
        ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform that your appointment has been canceled. Reason: ${appointment.cancellationReason}`
    }
    `;

    await sendSMSNotification(userId, smsMessage);

    revalidatePath('/admin');

    return parseStringify(updatedAppointment);
  } catch (err) {
    console.log(err);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );

    return parseStringify(message);
  } catch (error) {
    console.log(error);
  }
};
