'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import TaskForm, { TaskFormData } from './newtask';
import {
  addDoc,
  collection,
  doc,
  query,
  updateDoc,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type Task = {
  id: string;
  title: string;
  description: string;
  category: string[] | string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'To Do' | 'In Progress' | 'Completed';
  dueDate: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

const getPriorityDot = (priority: Task['priority']) => {
  switch (priority) {
    case 'High': return 'bg-red-500';
    case 'Medium': return 'bg-yellow-400';
    case 'Low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getCategoryTextColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    Coding: 'text-indigo-500',
    Design: 'text-rose-500',
    Sports: 'text-lime-500',
    Learning: 'text-sky-500',
    Work: 'text-amber-500',
    Personal: 'text-pink-500',
    Health: 'text-emerald-500',
    Finance: 'text-teal-500',
    Travel: 'text-cyan-500',
    Shopping: 'text-fuchsia-500',
    Chores: 'text-green-500',
    Fitness: 'text-orange-500',
    Reading: 'text-violet-500',
    Volunteering: 'text-red-500',
  };
  return colorMap[category] || 'text-gray-500';
};

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'To Do': return 'text-purple-600';
    case 'In Progress': return 'text-yellow-500';
    case 'Completed': return 'text-green-600';
    default: return 'text-gray-500';
  }
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<'none' | 'priority' | 'dueDate'>('none');

  useEffect(() => {
    let unsubscribeTasks: (() => void) | null = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (unsubscribeTasks) unsubscribeTasks();
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      unsubscribeTasks = onSnapshot(q, (snapshot) => {
        const userTasks = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
          } as Task;
        });
        setTasks(userTasks);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeTasks) unsubscribeTasks();
    };
  }, []);

  const handleAddTask = async (data: TaskFormData) => {
    const user = auth.currentUser;
    if (!user) return;

    const task = {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'tasks'), task);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const categoryText = Array.isArray(task.category) ? task.category.join(' ') : task.category;
    return (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryText.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'priority') {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortOption === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0; // Default (no sorting)
  });

  return (
    <div className="p-6 text-gray-800 min-h-screen bg-gray-50">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-md bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring focus:ring-gray-400/30"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'none' | 'priority' | 'dueDate')}
            className="px-4 py-2 rounded-md bg-white text-gray-800 border border-gray-300 text-sm cursor-pointer"
          >
            <option value="none">Sort (default)</option>
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-10 text-gray-500">Loading tasks...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="relative bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between shadow-sm h-full"
              >
                {/* Shiny Priority Dot */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-3 h-3 rounded-full ${getPriorityDot(task.priority)} shadow-md animate-[ping_1s_infinite] ring-2 ring-white ring-offset-2`}
                    title={`Priority: ${task.priority}`}
                  />
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{task.title}</h2>
                    <p className="text-base text-gray-600 leading-relaxed mb-2 line-clamp-4">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs mt-2 mb-4">
                    {(Array.isArray(task.category) ? task.category : [task.category]).map((cat, i) => (
                      <span key={i} className={`font-medium ${getCategoryTextColor(cat)}`}>
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <div className={`text-sm font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-3">
                    <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm transition">
                      <Pencil size={16} /> Edit
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-500 hover:bg-red-400 text-white text-sm transition">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedTasks.length === 0 && !loading && (
            <div className="text-center mt-10 text-gray-500">No tasks found.</div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <TaskForm onSubmit={handleAddTask} onCancel={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}
