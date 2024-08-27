import StatCard from '@/components/stat-card';
import { columns } from '@/components/table/columns';
import { DataTable } from '@/components/table/data-table';
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const AdminPage = async () => {
  const appointments = await getRecentAppointmentList();

  if (!appointments) return notFound();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-14">
      <header className="admin-header">
        <Link href={'/'} className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="Logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome, Admin</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="canceled"
            count={appointments.canceledCount}
            label="canceled appointments"
            icon="/assets/icons/canceled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default AdminPage;
