'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import TaskForm, { TaskFormData } from './newtask';
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Define the shape of a task
export type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'To Do' | 'In Progress' | 'Completed';
  dueDate: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Helpers for UI
const getPriorityDot = (priority: Task['priority']) => {
  switch (priority) {
    case 'High': return 'bg-red-500';
    case 'Medium': return 'bg-yellow-400';
    case 'Low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'To Do': return 'text-blue-400';
    case 'In Progress': return 'text-yellow-400';
    case 'Completed': return 'text-green-400';
    case 'Not Started': return 'text-gray-400';
    default: return 'text-white';
  }
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch tasks securely and unsubscribe on logout
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

      unsubscribeTasks = onSnapshot(
        q,
        (snapshot) => {
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
        },
        (error) => {
          console.error('Snapshot error:', error);
          setTasks([]);
          setLoading(false);
        }
      );
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

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 text-white min-h-screen bg-zinc-900 relative">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-800 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring focus:ring-white/20"
        />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-semibold"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-10 text-gray-400">Loading tasks...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="relative bg-zinc-800 border border-zinc-700 rounded-xl p-5 flex flex-col justify-between shadow-md"
              >
                <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)} shadow-[0_0_8px_2px_rgba(255,255,255,0.3)]`}
                    title={`Priority: ${task.priority}`}
                  />
                  <p className={`text-xs ${getStatusColor(task.status)}`}>{task.status}</p>
                </div>

                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1">{task.title}</h2>
                  <p className="text-base text-gray-300 leading-relaxed mb-4">{task.description}</p>

                  <div className="flex flex-wrap gap-2 text-xs text-white/80">
                    <span className="bg-indigo-600 px-2 py-1 rounded-full">
                      {task.category}
                    </span>
                    <span className="bg-zinc-700 px-2 py-1 rounded-full">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 text-sm transition">
                    <Pencil size={16} /> Edit
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-sm transition">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTasks.length === 0 && !loading && (
            <div className="text-center mt-10 text-gray-400">No tasks found.</div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
