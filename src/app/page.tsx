import PatientForm from '@/components/forms/patient-form';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="asd flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={100}
            width={100}
            alt="Logo"
            className="mb-12 h-10 w-auto"
          />
        </div>

        <PatientForm />
      </section>
    </div>
  );
}
