'use client';

import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, PhoneOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const handleEndCall = () => {
    router.push('/');
  };

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Fixed Controls Container with Glassmorphism */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <div className="relative flex items-center justify-between gap-4 rounded-full bg-black/40 px-4 py-3 backdrop-blur-md backdrop-saturate-150 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/5 before:to-transparent before:backdrop-blur-md">
          {/* Main controls group */}
          <div className="relative flex items-center gap-2">
            <CallControls onLeave={() => router.push('/')} />
          </div>

          {/* Right side controls group */}
          <div className="relative flex items-center gap-2">
            {/* Layout switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
                  <LayoutList className="h-4 w-4 text-gray-200" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[180px] rounded-xl border-0 bg-black/60 p-2 backdrop-blur-lg"
              >
                {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() =>
                      setLayout(item.toLowerCase() as CallLayoutType)
                    }
                    className="rounded-lg px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-white/10"
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Stats button */}
            <div className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/10">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
                <CallStatsButton />
              </div>
            </div>

            {/* Participants button */}
            <button
              onClick={() => setShowParticipants((prev) => !prev)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                {
                  'bg-white/20 text-white': showParticipants,
                  'hover:bg-white/10 text-gray-200': !showParticipants,
                },
              )}
            >
              <Users className="h-5 w-5" />
              <span>Participants</span>
            </button>

            {/* End call button */}
            {!isPersonalRoom && (
              <button
                onClick={handleEndCall}
                className="flex items-center gap-2 rounded-full bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600/90 backdrop-blur-sm"
              >
                <PhoneOff className="h-5 w-5" />
                <span>End call for everyone</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingRoom;
