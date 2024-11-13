'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({
  className,
  img,
  title,
  description,
  handleClick,
}: HomeCardProps) => {
  return (
    <button
      onClick={handleClick}
      className={cn(
        'group flex min-h-[200px] w-full flex-col items-start rounded-3xl p-6 text-left transition-all duration-300 hover:scale-[1.02]',
        className,
      )}
    >
      <div className="mb-auto rounded-xl bg-white/10 p-3 transition-transform duration-300 group-hover:-rotate-6">
        <Image
          src={img}
          alt={title}
          width={28}
          height={28}
          className="h-7 w-7"
        />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </button>
  );
};

export default HomeCard;
