'use client';

import CustomFormField, { FormFieldType } from '@/components/custom-form-field';
import SubmitButton from '@/components/submit-button';
import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import { Doctors } from '@/constants';
import { createAppointment } from '@/lib/actions/appointment.actions';
import { cn } from '@/lib/utils';
import { getAppointmentSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface AppointmentFormProps {
  userId: string;
  patientId: string;
  type: 'create' | 'cancel' | 'schedule';
}

const AppointmentForm = ({ userId, patientId, type }: AppointmentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: '',
      schedule: new Date(),
      reason: '',
      notes: '',
      cancellationReason: '',
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;

    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
        break;
    }

    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          notes: values.notes,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  let buttonLabel;

  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'create':
      buttonLabel = 'Create Appintment';
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appintment';
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds
          </p>
        </section>

        {type !== 'cancel' && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p className="">{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="notes"
                label="Notes"
                placeholder="Enter notes"
              />
            </div>
          </>
        )}

        {type === 'cancel' && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={cn(
            type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn',
            'w-full'
          )}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
