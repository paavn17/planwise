'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { parseISO, isToday, isWithinInterval, subDays } from 'date-fns';

interface Task {
  title: string;
  dueDate: string;
  status: 'Not Yet Started' | 'To Do' | 'In Progress' | 'Completed';
  userId: string;
}

const TaskSummary = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        const fetched = snapshot.docs
          .map(doc => doc.data() as Task)
          .filter(task => task.dueDate && !isNaN(Date.parse(task.dueDate)));

        setTasks(fetched);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const today = new Date();

  const todaysTasks = tasks.filter(task =>
    isToday(parseISO(task.dueDate)) &&
    task.status !== 'Completed'
  );

  const recentlyCompleted = tasks.filter(task =>
    task.status === 'Completed' &&
    isWithinInterval(parseISO(task.dueDate), {
      start: subDays(today, 7),
      end: today,
    })
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-300">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      {/* Today's Tasks */}
      <div className="bg-zinc-900 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3 text-white">📌 Today's Tasks</h2>
        {todaysTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks for today 🎉</p>
        ) : (
          <ul className="space-y-2">
            {todaysTasks.map((task, index) => (
              <li key={index} className="bg-zinc-800 px-3 py-2 rounded-md text-white shadow">
                <div className="flex justify-between">
                  <span>{task.title}</span>
                  <span className="text-xs text-yellow-400">({task.status})</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recently Completed */}
      <div className="bg-zinc-900 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3 text-white"> Recently Completed (last 7 days)</h2>
        {recentlyCompleted.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent completions</p>
        ) : (
          <ul className="space-y-2">
            {recentlyCompleted.map((task, index) => (
              <li key={index} className="bg-zinc-800 px-3 py-2 rounded-md text-white shadow">
                <div className="flex justify-between">
                  <span>{task.title}</span>
                  <span className="text-xs text-green-400">{task.dueDate.slice(0, 10)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskSummary;
