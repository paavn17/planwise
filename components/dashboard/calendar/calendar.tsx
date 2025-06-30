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
      <span className={`ml-2 inline-block w-2 h-2 rounded-full ${priorityColor}`}></span>
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

     <style jsx global>{`
  .fc {
    background: #f9fafb; /* gray-50 */
    border-radius: 0.75rem;
    border: none;
    font-family: inherit;
  }

  .fc-toolbar-title {
    color: #1f2937; /* gray-800 */
    font-size: 1.25rem;
    font-weight: 600;
  }

 /* Base FullCalendar button styles */
.fc .fc-button {
  background-color:  #fb923c !important; /* gray-600 */
  border: none !important;
  color: white !important;
  padding: 0.5rem 0.8rem !important;
  border-radius: 0.5rem !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  transition: background 0.2s ease !important;
  text-transform: capitalize !important;
}

/* Hover state */
.fc .fc-button:hover {
  background-color:rgb(249, 137, 9) !important; /* gray-700 */
}

/* Focus ring */
.fc .fc-button:focus {
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.4) !important; /* gray-500 ring */
}

/* Active state (when button is toggled/pressed) */
.fc .fc-button-active {
  background-color: #1f2937 !important; /* gray-800 */
  color: white !important;
}


  .fc-scroller,
  .fc-daygrid-body,
  .fc-scrollgrid-sync-table {
    background: #f9fafb;
    overflow: visible !important;
    height: auto !important;
  }

  .fc-col-header {
    background: #f9fafb;
    border-bottom: 1px solid #fb923c; /* orange-400 */
  }

  .fc-col-header-cell {
    padding: 0.5rem;
    font-weight: 500;
    color: #9a3412; /* orange-900 */
    border-right: 1px solid #fb923c;
  }

  .fc-daygrid-day {
    border-right: 1px solid #fb923c;
    border-bottom: 1px solid #fb923c;
    min-height: 4rem;
    background: #f9fafb;
  }

  .fc-daygrid-day:hover {
    background:rgb(239, 173, 120); /* amber-100 */
  }

  .fc-daygrid-day-number {
    color: #1f2937; /* gray-800 */
    font-weight: 500;
    padding: 0.25rem;
  }

  .fc-day-today {
    background: #fff7ed !important; /* orange-50 */
  }

  .fc-day-today .fc-daygrid-day-number {
    color: #ea580c; /* orange-600 */
    font-weight: 600;
  }

  .fc-event {
    background: transparent !important;
    border: none !important;
    margin: 0;
    padding: 0;
    font-size: 0.75rem;
  }

  .fc-event:hover {
    background: transparent !important;
    border: none !important;
  }

  .fc-daygrid-more-link {
    color: #f97316;
    font-weight: 500;
    text-decoration: none;
    font-size: 0.75rem;
  }

  .fc-daygrid-more-link:hover {
    color: #ea580c;
    text-decoration: underline;
  }

  .fc-day-other {
  background: #f9fafb !important; /* Tailwind's gray-50 */
}

.fc-day-other .fc-daygrid-day-number {
  color: #9ca3af !important; /* Tailwind's gray-400 */
}
  /* Add space between prev and next buttons */
.fc .fc-button-group > .fc-button {
  margin-right: 0.5rem !important; /* Tailwind's mr-2 equivalent */
}

.fc .fc-button-group > .fc-button:last-child {
  margin-right: 0 !important; /* Remove space after 'next' */
}

`}</style>



    </>
  );
};

export default TaskCalendar;
