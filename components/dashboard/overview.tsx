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

    return () => unsubscribe();
  }, []);

const cards = [
  {
    title: 'Total Tasks',
    count: stats.total,
    border: 'border-orange-600',
    bg: 'bg-orange-500',
    text: 'text-white',
  },
  {
    title: 'Completed',
    count: stats.completed,
    border: 'border-emerald-600',
    bg: 'bg-emerald-500',
    text: 'text-white',
  },
  {
    title: 'In Progress',
    count: stats.inProgress,
    border: 'border-yellow-600',
    bg: 'bg-yellow-500',
    text: 'text-white',
  },
  {
    title: 'Overdue',
    count: stats.overdue,
    border: 'border-red-600',
    bg: 'bg-red-500',
    text: 'text-white',
  },
];




  return (
    <>
      {cards.map((card) => (
        <div
          key={card.title}
          className={`p-4 rounded-lg shadow-sm border ${card.border} ${card.bg}`}
        >
          <p className={`text-sm font-medium ${card.text}`}>{card.title}</p>
          <h2 className={`text-2xl font-bold ${card.text}`}>{card.count}</h2>
        </div>
      ))}
    </>
  );
};

export default OverviewCards;
