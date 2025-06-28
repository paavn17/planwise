'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { parseISO, isBefore } from 'date-fns';

const OverviewCards = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid)
      );

      const snapshot = await getDocs(q);
      const allTasks = snapshot.docs.map((doc) => doc.data());

      const now = new Date();
      const completed = allTasks.filter((task) => task.status === 'Completed');
      const inProgress = allTasks.filter(
        (task) => task.status === 'In Progress'
      );
      const overdue = allTasks.filter(
        (task) =>
          task.status !== 'Completed' &&
          task.dueDate &&
          isBefore(parseISO(task.dueDate), now)
      );

      setStats({
        total: allTasks.length,
        completed: completed.length,
        inProgress: inProgress.length,
        overdue: overdue.length,
      });
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  const cards = [
    { title: 'Total Tasks', count: stats.total, color: 'bg-blue-600' },
    { title: 'Completed', count: stats.completed, color: 'bg-green-600' },
    { title: 'In Progress', count: stats.inProgress, color: 'bg-yellow-500' },
    { title: 'Overdue', count: stats.overdue, color: 'bg-red-600' },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.title}
          className={`p-4 rounded-lg shadow-md ${card.color} text-white`}
        >
          <p className="text-sm">{card.title}</p>
          <h2 className="text-2xl font-bold">{card.count}</h2>
        </div>
      ))}
    </>
  );
};

export default OverviewCards;
