import { StatusIcon } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div
      className={cn('status-badge', {
        'bg-green-600': status === 'scheduled',
        'bg-blue-600': status === 'pending',
        'bg-red-600': status === 'canceled',
      })}
    >
      <Image
        src={StatusIcon[status]}
        alt={status}
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={cn('text-12-semibold capitalize', {
          'text-green-500': status === 'scheduled',
          'text-blue-500': status === 'pending',
          'text-red-500': status === 'canceled',
        })}
      >
        {status}
      </p>
    </div>
  );
};

export default StatusBadge;
