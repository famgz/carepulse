import { z } from 'zod';

const charsMessage = (label: string, type: 'min' | 'max', size: number) =>
  `${label} must be at ${type === 'min' ? 'least' : 'most'} ${size} characters`;

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, charsMessage('Name', 'min', 2))
    .max(50, charsMessage('Name', 'max', 50)),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, charsMessage('Name', 'min', 2))
    .max(50, charsMessage('Name', 'max', 50)),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
  birthDate: z.coerce.date(),
  gender: z.enum(['male', 'female', 'other']),
  address: z
    .string()
    .min(5, charsMessage('Address', 'min', 5))
    .max(500, charsMessage('Address', 'max', 500)),
  occupation: z
    .string()
    .min(2, charsMessage('Occupation', 'min', 2))
    .max(500, charsMessage('Occupation', 'max', 500)),
  emergencyContactName: z
    .string()
    .min(2, charsMessage('Contact name', 'min', 2))
    .max(50, charsMessage('Contact name', 'max', 50)),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      'Invalid phone number'
    ),
  primaryPhysician: z.string().min(2, 'Select at least one doctor'),
  insuranceProvider: z
    .string()
    .min(2, charsMessage('Insurance name', 'min', 2))
    .max(50, charsMessage('Insurance name', 'max', 50)),
  insurancePolicyNumber: z
    .string()
    .min(2, charsMessage('Policy number', 'min', 2))
    .max(50, charsMessage('Policy number', 'max', 50)),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: 'You must consent to treatment in order to proceed',
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: 'You must consent to disclosure in order to proceed',
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: 'You must consent to privacy in order to proceed',
    }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, 'Select at least one doctor'),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, charsMessage('Reason', 'min', 2))
    .max(500, charsMessage('Reason', 'max', 500)),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, 'Select at least one doctor'),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, 'Select at least one doctor'),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, charsMessage('Reason', 'min', 2))
    .max(500, charsMessage('Reason', 'max', 500)),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case 'create':
      return CreateAppointmentSchema;
    case 'cancel':
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
