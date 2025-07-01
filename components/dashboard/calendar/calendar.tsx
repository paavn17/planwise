'use client';

import { useEffect, useState } from 'react';
import FullCalendar, { EventInput, EventContentArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import './calendar.css';

interface Task {
  title: string;
  dueDate: string;
  priority: string;
  userId: string;
}

const getPriorityColor = (priority: string) => {
  const clean = priority.trim().toLowerCase();
  switch (clean) {
    case 'high':
      return 'bg-red-500 shadow-red-500/60';
    case 'medium':
      return 'bg-yellow-400 shadow-yellow-400/60';
    case 'low':
      return 'bg-green-400 shadow-green-400/60';
    default:
      return 'bg-gray-400 shadow-gray-400/60';
  }
};

const TaskCalendar = () => {
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        const taskEvents: EventInput[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Task;
          return {
            title: data.title,
            start: data.dueDate,
            end: data.dueDate,
            extendedProps: {
              priority: data.priority,
            },
          };
        });

        setEvents(taskEvents);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderEventContent = (eventInfo: EventContentArg) => {
    const priority = eventInfo.event.extendedProps.priority || 'low';
    const priorityColor = getPriorityColor(priority);

    return (
      <div className="flex justify-center items-center gap-2 text-xs font-medium text-gray-800">
        <span
          className={`inline-block ${priorityColor} w-2 h-2 rounded-full aspect-square flex-shrink-0`}
        ></span>
        <span className="truncate">{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={renderEventContent}
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'today prev,next',
        }}
        fixedWeekCount={false}
        showNonCurrentDates={false}
        height="auto"
        contentHeight="auto"
        aspectRatio={1.8}
        dayHeaderClassNames="text-gray-600 font-medium text-sm"
        dayCellClassNames="border-gray-200"
        eventClassNames="rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
      />
    </>
  );
};

export default TaskCalendar;
