'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: string;
  userId: string;
}

const HighPriorityTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid),
          where('priority', '==', 'High')
        );
        const snapshot = await getDocs(q);
        const highPriorityTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];

        setTasks(highPriorityTasks);
      } catch (error) {
        console.error('Failed to fetch high priority tasks:', error);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white text-gray-900 p-4 rounded-xl shadow-md w-full border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">🔥 High Priority Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No high priority tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="bg-gray-100 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{task.title}</span>
                <span className="text-sm text-red-500">{task.dueDate}</span>
              </div>
              <div className="text-sm text-gray-600">{task.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HighPriorityTasks;
