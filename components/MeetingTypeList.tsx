'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Meeting Created',
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
    }
  };

  if (!client || !user) return <Loader />;

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <div
        onClick={() => setMeetingState('isInstantMeeting')}
        className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-all duration-300 group-hover:bg-white/20" />
        <img
          src="/icons/add-meeting.svg"
          alt="New Meeting"
          className="mb-4 h-12 w-12 transition-transform duration-300 group-hover:-rotate-12"
        />
        <h3 className="mb-1 text-xl font-bold text-white">New Meeting</h3>
        <p className="text-sm text-gray-200">Start an instant meeting</p>
      </div>

      <div
        onClick={() => setMeetingState('isJoiningMeeting')}
        className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-all duration-300 group-hover:bg-white/20" />
        <img
          src="/icons/join-meeting.svg"
          alt="Join"
          className="mb-4 h-12 w-12 transition-transform duration-300 group-hover:-rotate-12"
        />
        <h3 className="mb-1 text-xl font-bold text-white">Join Meeting</h3>
        <p className="text-sm text-gray-200">via invitation link</p>
      </div>

      <div
        onClick={() => setMeetingState('isScheduleMeeting')}
        className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-all duration-300 group-hover:bg-white/20" />
        <img
          src="/icons/schedule.svg"
          alt="Schedule"
          className="mb-4 h-12 w-12 transition-transform duration-300 group-hover:-rotate-12"
        />
        <h3 className="mb-1 text-xl font-bold text-white">Schedule Meeting</h3>
        <p className="text-sm text-gray-200">Plan your meeting</p>
      </div>

      <div
        onClick={() => router.push('/recordings')}
        className="group relative overflow-hidden rounded-[20px] bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-all duration-300 group-hover:bg-white/20" />
        <img
          src="/icons/recordings.svg"
          alt="Recordings"
          className="mb-4 h-12 w-12 transition-transform duration-300 group-hover:-rotate-12"
        />
        <h3 className="mb-1 text-xl font-bold text-white">View Recordings</h3>
        <p className="text-sm text-gray-200">Meeting Recordings</p>
      </div>

      {/* Modals */}
      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-2.5">
              <label className="text-base font-normal leading-[22.4px] text-sky-2">
                Add a description
              </label>
              <Textarea
                className="min-h-[120px] rounded-xl border-none bg-dark-3 p-4 text-white placeholder-gray-400 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
                placeholder="Enter meeting details..."
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="text-base font-normal leading-[22.4px] text-sky-2">
                Select Date and Time
              </label>
              <ReactDatePicker
                selected={values.dateTime}
                onChange={(date) => setValues({ ...values, dateTime: date! })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded-xl bg-dark-3 p-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link Copied' });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="rounded-xl border-none bg-dark-3 p-4 text-white placeholder-gray-400 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
