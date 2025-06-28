'use client';

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import enUS from 'date-fns/locale/en-US';
import './calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Task {
  dueDate: string;
  title: string;
  status: string;
  userId: string;
}

interface CalendarEvent extends Event {
  title: string;
  start: Date;
  end: Date;
  status: string;
}

const TaskCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        const taskEvents: CalendarEvent[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Task;
          const dueDate = new Date(data.dueDate);

          return {
            title: data.title,
            start: dueDate,
            end: dueDate,
            status: data.status,
          };
        });

        setEvents(taskEvents);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // 👇 Style based on task status
  const eventStyleGetter = (event: CalendarEvent) => {
    let bg = '#4f46e5'; // default purple
    if (event.status === 'Completed') bg = '#059669';
    else if (event.status === 'In Progress') bg = '#0ea5e9';
    else if (event.status === 'To Do' || event.status === 'Not Yet Started') bg = '#dc2626';

    return {
      style: {
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
      },
    };
  };

  // 👇 Custom component to center title and show small status badge
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="text-center flex flex-col items-center justify-center text-xs font-medium">
      <span className="text-black">{event.title}</span>
      <span
        className="mt-1 px-2 py-0.5 rounded-full text-[10px] text-black"
        style={{
          backgroundColor:
            event.status === 'Completed'
              ? '#059669'
              : event.status === 'In Progress'
              ? '#0ea5e9'
              : '#dc2626',
          width: 'fit-content',
        }}
      >
        {event.status}
      </span>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-black">
      <h2 className="text-xl font-semibold mb-4">📅 Task Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'agenda']}
        defaultView="month"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        components={{ event: EventComponent }}
      />
    </div>
  );
};

export default TaskCalendar;
